import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ComboBox, FilterableMultiSelect } from '@bahmni/design-system';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { Util } from 'src/helpers/Util';

function getErrors(validations, value) {
  const controlDetails = { validations, value };
  return Validator.getErrors(controlDetails);
}

function hasErrors(errors) {
  return !isEmpty(errors);
}

function isCreateByAddMore(formFieldPath) {
  return (formFieldPath.split('-')[1] !== '0');
}

export const AutoComplete = forwardRef(function AutoComplete({
  asynchronous = true,
  autofocus = false,
  autoload = false,
  cache = false,
  conceptUuid,
  enabled = true,
  filterOptions,
  formFieldPath = '-0',
  labelKey = 'display',
  minimumInput = 3,
  multiSelect = false,
  onValueChange,
  options: propOptions = [],
  optionsUrl = '/openmrs/ws/rest/v1/concept?v=full&q=',
  searchable = true,
  terminologyServiceConfig,
  url = '',
  validate,
  validateForm = false,
  validations = [],
  value: propValue,
  valueKey = 'uuid',
}, ref) {
  const [value, setValue] = useState(propValue);
  const [options, setOptions] = useState([]);
  const [noResultsText, setNoResultsText] = useState('');

  const initialErrors = getErrors(validations, propValue) || [];
  const initialHasErrors = isCreateByAddMore(formFieldPath)
    ? hasErrors(initialErrors)
    : false;
  const [hasError, setHasError] = useState(initialHasErrors);

  // Keep a stable ref to current props for use inside debounced function
  const propsRef = useRef({
    url, options: propOptions, minimumInput, terminologyServiceConfig, labelKey,
  });
  propsRef.current = { url, options: propOptions, minimumInput, terminologyServiceConfig, labelKey };

  // Track previous prop values to detect changes (skip initial mount for update effect)
  const prevPropValue = useRef(undefined);
  const prevValidate = useRef(validate);
  const hasMounted = useRef(false);

  function handleInputChange(input) {
    const {
      url: currentUrl,
      options: currentOptions,
      minimumInput: currentMinInput,
      terminologyServiceConfig: currentTSC,
      labelKey: currentLabelKey,
    } = propsRef.current;

    if (input.length < currentMinInput) {
      setOptions([]);
      setNoResultsText('Type to search');
      return;
    }

    if (currentUrl) {
      const limit = (currentTSC && currentTSC.limit) ? currentTSC.limit : 30;
      Util.getAnswers(currentUrl, input, limit)
        .then(data => {
          const responses = Util.formatConcepts(data);
          setOptions(responses);
          setNoResultsText('No Results Found');
        })
        .catch(() => {
          setOptions([]);
          setNoResultsText('No Results Found');
        });
    } else {
      const searchedInputs = input.trim().split(' ');
      const filteredOptions = currentOptions.filter(option =>
        searchedInputs.every(searchedInput =>
          option[currentLabelKey] && option[currentLabelKey].match(new RegExp(searchedInput, 'gi'))
        )
      );
      setOptions(filteredOptions);
      setNoResultsText('No Results Found');
    }
  }

  const debouncedOnInputChange = useRef(
    Util.debounce((input) => {
      handleInputChange(input);
    }, 300)
  );

  const debouncedGetAsyncOptions = useRef(
    Util.debounce((input) => {
      getAsyncOptions(input).then(results => {
        setOptions(results);
      });
    }, 300)
  );

  // Expose getValue via ref
  useImperativeHandle(ref, () => ({
    getValue() {
      if (value) {
        const valArray = multiSelect ? value : [value];
        return valArray.map(val => ({ ...val, uuid: val.uuid || val.value }));
      }
      return [];
    },
  }));

  // componentDidMount equivalent
  useEffect(() => {
    hasMounted.current = true;
    prevPropValue.current = propValue;
    prevValidate.current = validate;
    if (!asynchronous && minimumInput === 0 && !url) {
      setOptions(propOptions);
    }
    const errors = getErrors(validations, propValue) || [];
    if (initialHasErrors || propValue !== undefined || validateForm) {
      onValueChange(propValue, errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // componentDidUpdate for value/validate changes (skip initial mount)
  useEffect(() => {
    if (!hasMounted.current) return;
    const valueChanged = prevPropValue.current !== propValue;
    const validateChanged = prevValidate.current !== validate;
    if (!valueChanged && !validateChanged) return;
    prevPropValue.current = propValue;
    prevValidate.current = validate;
    const errors = getErrors(validations, propValue) || [];
    const newHasErrors = hasErrors(errors);
    setValue(propValue);
    setHasError(newHasErrors);
    if (newHasErrors) {
      onValueChange(propValue, errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propValue, validate]);

  // Update options when searchable=false and options change
  useEffect(() => {
    if (!searchable) {
      setOptions(propOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propOptions]);

  function handleChange(selectedValue) {
    const errors = getErrors(validations, selectedValue);
    if (!asynchronous && minimumInput !== 0) {
      setOptions([]);
      setNoResultsText('');
    }
    if (Array.isArray(selectedValue) && selectedValue.length === 0) {
      setValue(undefined);
      setHasError(hasErrors(errors));
      if (onValueChange) {
        onValueChange(undefined, errors);
      }
    } else if (!selectedValue) {
      setValue(undefined);
      setHasError(hasErrors(errors));
      if (onValueChange) {
        onValueChange(undefined, errors);
      }
    } else {
      setValue(selectedValue);
      setHasError(hasErrors(errors));
      if (onValueChange) {
        onValueChange(selectedValue, errors);
      }
    }
  }

  async function getAsyncOptions(input) {
    if (input.length >= minimumInput) {
      try {
        const data = await httpInterceptor.get(optionsUrl + input);
        return data.results || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  const className = classNames('obs-control-select-wrapper', { 'form-builder-error': hasError });
  const safeOptions = options || [];
  const safePropOptions = propOptions || [];

  if (multiSelect) {
    const initialSelectedItems = Array.isArray(value) ? value : (value ? [value] : []);
    return (
      <div className={className}>
        <FilterableMultiSelect
          id={conceptUuid}
          disabled={!enabled}
          invalid={hasError}
          items={safeOptions.length > 0 ? safeOptions : safePropOptions}
          itemToString={(item) => (item ? item[labelKey] || '' : '')}
          initialSelectedItems={initialSelectedItems}
          onChange={({ selectedItems }) => handleChange(selectedItems)}
        />
      </div>
    );
  }

  if (asynchronous) {
    return (
      <div className={className}>
        <ComboBox
          id={conceptUuid}
          disabled={!enabled}
          invalid={hasError}
          invalidText={hasError ? 'Invalid value' : ''}
          items={safeOptions}
          itemToString={(item) => (item ? item[labelKey] || '' : '')}
          selectedItem={value || null}
          onChange={({ selectedItem }) => handleChange(selectedItem)}
          onInputChange={(inputValue) => {
            if (typeof inputValue === 'string') {
              debouncedGetAsyncOptions.current(inputValue);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <ComboBox
        id={conceptUuid}
        disabled={!enabled}
        invalid={hasError}
        invalidText={hasError ? 'Invalid value' : ''}
        items={safeOptions}
        itemToString={(item) => (item ? item[labelKey] || '' : '')}
        selectedItem={value || null}
        onChange={({ selectedItem }) => handleChange(selectedItem)}
        onInputChange={(inputValue) => {
          if (typeof inputValue === 'string') {
            debouncedOnInputChange.current(inputValue);
          }
        }}
      />
    </div>
  );
});

AutoComplete.propTypes = {
  asynchronous: PropTypes.bool,
  autofocus: PropTypes.bool,
  autoload: PropTypes.bool,
  cache: PropTypes.bool,
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  filterOptions: PropTypes.func,
  formFieldPath: PropTypes.string,
  labelKey: PropTypes.string,
  minimumInput: PropTypes.number,
  multiSelect: PropTypes.bool,
  onValueChange: PropTypes.func,
  options: PropTypes.array,
  optionsUrl: PropTypes.string,
  searchable: PropTypes.bool,
  terminologyServiceConfig: PropTypes.object,
  url: PropTypes.string,
  validate: PropTypes.bool,
  validateForm: PropTypes.bool,
  validations: PropTypes.array,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};