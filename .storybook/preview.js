import React from 'react';
import { IntlProvider } from 'react-intl';
import '@bahmni/design-system/styles';
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
          ["Bahmni Design System", "Legacy Components"],
          "Example Forms",
        ],
      },
    },
  },
};

