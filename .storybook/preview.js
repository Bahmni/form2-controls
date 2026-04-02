import React from 'react';
import { IntlProvider } from 'react-intl';

export const decorators = [
  (Story) => (
    <IntlProvider locale="en" messages={{}}>
      <Story />
    </IntlProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
