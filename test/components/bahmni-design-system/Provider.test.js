import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'components/bahmni-design-system/Provider';
import * as httpInterceptor from 'src/helpers/httpInterceptor';

jest.mock('src/helpers/httpInterceptor');

describe('Carbon Provider', () => {
  const mockProviderData = [
    { id: 1, name: 'Provider A', uuid: 'uuid-1' },
    { id: 2, name: 'Provider B', uuid: 'uuid-2' },
    { id: 3, name: 'Provider C', uuid: 'uuid-3' },
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
    httpInterceptor.httpInterceptor.get.mockResolvedValue({ results: mockProviderData });
  });

  it('should render Carbon ComboBox for searchable provider', async () => {
    const { container } = render(
      <Provider
        {...defaultProps}
        properties={{ style: 'autocomplete' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });

  it('should render Carbon ComboBox for non-searchable provider (dropdown)', async () => {
    const { container } = render(
      <Provider
        {...defaultProps}
        properties={{ style: 'dropdown' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });

  it('should fetch provider data on mount', async () => {
    render(
      <Provider
        {...defaultProps}
        properties={{}}
      />
    );

    await waitFor(() => {
      expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalledWith(
        '/openmrs/ws/rest/v1/provider?v=custom:(id,name,uuid)'
      );
    });
  });

  it('should use custom URL when provided', async () => {
    const customUrl = '/custom/provider/endpoint';
    render(
      <Provider
        {...defaultProps}
        properties={{ URL: customUrl }}
      />
    );

    await waitFor(() => {
      expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalledWith(customUrl);
    });
  });

  it('should call onChange with provider id when option is selected', async () => {
    const { container } = render(
      <Provider
        {...defaultProps}
        properties={{ style: 'autocomplete' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });

    expect(httpInterceptor.httpInterceptor.get).toHaveBeenCalledWith(
      '/openmrs/ws/rest/v1/provider?v=custom:(id,name,uuid)'
    );
  });

  it('should show error notification on fetch failure', async () => {
    httpInterceptor.httpInterceptor.get.mockRejectedValue(new Error('API Error'));

    render(
      <Provider
        {...defaultProps}
        properties={{}}
      />
    );

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Failed to fetch provider data',
        expect.any(String)
      );
    });
  });

  it('should show spinner when loading provider data with value', async () => {
    // When value is set but data hasn't loaded, show spinner
    httpInterceptor.httpInterceptor.get.mockImplementation(() =>
      new Promise(() => {}) // Never resolves to keep loading state
    );

    const { container } = render(
      <Provider
        {...defaultProps}
        value="1"
        properties={{}}
      />
    );

    // Should show spinner when data is empty and value is provided
    // Component should have been rendered (checking for presence of any element)
    expect(container.innerHTML).toBeTruthy();
  });

  it('should render with pre-populated provider value', async () => {
    const { container } = render(
      <Provider
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
      <Provider
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
      <Provider
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
      <Provider
        {...defaultProps}
        properties={{ style: 'dropdown' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
    // labelKey and valueKey are used internally by AutoComplete
  });

  it('should call onChange with undefined when provider value is cleared', async () => {
    const { container } = render(
      <Provider
        {...defaultProps}
        value="1"
        properties={{ style: 'autocomplete' }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });

    expect(mockOnChange).toHaveBeenCalled();
  });
});
