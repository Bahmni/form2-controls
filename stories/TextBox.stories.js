import React from 'react';
import { TextBox } from 'src/components/TextBox.jsx';

export default {
  title: 'Atomic Controls/TextBox',
  tags: ['autodocs'],
  component: TextBox,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'textbox-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    value: { control: 'text' },
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

Multi-line text area for free-form text observations. The field auto-resizes as the user types.

**Value stored:** a plain string.

## When to use

- Capturing unstructured clinical narrative — chief complaint, history, notes.
- When the answer is free prose rather than a coded or numeric value.

## Accessibility (WCAG 2.1 AA)

Keyboard navigable (SC 2.1.1); visible focus ring (SC 2.4.7); mandatory validation error announced via aria-invalid and adjacent error message (SC 3.3.1, 3.3.3); label programmatically associated via htmlFor/id (SC 1.3.1); text contrast ≥ 4.5:1 (SC 1.4.3).
        `,
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: 'Patient reports mild headache since yesterday morning.',
  },
};

export const Disabled = {
  args: {
    enabled: false,
  },
};

export const ReadOnly = {
  args: {
    enabled: false,
    value: 'Chief complaint: fever for 3 days.',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
    value: undefined,
  },
};
