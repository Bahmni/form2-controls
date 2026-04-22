import React from 'react';
import { IntlProvider } from 'react-intl';

export default {
  decorators: [
    (Story) => (
      <IntlProvider locale="en" messages={{}} onError={() => {}}>
        <Story />
      </IntlProvider>
    ),
  ],
};

