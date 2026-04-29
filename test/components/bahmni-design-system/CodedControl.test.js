import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CodedControl } from 'components/CodedControl.jsx';
import ComponentStore from 'src/helpers/componentStore';
import constants from 'src/constants';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('src/helpers/Util', () => ({
  Util: {
    getAnswers: jest.fn().mockResolvedValue([]),
    formatConcepts: jest.fn().mockReturnValue([]),
    debounce: jest.fn((fn) => fn),
    getConfig: jest.fn().mockResolvedValue({ config: {} }),
  },
}));

jest.mock('src/helpers/httpInterceptor', () => ({
  httpInterceptor: {
    get: jest.fn().mockResolvedValue({ results: [] }),
  },
}));

import { Util as MockUtil } from 'src/helpers/Util';
import { AutoComplete } from 'components/bahmni-design-system/AutoComplete';
import { DropDown } from 'components/bahmni-design-system/DropDown';
import { Button } from 'components/bahmni-design-system/Button';

const carbonComponents = {
  autocomplete: AutoComplete,
  dropdown: DropDown,
  button: Button,
};

const carbonStore = {
  getRegisteredComponent(type) {
    return carbonComponents[type.toLowerCase()] || null;
  },
};

const mockIntl = {
  formatMessage: jest.fn(({ defaultMessage }) => defaultMessage),
};

const codedOptions = [
  { translationKey: 'MALARIA', name: { display: 'Malaria' }, uuid: 'malaria-uuid' },
  { translationKey: 'TYPHOID', name: { display: 'Typhoid' }, uuid: 'typhoid-uuid' },
  { translationKey: 'DENGUE',  name: { display: 'Dengue' },  uuid: 'dengue-uuid'  },
];

describe('CodedControl — Carbon integration (carbonStore)', () => {
  let onChangeSpy;
  let baseProps;

  function makeBaseProps() {
    return {
      intl: mockIntl,
      enabled: true,
      options: codedOptions,
      validate: false,
      validateForm: false,
      validations: [],
      componentStore: carbonStore,
      showNotification: jest.fn(),
    };
  }

  beforeEach(() => {
    onChangeSpy = jest.fn();
    jest.clearAllMocks();
    MockUtil.debounce.mockImplementation((fn) => fn);
    MockUtil.getAnswers.mockResolvedValue([]);
    MockUtil.formatConcepts.mockReturnValue([]);
    MockUtil.getConfig.mockResolvedValue({ config: {} });
    mockIntl.formatMessage.mockImplementation(({ defaultMessage }) => defaultMessage);
    baseProps = makeBaseProps();
  });

  it('renders Carbon AutoComplete (ComboBox) when autoComplete: true', async () => {
    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ autoComplete: true }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });
    expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
  });

  it('renders Carbon DropDown when dropDown: true', async () => {
    render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ dropDown: true }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('renders Carbon Button (SelectableTag) when neither autoComplete nor dropDown', async () => {
    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{}}
      />
    );

    await waitFor(() => {
      const tags = container.querySelectorAll('.cds--tag');
      expect(tags.length).toBeGreaterThan(0);
    });
  });

  it('fires onChange with concept metadata when a DropDown value is selected', async () => {
    render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ dropDown: true }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('combobox'));

    const listbox = await screen.findByRole('listbox');
    const items = listbox.querySelectorAll('[role="option"]');
    expect(items.length).toBeGreaterThan(0);
    fireEvent.click(items[0]);
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.objectContaining({ uuid: 'malaria-uuid' }),
        errors: expect.any(Array),
      })
    );
  });

  it('fires onChange on mount when a pre-populated value is passed', async () => {
    const existingValue = { name: 'Malaria', value: 'malaria-uuid' };
    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ autoComplete: true }}
        value={existingValue}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('fires onChange with null value when AutoComplete selection is cleared', async () => {
    const existingValue = { name: 'Malaria', value: 'malaria-uuid' };
    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ autoComplete: true }}
        value={existingValue}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });

    onChangeSpy.mockClear();

    const clearButton = container.querySelector('.cds--list-box__selection');
    expect(clearButton).toBeTruthy();
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(onChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          value: undefined,
          errors: expect.any(Array),
        })
      );
    });
  });

  it('renders FilterableMultiSelect when autoComplete + multiSelect', async () => {
    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ autoComplete: true, multiSelect: true }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });
    expect(container.querySelector('.cds--multi-select--filterable')).toBeInTheDocument();
  });

  it('passes translated labels to Carbon components (i18n)', async () => {
    const translatingIntl = {
      formatMessage: jest.fn(({ id, defaultMessage }) => {
        if (id === 'MALARIA') return 'Paludisme';
        return defaultMessage;
      }),
    };

    render(
      <CodedControl
        {...baseProps}
        intl={translatingIntl}
        onChange={onChangeSpy}
        properties={{ dropDown: true }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    expect(translatingIntl.formatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'MALARIA', defaultMessage: 'Malaria' })
    );
    expect(translatingIntl.formatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'TYPHOID', defaultMessage: 'Typhoid' })
    );
  });

  it('uses global ComponentStore when no componentStore prop is provided', () => {
    const getSpy = jest
      .spyOn(ComponentStore, 'getRegisteredComponent')
      .mockReturnValue(null);

    render(
      <CodedControl
        intl={mockIntl}
        enabled
        onChange={onChangeSpy}
        options={codedOptions}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={[]}
        showNotification={jest.fn()}
      />
    );

    expect(getSpy).toHaveBeenCalledWith('button');
    getSpy.mockRestore();
  });

  it('fires onChange through CodedControl when a Button (SelectableTag) is clicked', async () => {
    render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{}}
      />
    );

    const yesTag = await screen.findByText('Malaria');
    fireEvent.click(yesTag.closest('button'));
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('propagates mandatory validation errors end-to-end via add-more row on mount', async () => {
    render(
      <CodedControl
        {...baseProps}
        formFieldPath="test/1-1"
        onChange={onChangeSpy}
        properties={{ dropDown: true }}
        validate={false}
        validations={[constants.validations.mandatory]}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('passes asynchronous=false to AutoComplete — options are not fetched from URL', async () => {
    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ autoComplete: true }}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });

    expect(MockUtil.getAnswers).not.toHaveBeenCalled();
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'MALARIA', defaultMessage: 'Malaria' })
    );
  });

  it('fetches and uses terminology service config when url is provided on autoComplete', async () => {
    MockUtil.getConfig.mockResolvedValue({
      config: { terminologyService: { limit: 50 } },
    });

    const { container } = render(
      <CodedControl
        {...baseProps}
        onChange={onChangeSpy}
        properties={{ autoComplete: true, url: 'http://terminology.example/valueset' }}
      />
    );

    await waitFor(() => {
      expect(MockUtil.getConfig).toHaveBeenCalledWith('http://terminology.example/valueset');
    });

    await waitFor(() => {
      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });
  });

  it('exposes getValue on AutoComplete child ref so container can extract data', () => {
    const autoCompleteRef = React.createRef();

    render(
      <AutoComplete
        ref={autoCompleteRef}
        asynchronous={false}
        formFieldPath="test/1-0"
        onValueChange={jest.fn()}
        options={[{ display: 'Malaria', uuid: 'malaria-uuid' }]}
        value={{ display: 'Malaria', uuid: 'malaria-uuid' }}
      />
    );

    expect(autoCompleteRef.current).toBeTruthy();
    const result = autoCompleteRef.current.getValue();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('uuid', 'malaria-uuid');
  });
});
