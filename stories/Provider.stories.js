import React from 'react';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Provider } from 'src/components/Provider.jsx';

const mockProviders = [
  { id: 201, name: 'Dr. John Smith', uuid: 'prov-uuid-201' },
  { id: 202, name: 'Dr. Aisha Patel', uuid: 'prov-uuid-202' },
  { id: 203, name: 'Dr. Carlos Rivera', uuid: 'prov-uuid-203' },
  { id: 204, name: 'Nurse Mary Johnson', uuid: 'prov-uuid-204' },
  { id: 205, name: 'Dr. Fatima Al-Hassan', uuid: 'prov-uuid-205' },
];

export default {
  title: 'Atomic Controls/Provider',
  component: Provider,
  decorators: [
    (Story) => {
      const original = httpInterceptor.get;
      httpInterceptor.get = () => Promise.resolve({ results: mockProviders });
      const result = <Story />;
      httpInterceptor.get = original;
      return result;
    },
  ],
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
      description: {
        component:
          'Healthcare provider selector that fetches provider list from the OpenMRS REST API on mount. ' +
          'In these stories, the HTTP call is mocked with local test data. ' +
          'Observation value is stored as the provider id (as a string). ' +
          'Set properties.style="autocomplete" to enable searchable mode.\n\n' +
          'Accessibility (WCAG 2.1 AA): Inherits AutoComplete accessibility — combobox role with ' +
          'arrow-key navigation (SC 2.1.1, 4.1.2); visible focus ring (SC 2.4.7); ' +
          'loading state announced via aria-busy (SC 4.1.3); ' +
          'mandatory validation announced via aria-invalid (SC 3.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).',
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
