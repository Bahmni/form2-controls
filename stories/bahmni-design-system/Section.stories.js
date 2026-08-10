import React from "react";
import { CarbonContainer } from "src/components/bahmni-design-system/CarbonContainer";
import StoryWrapper from "../StoryWrapper";
import {
  carbonContainerCommonProps,
  buildFormMetadata,
} from "./complexFixtures";
import "../../styles/styles.scss";

const patientHistorySection = {
  type: "section",
  label: { type: "label", value: "Patient History" },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: "1",
  controls: [
    {
      type: "obsControl",
      label: { type: "label", value: "Chief Complaint" },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: "2",
      concept: {
        name: "Chief Complaint",
        uuid: "carbon-chief-complaint-uuid",
        datatype: "Text",
      },
    },
    {
      type: "obsControl",
      label: { type: "label", value: "Duration" },
      properties: { mandatory: false, location: { column: 1, row: 0 } },
      id: "3",
      concept: {
        name: "Duration",
        uuid: "carbon-duration-uuid",
        datatype: "Text",
      },
    },
  ],
};

const multiControlSection = {
  type: "section",
  label: { type: "label", value: "Vitals Notes" },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: "4",
  controls: [
    {
      type: "obsControl",
      label: { type: "label", value: "General Notes" },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: "5",
      concept: {
        name: "General Notes",
        uuid: "carbon-general-notes-uuid",
        datatype: "Text",
      },
    },
    {
      type: "obsControl",
      label: { type: "label", value: "Fever" },
      displayType: "Button",
      options: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
      properties: { mandatory: false, location: { column: 1, row: 0 } },
      id: "6",
      concept: {
        name: "Fever",
        uuid: "carbon-section-fever-uuid",
        datatype: "Boolean",
      },
    },
    {
      type: "obsControl",
      label: { type: "label", value: "Follow-up Required" },
      displayType: "Button",
      options: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: "7",
      concept: {
        name: "Follow-up Required",
        uuid: "carbon-followup-uuid",
        datatype: "Boolean",
      },
    },
  ],
};

const defaultForm = buildFormMetadata(
  300,
  "carbon-section-default-uuid",
  "Section Default Form",
  [patientHistorySection],
);
const expandedForm = buildFormMetadata(
  301,
  "carbon-section-expanded-uuid",
  "Section Expanded Form",
  [patientHistorySection],
);
const multiForm = buildFormMetadata(
  302,
  "carbon-section-multi-uuid",
  "Section Multi Control Form",
  [multiControlSection],
);
const disabledForm = buildFormMetadata(
  303,
  "carbon-section-disabled-uuid",
  "Section Disabled Form",
  [patientHistorySection],
);

export default {
  title: "Complex Controls/Bahmni Design System/Section",
  tags: ["autodocs"],
  component: CarbonContainer,
  parameters: {
    docs: {
      toc: {
        headingSelector: "h2, h3",
        title: "Table of Contents",
      },
      description: {
        component: `
## Overview

Bahmni Design System rendering of \`Section\`, driven end-to-end through \`CarbonContainer\`. It renders Carbon's **Accordion** + **AccordionItem** (from \`@bahmni/design-system\`) to visually and semantically group related controls under a single collapsible heading.

**Value stored:** Section has no value of its own — it is a pure layout/grouping control whose children are independent observations bound via \`Container\`'s \`ControlRecordTree\`.

## When to use

- Organising a complex clinical form into logical, collapsible panels (e.g. "Patient History", "Vitals Notes").
- Sections can nest other sections for multi-level hierarchical layouts.
        `,
      },
    },
  },
};

export const Default = {
  render: () => (
    <StoryWrapper json={defaultForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={defaultForm}
        observations={[]}
        collapse
      />
    </StoryWrapper>
  ),
};

export const Expanded = {
  render: () => (
    <StoryWrapper json={expandedForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={expandedForm}
        observations={[]}
        collapse={false}
      />
    </StoryWrapper>
  ),
};

export const WithMultipleControls = {
  render: () => (
    <StoryWrapper json={multiForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={multiForm}
        observations={[]}
        collapse={false}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three controls spread across two rows (`properties.location.row`/`column`), showing how " +
          "Section lays out grouped controls within the Accordion content.",
      },
    },
  },
};

export const Disabled = {
  render: () => (
    <StoryWrapper json={disabledForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={disabledForm}
        observations={[]}
        collapse={false}
        readonly
      />
    </StoryWrapper>
  ),
};
