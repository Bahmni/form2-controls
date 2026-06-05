import React from 'react';
import { injectIntl } from 'react-intl';
// Side-effect import: registers 'button' in ComponentStore, required for BooleanControl to render
import 'src/components/Button.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';

const BooleanControlWithIntl = injectIntl(BooleanControl);

const yesNoOptions = [
  { name: 'Yes', value: true, translationKey: '' },
  { name: 'No', value: false, translationKey: '' },
];

export default {
  title: 'Atomic Controls/BooleanControl',
  tags: ['autodocs'],
  component: BooleanControl,
  render: (args) => <BooleanControlWithIntl {...args} />,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    options: yesNoOptions,
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
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

Yes/No toggle control for boolean observations, rendered as a button group via the registered Button component.

**Value stored:** a boolean (\`true\` / \`false\`).

## When to use

- Two-state clinical questions — e.g. "Smoking history?", "Pregnant?".
- When the answer is strictly true/false rather than a coded list.

## Accessibility (WCAG 2.1 AA)

Button group keyboard navigable via Tab and Enter/Space (SC 2.1.1); selected state conveyed via aria-pressed (SC 1.3.1, 4.1.2); visible focus ring on each button (SC 2.4.7); selected state not conveyed by colour alone (SC 1.4.1); text contrast ≥ 4.5:1 (SC 1.4.3).
        `,
      },
    },
  },
};

export const Default = {};

export const WithTrueSelected = {
  args: { value: true },
};

export const WithFalseSelected = {
  args: { value: false },
};

export const Disabled = {
  args: {
    enabled: false,
    value: false,
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
