import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:3000/graphql",
    documents: ["src/**/*.{ts,tsx}"],
    generates: {
        "./src/types/generated/": {
            preset: "client",
            plugins: [],
            presetConfig: {
                gqlTagName: "gql",
            },
            config: {
                // Generate cleaner types
                maybeValue: "T | null",
                inputMaybeValue: "T | null | undefined",
                declarationKind: "interface",
                printFieldsOnNewLines: true,
                skipTypename: true,
                useTypeImports: true,
                scalars: {
                    // built-in scalars
                    ID: "string",
                    String: "string",
                    Boolean: "boolean",
                    Int: "number",
                    Float: "number",

                    // custom scalars
                    Decimal: "number",
                    DateTime: "string",
                    Date: "string",
                    DateTimeOffset: "string",
                    Long: "number",
                    UUID: "string",
                },
                // Don't generate unused filter types
                onlyOperationTypes: true,
            },
        },
    },
    ignoreNoDocuments: true,
};

export default config;
