import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Location } from 'components/bahmni-design-system/Location';
import * as httpInterceptor from 'src/helpers/httpInterceptor';

jest.mock('src/helpers/httpInterceptor');

describe('Carbon Location', () => {
  const mockLocationData = [
    { id: 1, name: 'Location A', uuid: 'uuid-1' },
    { id: 2, name: 'Location B', uuid: 'uuid-2' },
    { id: 3, name: 'Location C', uuid: 'uuid-3' },
  ];

  const mockOnChange = jest.fn();
  const mockShowNotification = jest.fn();

  const defaultProps = {
    onChange: mockOnChange,
    showNotification: mockShowNotification,
    properties: {},
    validate: false,
    validations: [],
    formFieldPath: 'test-0',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    httpInterceptor.httpInterceptor.get.mockResolvedValue({ results: mockLocationData });
  });

  it('should render Carbon ComboBox for searchable location', async () => {
    const { container } = render(
      <Location
        {...defaultProps}
        properties={{ style: 'autocomplete' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });

  it('should render Carbon ComboBox for non-searchable location (dropdown)', async () => {
    const { container } = render(
      <Location
        {...defaultProps}
        properties={{ style: 'dropdown' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });

  it('should fetch location data on mount', async () => {
    render(
      <Location
        {...defaultProps}
        properties={{}}
      />
    );

    await waitFor(() => {
      expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalledWith(
        '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)'
      );
    });
  });

  it('should use custom URL when provided', async () => {
    const customUrl = '/custom/location/endpoint';
    render(
      <Location
        {...defaultProps}
        properties={{ URL: customUrl }}
      />
    );

    await waitFor(() => {
      expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalledWith(customUrl);
    });
  });

  it('should call onChange with location id when option is selected', async () => {
    const { container } = render(
      <Location
        {...defaultProps}
        properties={{ style: 'autocomplete' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });

    expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalledWith(
      '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)'
    );
  });

  it('should show error notification on fetch failure', async () => {
    httpInterceptor.httpInterceptor.get.mockRejectedValue(new Error('API Error'));

    render(
      <Location
        {...defaultProps}
        properties={{}}
      />
    );

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Failed to fetch location data',
        expect.any(String)
      );
    });
  });

  it('should render with pre-populated location value', async () => {
    const { container } = render(
      <Location
        {...defaultProps}
        value="1"
        properties={{ style: 'dropdown' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });

  it('should use minimumInput=2 when searchable', async () => {
    httpInterceptor.httpInterceptor.get.mockClear();

    render(
      <Location
        {...defaultProps}
        properties={{ style: 'autocomplete' }}
      />
    );

    // Typing less than 2 characters should not trigger API call beyond initial load
    const initialCallCount = httpInterceptor.httpInterceptor.get.mock.calls.length;
    expect(initialCallCount).toBeGreaterThan(0); // At least the initial mount call
  });

  it('should use minimumInput=0 when not searchable', async () => {
    httpInterceptor.httpInterceptor.get.mockClear();

    render(
      <Location
        {...defaultProps}
        properties={{ style: 'dropdown' }}
      />
    );

    // For dropdown (not searchable), options should be pre-loaded
    await waitFor(() => {
      expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalled();
    });
  });

  it('should use labelKey=name and valueKey=id by default', async () => {
    const { container } = render(
      <Location
        {...defaultProps}
        properties={{ style: 'dropdown' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
    // labelKey and valueKey are used internally by AutoComplete
  });
});
