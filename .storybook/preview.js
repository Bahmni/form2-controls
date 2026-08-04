import React from 'react';
import { IntlProvider } from 'react-intl';
import '../styles/styles.scss';

export default {
  decorators: [
    (Story) => (
      <IntlProvider locale="en" messages={{}} onError={() => {}}>
        <Story />
      </IntlProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Introduction",
          "Atomic Controls",
          ["Bahmni Design System", "Legacy Components"],
          "Complex Controls",
          ["Bahmni Design System", "Legacy Components"],
          "Orchestrator",
          "Example Forms",
        ],
      },
    },
  },
};

