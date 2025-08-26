import type { ApolloError } from "@apollo/client";

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Converts PascalCase field names from API to camelCase for form fields
 */
function convertFieldName(pascalCaseField: string): string {
    return pascalCaseField.charAt(0).toLowerCase() + pascalCaseField.slice(1);
}

export interface FormFieldError {
    fieldName: string;
    message: string;
}

/**
 * Extracts validation errors from GraphQL errors and converts field names to camelCase
 */
export function extractValidationErrors(error: ApolloError): FormFieldError[] {
    const fieldErrors: FormFieldError[] = [];

    if (!error.graphQLErrors) return fieldErrors;

    error.graphQLErrors.forEach((gqlError: unknown) => {
        const typedError = gqlError as { extensions?: { validationErrors?: ValidationError[] } };
        if (typedError.extensions?.validationErrors) {
            typedError.extensions.validationErrors.forEach((validationError: ValidationError) => {
                fieldErrors.push({
                    fieldName: convertFieldName(validationError.field),
                    message: validationError.message
                });
            });
        }
    });

    return fieldErrors;
}
