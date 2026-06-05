import React from 'react';
import { Title, Description, Controls } from '@storybook/blocks';

// Custom autodocs page for Atomic Controls.
// Renders only the title, the written description (Overview / When to use),
// and the Controls (props) table — the rendered component preview/canvas
// boxes from the default autodocs template are intentionally omitted.
export const OverviewDocsPage = () => (
  <>
    <Title />
    <Description />
    <Controls />
  </>
);
