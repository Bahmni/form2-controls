import React from 'react';
import { action } from '@storybook/addon-actions';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Location } from 'src/components/Location.jsx';
import '../styles/styles.scss';

const mockLocations = [
  { id: 101, name: 'General Ward', uuid: 'loc-uuid-101' },
  { id: 102, name: 'Emergency', uuid: 'loc-uuid-102' },
  { id: 103, name: 'Outpatient Clinic', uuid: 'loc-uuid-103' },
  { id: 104, name: 'ICU', uuid: 'loc-uuid-104' },
  { id: 105, name: 'Maternity Ward', uuid: 'loc-uuid-105' },
];

httpInterceptor.get = () => Promise.resolve({ results: mockLocations });

const defaultProps = {
  onChange: action('onChange'),
  showNotification: action('showNotification'),
  validate: false,
  validations: [],
  enabled: true,
  formFieldPath: 'test/1-0',
  properties: {},
};

export default {
  title: 'Atomic Controls/Location',
  component: Location,
  parameters: {
    docs: {
      description: {
        component:
          'Location selector that fetches location list from the OpenMRS REST API on mount. ' +
          'In these stories, the HTTP call is mocked with local test data. ' +
          'Observation value is stored as the location id (as a string). ' +
          'Set properties.style="autocomplete" to enable searchable mode.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <Location
      {...defaultProps}
    />
  ),
};

export const AutocompleteStyle = {
  render: () => (
    <Location
      {...defaultProps}
      properties={{ style: 'autocomplete' }}
    />
  ),
};

export const Disabled = {
  render: () => (
    <Location
      {...defaultProps}
      enabled={false}
      value="101"
    />
  ),
};
