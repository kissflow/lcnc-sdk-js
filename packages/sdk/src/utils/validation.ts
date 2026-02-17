/**
 * Validation utilities for SDK methods
 */

/**
 * Throws error if value is falsy
 */
export function requireField(value: any, fieldName: string): void {
    if (!value) {
        throw new Error(`${fieldName} is required`);
    }
}

/**
 * Returns a rejected promise if value is falsy, null otherwise
 * Use for async validation in SDK methods
 */
export function requireFieldAsync(value: any, fieldName: string): Promise<never> | null {
    if (!value) {
        return Promise.reject({ message: `${fieldName} is required` });
    }
    return null;
}

/**
 * Returns a rejected promise if any of the values are falsy
 * Use for validating multiple required fields
 */
export function requireFieldsAsync(
    fields: Array<{ value: any; name: string }>
): Promise<never> | null {
    const missingFields = fields.filter(f => !f.value).map(f => f.name);
    if (missingFields.length > 0) {
        return Promise.reject({
            message: `${missingFields.join(" and ")} ${missingFields.length > 1 ? "are" : "is"} required`
        });
    }
    return null;
}
