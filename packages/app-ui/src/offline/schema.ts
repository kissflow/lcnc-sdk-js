/**
 * Shape of `lib/kf-schema.json` as written by the `kf-sync` CLI. Used to seed the
 * offline mock so the app runs and is testable outside the Kissflow iframe.
 */
export interface KfSchemaField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

/** A role that can access a model, and its permission (Delete, InitiateItems, …). */
export interface KfSchemaRoleAccess {
  id: string;
  name: string;
  permission: string[];
}

export interface KfSchemaModel {
  id: string;
  name: string;
  description?: string;
  /** "Process" | "Form" (dataform) | "Case" (board) */
  type: string;
  fields: KfSchemaField[];
  systemFields?: string[];
  /** App roles that can access this model (from the builder's member config). */
  roleAccess?: KfSchemaRoleAccess[];
}

export interface KfSchemaRole {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
}

export interface KfSchemaPageParam {
  id: string;
  name: string;
  dataType?: string;
  required?: boolean;
}

export interface KfSchemaPage {
  id: string;
  name: string;
  type: string;
  inputParameters?: KfSchemaPageParam[];
}

export interface KfSchema {
  app: { id: string; domain?: string; accountId?: string };
  generatedAt?: string;
  dataModels: KfSchemaModel[];
  roles: KfSchemaRole[];
  pages?: KfSchemaPage[];
}
