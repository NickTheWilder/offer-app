import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/types/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        // Generate cleaner types
        maybeValue: 'T | null',
        inputMaybeValue: 'T | null | undefined',
        // Use string for UUIDs instead of 'any'
        scalars: {
          UUID: 'string',
          Decimal: 'number',
        },
        // Don't generate unused filter types
        onlyOperationTypes: true,
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;
