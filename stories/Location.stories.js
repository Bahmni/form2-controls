import React from 'react';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Location } from 'src/components/Location.jsx';

const mockLocations = [
  { id: 101, name: 'General Ward', uuid: 'loc-uuid-101' },
  { id: 102, name: 'Emergency', uuid: 'loc-uuid-102' },
  { id: 103, name: 'Outpatient Clinic', uuid: 'loc-uuid-103' },
  { id: 104, name: 'ICU', uuid: 'loc-uuid-104' },
  { id: 105, name: 'Maternity Ward', uuid: 'loc-uuid-105' },
];

export default {
  title: 'Atomic Controls/Location',
  component: Location,
  decorators: [
    (Story) => {
      const original = httpInterceptor.get;
      httpInterceptor.get = () => Promise.resolve({ results: mockLocations });
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
          'Location selector that fetches location list from the OpenMRS REST API on mount. ' +
          'In these stories, the HTTP call is mocked with local test data. ' +
          'Observation value is stored as the location id (as a string). ' +
          'Set properties.style="autocomplete" to enable searchable mode.\n\n' +
          'Location hierarchy: the component requests only id, name, and uuid from the OpenMRS ' +
          'location API (v=custom:(id,name,uuid)). Parent/child relationships are not fetched, ' +
          'so all locations are displayed as a flat list regardless of their hierarchy in OpenMRS.\n\n' +
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
  args: {
    enabled: false,
    value: '101',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
