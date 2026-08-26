import { Provider } from 'src/components/Provider.jsx';
import { withProviderHttp } from './httpStub';

export default {
  title: 'Atomic Controls/Legacy Components/Provider',
  tags: ['autodocs'],
  component: Provider,
  decorators: [withProviderHttp],
  args: {
    validate: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    properties: {},
    conceptUuid: 'provider-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    showNotification: { action: 'showNotification' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
  },
  parameters: {
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Table of Contents',
      },
      description: {
        component: `
## Overview

Healthcare provider selector that fetches the provider list from the OpenMRS REST API on mount (the HTTP call is mocked with local test data in these stories).

**Value stored:** the provider id (as a string).

## When to use

- Selecting the responsible clinician or provider for an observation.
- Set \`properties.style="autocomplete"\` to enable searchable mode.
        `,
      },
    },
  },
};

export const Default = {};

export const AutocompleteStyle = {
  args: {
    properties: { style: 'autocomplete' },
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'Disabled empty state. No pre-selected value is passed to avoid triggering the ' +
          'loading spinner (the component renders a spinner when value is truthy but providerData is not yet loaded).',
      },
    },
  },
  args: {
    enabled: false,
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
