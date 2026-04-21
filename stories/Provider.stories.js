import React from 'react';
import { action } from '@storybook/addon-actions';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Provider } from 'src/components/Provider.jsx';
import '../styles/styles.scss';

const mockProviders = [
  { id: 201, name: 'Dr. John Smith', uuid: 'prov-uuid-201' },
  { id: 202, name: 'Dr. Aisha Patel', uuid: 'prov-uuid-202' },
  { id: 203, name: 'Dr. Carlos Rivera', uuid: 'prov-uuid-203' },
  { id: 204, name: 'Nurse Mary Johnson', uuid: 'prov-uuid-204' },
  { id: 205, name: 'Dr. Fatima Al-Hassan', uuid: 'prov-uuid-205' },
];

httpInterceptor.get = () => Promise.resolve({ results: mockProviders });

const defaultProps = {
  onChange: action('onChange'),
  showNotification: action('showNotification'),
  validate: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  properties: {},
  conceptUuid: 'provider-concept-uuid',
};

export default {
  title: 'Atomic Controls/Provider',
  component: Provider,
  parameters: {
    docs: {
      description: {
        component:
          'Healthcare provider selector that fetches provider list from the OpenMRS REST API on mount. ' +
          'In these stories, the HTTP call is mocked with local test data. ' +
          'Observation value is stored as the provider id (as a string). ' +
          'Set properties.style="autocomplete" to enable searchable mode.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <Provider
      {...defaultProps}
    />
  ),
};

export const AutocompleteStyle = {
  render: () => (
    <Provider
      {...defaultProps}
      properties={{ style: 'autocomplete' }}
    />
  ),
};

export const Disabled = {
  render: () => (
    <Provider
      {...defaultProps}
      enabled={false}
      value="201"
    />
  ),
};
