import React from 'react';
import { IntlProvider } from 'react-intl';
import { OverviewDocsPage } from '../stories/docsPage';
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
    docs: {
      // Custom autodocs layout: title + description + Controls table only,
      // without the rendered preview/canvas boxes. Applies only to pages that
      // opt into autodocs — currently just the Atomic Controls.
      page: OverviewDocsPage,
    },
    options: {
      storySort: {
        order: ['Introduction', 'Atomic Controls', 'Complex Controls', 'Orchestrator', 'Example Forms'],
      },
    },
  },
};

