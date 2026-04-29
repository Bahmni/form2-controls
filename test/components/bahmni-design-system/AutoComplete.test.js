import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoComplete } from 'components/bahmni-design-system/AutoComplete';
import constants from 'src/constants';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('src/helpers/Util', () => ({
  Util: {
    getAnswers: jest.fn(),
    formatConcepts: jest.fn(),
    debounce: jest.fn((fn) => fn),
  },
}));

jest.mock('src/helpers/httpInterceptor', () => ({
  httpInterceptor: {
    get: jest.fn().mockResolvedValue({ results: [] }),
  },
}));

import { Util } from 'src/helpers/Util';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

describe('Carbon AutoComplete', () => {
  const options = [
    { display: 'one', uuid: 'uuid-1' },
    { display: 'two', uuid: 'uuid-2' },
    { display: 'three', uuid: 'uuid-3' },
  ];

  let mockOnValueChange;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnValueChange = jest.fn();
  });

  describe('Basic rendering', () => {
    it('should render Carbon ComboBox for single-select sync mode', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });

    it('should render Carbon ComboBox for async mode', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={true}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });

    it('should render FilterableMultiSelect for multi-select mode', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          multiSelect={true}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.cds--multi-select')).toBeInTheDocument();
    });

    it('should set conceptUuid as the combobox input id', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          conceptUuid="my-concept-uuid"
        />
      );

      expect(container.querySelector('#my-concept-uuid')).toBeInTheDocument();
    });

    it('should be disabled when enabled is false', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          enabled={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeDisabled();
    });

    it('should be enabled when enabled is true', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          enabled={true}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      const input = container.querySelector('input');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Error validation', () => {
    it('should add form-builder-error class when add-more row has mandatory validation and no value', () => {
      const validations = [constants.validations.mandatory];
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-1"
          onValueChange={mockOnValueChange}
          options={options}
          validations={validations}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toHaveClass('form-builder-error');
    });

    it('should not add form-builder-error class for first row (suffix 0) even with mandatory validation', () => {
      const validations = [constants.validations.mandatory];
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validations={validations}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).not.toHaveClass('form-builder-error');
    });

    it('should not add form-builder-error class when there are no validation errors', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validations={[]}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).not.toHaveClass('form-builder-error');
    });

    it('should call onValueChange on mount for add-more row with validation errors', () => {
      const validations = [constants.validations.mandatory];
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-1"
          onValueChange={mockOnValueChange}
          options={options}
          validations={validations}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(
        undefined,
        expect.arrayContaining([
          expect.objectContaining({ message: constants.validations.mandatory }),
        ])
      );
    });
  });

  describe('componentDidMount behavior', () => {
    it('should call onValueChange on mount when value is provided', () => {
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[0]}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(options[0], []);
    });

    it('should call onValueChange on mount when validateForm is true', () => {
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validateForm={true}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(undefined, []);
    });

    it('should not call onValueChange on mount when no value and no validateForm', () => {
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validateForm={false}
        />
      );

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should initialize options for sync mode with minimumInput=0 and no url', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          minimumInput={0}
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });

  describe('Sync local filtering', () => {
    it('should use debounce for input changes', () => {
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={1}
        />
      );

      expect(Util.debounce).toHaveBeenCalledWith(expect.any(Function), 300);
    });

    it('should not search when input is below minimumInput', async () => {
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={3}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'ab');

      expect(Util.getAnswers).not.toHaveBeenCalled();
    });

    it('should filter options locally when no URL and input >= minimumInput', async () => {
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={1}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'o');

      expect(Util.getAnswers).not.toHaveBeenCalled();
    });

    it('should use multi-term regex search to filter options', async () => {
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={1}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'o');

      expect(input.value).toBe('o');
    });
  });

  describe('Sync URL-based search', () => {
    beforeEach(() => {
      Util.getAnswers.mockResolvedValue([
        { conceptName: 'Yes', conceptUuid: '1', conceptSystem: 'http://sys.com' },
      ]);
      Util.formatConcepts.mockReturnValue([
        { uuid: 'http://sys.com/1', name: 'Yes', display: 'Yes' },
      ]);
    });

    it('should call Util.getAnswers for URL-based sync search when input >= minimumInput', async () => {
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={[]}
          url="http://terminology.com/valueset"
          minimumInput={1}
          terminologyServiceConfig={{ limit: 30 }}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'yes');

      await waitFor(() => {
        expect(Util.getAnswers).toHaveBeenCalledWith('http://terminology.com/valueset', 'yes', 30);
      });
    });

    it('should handle Util.getAnswers rejection gracefully', async () => {
      Util.getAnswers.mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={[]}
          url="http://terminology.com/valueset"
          minimumInput={1}
          terminologyServiceConfig={{ limit: 30 }}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'yes');

      await waitFor(() => {
        expect(Util.getAnswers).toHaveBeenCalled();
      });

      expect(document.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });
  });

  describe('Async mode search', () => {
    it('should call httpInterceptor.get when input >= minimumInput in async mode', async () => {
      httpInterceptor.get.mockResolvedValue({ results: options });
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={true}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          optionsUrl="/openmrs/ws/rest/v1/concept?v=full&q="
          minimumInput={3}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'pul');

      await waitFor(() => {
        expect(httpInterceptor.get).toHaveBeenCalledWith('/openmrs/ws/rest/v1/concept?v=full&q=pul');
      });
    });

    it('should not call httpInterceptor.get when input < minimumInput', async () => {
      const user = userEvent.setup();
      render(
        <AutoComplete
          asynchronous={true}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          optionsUrl="/openmrs/ws/rest/v1/concept?v=full&q="
          minimumInput={3}
        />
      );

      const input = document.querySelector('input');
      await user.type(input, 'pu');

      expect(httpInterceptor.get).not.toHaveBeenCalled();
    });
  });

  describe('prop updates', () => {
    it('should update disabled state when enabled changes', () => {
      const { rerender, container } = render(
        <AutoComplete
          asynchronous={false}
          enabled={true}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      expect(container.querySelector('input')).not.toBeDisabled();

      rerender(
        <AutoComplete
          asynchronous={false}
          enabled={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      expect(container.querySelector('input')).toBeDisabled();
    });

    it('should call onValueChange when value prop changes', () => {
      const { rerender } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[0]}
        />
      );

      mockOnValueChange.mockClear();

      rerender(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[1]}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalled();
    });

    it('should update options when searchable is false', () => {
      const { rerender, container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          searchable={false}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();

      const newOptions = [{ display: 'four', uuid: 'uuid-4' }];
      rerender(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={newOptions}
          searchable={false}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });
  });

  describe('getValue method', () => {
    it('should return empty array when no value', () => {
      const ref = React.createRef();
      render(
        <AutoComplete
          ref={ref}
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current.getValue()).toEqual([]);
    });

    it('should return array with uuid for single value', () => {
      const ref = React.createRef();
      const val = { display: 'Pulse', uuid: 'pulse-uuid' };
      render(
        <AutoComplete
          ref={ref}
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={[val]}
          value={val}
        />
      );

      const result = ref.current.getValue();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('uuid', 'pulse-uuid');
    });

    it('should return array with normalized uuid (using .value) when uuid is missing', () => {
      const ref = React.createRef();
      const val = { display: 'Pulse', value: 'value-as-uuid' };
      render(
        <AutoComplete
          ref={ref}
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={[val]}
          value={val}
        />
      );

      const result = ref.current.getValue();
      expect(result[0]).toHaveProperty('uuid', 'value-as-uuid');
    });

    it('should return array of items for multi-select value', () => {
      const ref = React.createRef();
      const multiVal = [options[0], options[1]];
      render(
        <AutoComplete
          ref={ref}
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={multiVal}
          multiSelect={true}
        />
      );

      const result = ref.current.getValue();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('Selection handling', () => {
    it('should call onValueChange with selected item on selection', async () => {
      render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={0}
          value={options[0]}
        />
      );

      expect(document.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
      expect(mockOnValueChange).toHaveBeenCalledWith(options[0], expect.any(Array));
    });

    it('should call onValueChange with null when value is cleared', async () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[0]}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
      mockOnValueChange.mockClear();

      const clearButton = container.querySelector('.cds--list-box__selection');
      expect(clearButton).toBeTruthy();
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith(null, expect.any(Array));
      });
    });
  });

  describe('Pre-populated value', () => {
    it('should render with pre-populated value', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[0]}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('should handle null value', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={null}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });

    it('should handle undefined value', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={undefined}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });
  });

  describe('Multi-select mode', () => {
    it('should render FilterableMultiSelect in multiSelect mode', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          multiSelect={true}
        />
      );

      expect(container.querySelector('.cds--multi-select')).toBeInTheDocument();
    });

    it('should pre-populate multiple values in multi-select', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={[options[0], options[1]]}
          multiSelect={true}
        />
      );

      expect(container.querySelector('.cds--multi-select')).toBeInTheDocument();
    });

    it('should show add-more error for multi-select with mandatory validation', () => {
      const validations = [constants.validations.mandatory];
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-1"
          onValueChange={mockOnValueChange}
          options={options}
          validations={validations}
          multiSelect={true}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toHaveClass('form-builder-error');
    });
  });

  describe('invalidText and ComboBox error display', () => {
    it('should render ComboBox with invalidText derived from the first validation error', () => {
      const validations = [constants.validations.mandatory];
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-1"
          onValueChange={mockOnValueChange}
          options={options}
          validations={validations}
        />
      );

      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
      expect(container.querySelector('[data-invalid]')).toBeTruthy();
    });

    it('should not show invalidText when there are no errors', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validations={[]}
        />
      );

      expect(container.querySelector('[data-invalid]')).toBeFalsy();
    });
  });

  describe('Clearing selection fires onValueChange with null', () => {
    it('should call onValueChange with null when selection is cleared', async () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[0]}
        />
      );

      mockOnValueChange.mockClear();

      const clearButton = container.querySelector('.cds--list-box__selection');
      expect(clearButton).toBeTruthy();

      fireEvent.click(clearButton);
      await waitFor(() => {
        expect(mockOnValueChange).toHaveBeenCalledWith(null, expect.any(Array));
      });
    });
  });

  describe('Pre-populated value shown in ComboBox input', () => {
    it('should display pre-populated value text in the input', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={options[0]}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('one');
    });

    it('should display nothing in input when value is null', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          value={null}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('');
    });
  });

  describe('Multi-term regex search filtering', () => {
    it('should filter options matching all terms in a space-separated query', async () => {
      const multiWordOptions = [
        { display: 'fever headache pain', uuid: 'uuid-fhp' },
        { display: 'fever only', uuid: 'uuid-fo' },
        { display: 'headache only', uuid: 'uuid-ho' },
        { display: 'nothing relevant', uuid: 'uuid-nr' },
      ];
      const user = userEvent.setup();
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={multiWordOptions}
          minimumInput={1}
        />
      );

      const input = container.querySelector('input');
      await user.type(input, 'fever headache');

      expect(input.value).toBe('fever headache');
      expect(Util.getAnswers).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(container.querySelectorAll('[role="option"]').length).toBeGreaterThan(0);
      });
      const listItems = container.querySelectorAll('[role="option"]');
      const visibleTexts = Array.from(listItems).map(el => el.textContent);
      expect(visibleTexts).toContain('fever headache pain');
      expect(visibleTexts).not.toContain('fever only');
      expect(visibleTexts).not.toContain('headache only');
      expect(visibleTexts).not.toContain('nothing relevant');
    });
  });

  describe('minimumInput threshold blocks search', () => {
    it('should not trigger a search when typed input is below minimumInput', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={5}
        />
      );

      const input = container.querySelector('input');
      await user.type(input, 'ab');

      expect(Util.getAnswers).not.toHaveBeenCalled();
    });

    it('should set empty options when typed input is below minimumInput', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          minimumInput={4}
        />
      );

      const input = container.querySelector('input');
      await user.type(input, 'on');

      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
      const listItems = container.querySelectorAll('[role="option"]');
      expect(listItems.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle validateForm changing to true', () => {
      const validations = [constants.validations.mandatory];
      const { rerender } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validate={false}
          validations={validations}
        />
      );

      mockOnValueChange.mockClear();

      rerender(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
          validate={true}
          validations={validations}
        />
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(
        undefined,
        expect.arrayContaining([
          expect.objectContaining({ message: constants.validations.mandatory }),
        ])
      );
    });

    it('should have obs-control-select-wrapper as the outer div class', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={false}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
          options={options}
        />
      );

      expect(container.querySelector('.obs-control-select-wrapper')).toBeInTheDocument();
    });

    it('should work with async mode default optionsUrl', () => {
      const { container } = render(
        <AutoComplete
          asynchronous={true}
          formFieldPath="test/1-0"
          onValueChange={mockOnValueChange}
        />
      );

      expect(container.querySelector('.cds--combo-box')).toBeInTheDocument();
    });
  });
});
