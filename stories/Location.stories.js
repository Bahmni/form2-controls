/**
 * Location Component Stories
 *
 * Purpose: Location selector that fetches location data from OpenMRS REST API.
 * Renders an AutoComplete populated with locations loaded via httpInterceptor.get().
 *
 * IMPORTANT: Location calls httpInterceptor.get() in componentDidMount.
 * In Storybook, we mock the httpInterceptor before the component mounts
 * by replacing the get method on the imported module object.
 * The mock returns a resolved Promise with local test data.
 *
 * Observation binding:
 *   - Value type: string (location id as string)
 *   - The selected location's .id is stored as the observation value
 *   - Example: { uuid: '...', value: '101', obsDatetime: '...' }
 *   - The display value is looked up from the loaded location list
 *
 * Key props:
 *   - value (string): currently selected location id as string
 *   - onChange (func): called with { value, errors } on change
 *   - enabled (bool): false disables the select
 *   - validate (bool): triggers validation display
 *   - validations (array): validation rules
 *   - formFieldPath (string): required for AutoComplete's add-more logic
 *   - properties (object): { URL (string), style ('autocomplete' for search mode) }
 *     - URL: custom REST endpoint; defaults to /openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)
 *     - style: 'autocomplete' enables searchable dropdown (minimumInput=2)
 *   - showNotification (func): called on fetch errors
 *
 * Accessibility notes (WCAG 2.1 AA):
 *   - WCAG 1.3.1 Info and Relationships: pair with <label htmlFor={conceptUuid}>
 *   - WCAG 2.1.1 Keyboard: inherits full react-select keyboard support (arrow keys,
 *     Enter, Escape); autocomplete mode also supports character search
 *   - WCAG 4.1.2 Name, Role, Value: react-select sets role="combobox" and ARIA
 *     attributes for listbox navigation automatically
 *   - WCAG 4.1.3 Status Messages: on fetch failure, showNotification surfaces the error;
 *     ensure the notification is announced by screen readers (e.g. via aria-live region)
 */
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

// Mock httpInterceptor.get to return local data instead of making a real HTTP call.
// This must be set before the component mounts (before render), so we set it at module level.
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

/**
 * Default dropdown mode — all locations shown without search.
 * HTTP call is mocked; no backend required.
 */
export const Default = {
  render: () => (
    <Location
      {...defaultProps}
    />
  ),
};

/**
 * Autocomplete (searchable) style — type at least 2 characters to filter locations.
 * Enabled by properties.style='autocomplete'.
 */
export const AutocompleteStyle = {
  render: () => (
    <Location
      {...defaultProps}
      properties={{ style: 'autocomplete' }}
    />
  ),
};

/** Disabled dropdown showing a pre-selected location — cannot be changed. */
export const Disabled = {
  render: () => (
    <Location
      {...defaultProps}
      enabled={false}
      value="101"
    />
  ),
};
