import React from 'react';
import { Button } from 'src/components/bahmni-design-system/Button';
import { codedConceptAnswers } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/Button',
  tags: ['autodocs'],
  component: Button,
  args: {
    options: codedConceptAnswers,
    enabled: true,
    validate: false,
    validateForm: false,
    validations: [],
    formFieldPath: 'test/1-0',
    conceptUuid: 'button-concept-uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
  },
  parameters: {
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Table of Contents',
      },
      description: {
        component: `
## Overview

Bahmni Design System rendering of the coded button-group control. It renders one Carbon **SelectableTag** (from \`@bahmni/design-system\`) per coded option in place of the legacy button markup, with a single controlled \`value\` — or an array of values when \`multiSelect\` is \`true\` — and Carbon's own invalid/disabled styling.

**Value stored:** a single option object, or an array of option objects when \`multiSelect\` is \`true\`.

## When to use

- Single- or multi-select from a small, finite coded option set where every option should be visible at once as tappable pills.
- Use **RadioButton** instead when a strictly single-select Carbon radio list is preferred over tags.
        `,
      },
    },
  },
};

export const Default = {};

export const SingleSelect = {
  args: {
    multiSelect: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`multiSelect` defaults to falsy, so this looks identical to `Default` — both render a ' +
          'single-select tag group where choosing one pill clears any other selection. This variant ' +
          'just makes the intent explicit.',
      },
    },
  },
};

export const MultiSelect = {
  args: {
    multiSelect: true,
    value: [codedConceptAnswers[0], codedConceptAnswers[2]],
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `multiSelect` is `true`, Button stores an array of selected option objects and each ' +
          'pill toggles independently.',
      },
    },
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: codedConceptAnswers[0],
  },
};

export const WithValidation = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};

export const PreSelected = {
  args: {
    value: codedConceptAnswers[0],
  },
};
