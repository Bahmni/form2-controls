/**
 * Provider Component Stories
 *
 * Purpose: Healthcare provider selector that fetches provider data from OpenMRS REST API.
 * Renders an AutoComplete populated with providers loaded via httpInterceptor.get().
 * Shows a Spinner while data is loading and a value is set.
 *
 * IMPORTANT: Provider calls httpInterceptor.get() in componentDidMount.
 * In Storybook, we mock the httpInterceptor before the component mounts
 * by replacing the get method on the imported module object.
 * The mock returns a resolved Promise with local test data.
 *
 * Observation binding:
 *   - Value type: string (provider id as string)
 *   - The selected provider's .id is stored as the observation value
 *   - Example: { uuid: '...', value: '201', obsDatetime: '...' }
 *   - The display name is looked up from the loaded provider list
 *
 * Key props:
 *   - value (string): currently selected provider id as string
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables the select
 *   - validate (bool): triggers validation display
 *   - validations (array): validation rules
 *   - formFieldPath (string): required for AutoComplete's add-more logic
 *   - properties (object): { URL (string), style ('autocomplete' for search mode) }
 *     - URL: custom REST endpoint; defaults to /openmrs/ws/rest/v1/provider?v=custom:(id,name,uuid)
 *     - style: 'autocomplete' enables searchable dropdown (minimumInput=2)
 *   - showNotification (func): called on fetch errors
 *   - conceptUuid (string): passed to AutoComplete for accessibility
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}>
 *   - WCAG 2.1.1 Keyboard: inherits full react-select keyboard support (arrow keys,
 *     Enter, Escape); autocomplete mode also supports character search
 *   - WCAG 4.1.2 Name, Role, Value: react-select sets role="combobox" and ARIA
 *     attributes for listbox navigation; loading Spinner should have role="status"
 *     and aria-label="Loading" for screen reader announcement
 *   - WCAG 4.1.3 Status Messages: on fetch failure, showNotification surfaces the error;
 *     ensure the notification container uses aria-live="assertive" for immediate announcement
 */
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

// Mock httpInterceptor.get to return local data instead of making a real HTTP call.
// This must be set before the component mounts (before render), so we set it at module level.
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

/**
 * Default dropdown mode — all providers shown without search.
 * HTTP call is mocked; no backend required.
 */
export const Default = {
  render: () => (
    <Provider
      {...defaultProps}
    />
  ),
};

/**
 * Autocomplete (searchable) style — type at least 2 characters to filter providers.
 * Enabled by properties.style='autocomplete'.
 */
export const AutocompleteStyle = {
  render: () => (
    <Provider
      {...defaultProps}
      properties={{ style: 'autocomplete' }}
    />
  ),
};

/** Disabled dropdown showing a pre-selected provider — cannot be changed. */
export const Disabled = {
  render: () => (
    <Provider
      {...defaultProps}
      enabled={false}
      value="201"
    />
  ),
};
