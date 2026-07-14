/**
 * Kissflow REST API client (server-to-server, access-key auth).
 *
 * Used by the `kf-sync` CLI to read an app's data models and roles. This is a
 * BUILD-TIME tool — it is NOT the in-iframe runtime SDK (`@kissflow/app-core`'s
 * `useKf`). It talks to Kissflow's admin REST API with an access key pair.
 */
export class KissflowClient {
  constructor(env = process.env) {
    this.domain = env.KF_DOMAIN;
    this.accountId = env.KF_ACCOUNT_ID;
    this.appId = env.KF_APP_ID;
    this.accessKeyId = env.KF_ACCESS_KEY_ID;
    this.accessKeySecret = env.KF_ACCESS_KEY_SECRET;

    const missing = [];
    if (!this.domain) missing.push("KF_DOMAIN");
    if (!this.accountId) missing.push("KF_ACCOUNT_ID");
    if (!this.appId) missing.push("KF_APP_ID");
    if (!this.accessKeyId) missing.push("KF_ACCESS_KEY_ID");
    if (!this.accessKeySecret) missing.push("KF_ACCESS_KEY_SECRET");

    if (missing.length > 0) {
      throw new Error(
        `Missing Kissflow env vars: ${missing.join(", ")}. ` +
          `Add them to a .env file (see .env.example).`,
      );
    }
  }

  get headers() {
    return {
      "Content-Type": "application/json",
      "X-Access-Key-Id": this.accessKeyId,
      "X-Access-Key-Secret": this.accessKeySecret,
    };
  }

  async #get(url, label) {
    const res = await fetch(url, { method: "GET", headers: this.headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to ${label} (${res.status}): ${text}`);
    }
    return res.json();
  }

  /**
   * List every flow (dataform / process) in the application.
   * @returns {Promise<Array<{_id: string, Name: string, Description: string, Type: string, Status: string}>>}
   */
  async getAllFlows() {
    const url = `https://${this.domain}/flow/2/${this.accountId}/application/${this.appId}/flow?page_number=1&page_size=500&parent_flows=true&_application_id=${this.appId}`;
    return this.#get(url, "list flows");
  }

  /**
   * Live data models with their fields, shaped for the synced schema.
   * @returns {Promise<Array<{id, name, description, type, fields, systemFields}>>}
   */
  async getFlowsWithFields() {
    const flows = await this.getAllFlows();
    // Only flows whose fields we know how to read. Unknown types (integrations,
    // portals, lists, …) are skipped rather than crashing the whole sync.
    const liveFlows = flows.filter(
      (f) => f.Status === "Live" && KissflowClient.SUPPORTED_TYPES.has(f.Type),
    );

    const models = await Promise.all(
      liveFlows.map(async (flow) => {
        let fields;
        try {
          fields = await this.getFlowFields(flow._id, flow.Type);
        } catch (err) {
          // One bad flow shouldn't sink the rest — warn and skip it.
          console.warn(`  ⚠ skipped ${flow.Type} "${flow.Name}" (${flow._id}): ${err.message}`);
          return null;
        }
        // Per-role access (which app roles can use this model, and their permission).
        let roleAccess = [];
        try {
          roleAccess = await this.getFlowRoleAccess(flow._id, flow.Type);
        } catch {
          /* members optional — leave empty if unavailable */
        }
        return {
          id: flow._id,
          name: flow.Name,
          description: flow.Description || "",
          type: flow.Type,
          fields: fields
            .filter((f) => !f.IsSystemField)
            .map((f) => ({
              id: f.Id,
              name: f.Name,
              type: f.Type,
              required: Boolean(f.Required),
            })),
          systemFields:
            flow.Type === "Process" ? KissflowClient.PROCESS_SYSTEM_FIELDS : [],
          roleAccess,
        };
      }),
    );

    return models.filter(Boolean);
  }

  // form/process/case → REST path segment for the flow family.
  static FAMILY = { Process: "process", Form: "form", Case: "case" };

  /**
   * Which app roles can access a flow, and with what permission (Delete, InitiateItems…).
   * Source: the flow's `member` list (the app builder's role-access config).
   * @returns {Promise<Array<{id: string, name: string, permission: string[]}>>}
   */
  async getFlowRoleAccess(flowId, flowType) {
    const fam = KissflowClient.FAMILY[flowType];
    if (!fam) return [];
    const url = `https://${this.domain}/flow/2/${this.accountId}/${fam}/${flowId}/member?_application_id=${this.appId}`;
    const members = await this.#get(url, `get members for ${flowType} ${flowId}`);
    return (Array.isArray(members) ? members : [])
      .filter((m) => m.Kind === "AppRole")
      .map((m) => ({ id: m._id, name: m.Name, permission: m.Permission || [] }));
  }

  /**
   * Full layout schema for a page — the page-builder's normalized node graph
   * (Containers, Components, Tables, Charts, Forms, FieldMappings, Properties, Styles).
   * @returns {Promise<Record<string, any>>}
   */
  async getPageSchema(pageId) {
    const url = `https://${this.domain}/metadata/2/${this.accountId}/application/${this.appId}/page/${pageId}/schema?_application_id=${this.appId}`;
    return this.#get(url, `get page schema ${pageId}`);
  }

  /**
   * UI pages configured in the app (with their input parameters).
   * @returns {Promise<Array<{id, name, type, inputParameters}>>}
   */
  async getPages() {
    const url = `https://${this.domain}/flow/2/${this.accountId}/application/${this.appId}/page?_application_id=${this.appId}`;
    const pages = await this.#get(url, "list pages");
    return (Array.isArray(pages) ? pages : [])
      .filter((p) => p.Status === "Live")
      .map((p) => ({
        id: p._id,
        name: p.Name,
        type: p.Type,
        inputParameters: (p.InputParameters || []).map((ip) => ({
          id: ip.Id,
          name: ip.Name,
          dataType: ip.DataType,
          required: Boolean(ip.IsRequired),
        })),
      }));
  }

  /**
   * Fields of a flow, dispatched by type.
   * @returns {Promise<Array<{Id: string, Name: string, Type: string, IsSystemField: boolean, Required: boolean}>>}
   */
  async getFlowFields(flowId, flowType) {
    if (flowType === "Process") return this.getProcessFields(flowId);
    if (flowType === "Form") return this.getDataformFields(flowId);
    if (flowType === "Case") return this.getCaseFields(flowId);
    throw new Error(`Unknown flow type "${flowType}" for flow ${flowId}`);
  }

  async getDataformFields(formId) {
    const url = `https://${this.domain}/form/2/${this.accountId}/${formId}/fields?_application_id=${this.appId}`;
    return this.#get(url, `get fields for form ${formId}`);
  }

  async getProcessFields(processId) {
    const url = `https://${this.domain}/process/2/${this.accountId}/${processId}/fields?_application_id=${this.appId}`;
    return this.#get(url, `get fields for process ${processId}`);
  }

  async getCaseFields(caseId) {
    const url = `https://${this.domain}/case/2/${this.accountId}/${caseId}/fields?_application_id=${this.appId}`;
    return this.#get(url, `get fields for case ${caseId}`);
  }

  /**
   * App roles.
   * @returns {Promise<Array<{_id: string, Name: string, Description: string, UserCount: number}>>}
   */
  async getAppRoles() {
    const url = `https://${this.domain}/app_role/2/${this.accountId}/list?page_number=1&page_size=500&_application_id=${this.appId}`;
    return this.#get(url, "get app roles");
  }

  // Flow types whose field schema kf-sync knows how to read. Others (Integration,
  // Portal, List, Dataset, …) are skipped during sync.
  static SUPPORTED_TYPES = new Set(["Process", "Form", "Case"]);

  // Process items always carry these system fields — surface them so generated
  // pages can read status / assignee / request number without guessing.
  static PROCESS_SYSTEM_FIELDS = [
    "_status",
    "_current_step",
    "_current_assigned_to",
    "_submitted_at",
    "_request_number",
    "_progress",
    "_counter",
  ];
}
