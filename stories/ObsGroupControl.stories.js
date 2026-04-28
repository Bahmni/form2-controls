/* global componentStore */
import React from 'react';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'src/components/ObsGroupControl.jsx';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { Obs } from 'src/helpers/Obs';
import { NumericBox } from 'src/components/NumericBox.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';
import { Button } from 'src/components/Button.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import { List } from 'immutable';
import StoryWrapper from './StoryWrapper';

componentStore.registerComponent('numeric', NumericBox);
componentStore.registerComponent('boolean', BooleanControl);
componentStore.registerComponent('button', Button);
componentStore.registerComponent('Coded', CodedControl);
componentStore.registerComponent('autoComplete', AutoComplete);
componentStore.registerComponent('text', TextBox);

// Pulse Data group — mirrors AbnormalObsControl but is the canonical ObsGroupControl story
const pulseMetadata = {
  type: 'ObsGroupControl',
  concept: {
    name: 'Pulse Data',
    uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
    datatype: 'N/A',
  },
  label: { type: 'label', value: 'Pulse Data' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '5',
  controls: [
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Pulse' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: {
        name: 'Pulse',
        uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
        conceptClass: 'Misc',
        lowNormal: 60,
        hiNormal: 120,
      },
    },
    {
      type: 'obsControl',
      displayType: 'Button',
      options: [{ name: 'Abnormal', value: true }],
      label: { type: 'label', value: 'Abnormal' },
      properties: { mandatory: false, location: { column: 0, row: 0 }, hideLabel: true },
      id: '7',
      concept: {
        name: 'Pulse Abnormal',
        uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
        datatype: 'Boolean',
        conceptClass: 'Abnormal',
      },
    },
  ],
};

// Vitals group — demonstrates a richer multi-field obs group
const vitalsMetadata = {
  type: 'ObsGroupControl',
  concept: {
    name: 'Vitals',
    uuid: 'vitals-grp-uuid-001',
    datatype: 'N/A',
  },
  label: { type: 'label', value: 'Vitals' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '30',
  controls: [
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Systolic' },
      properties: { mandatory: true, location: { column: 0, row: 0 } },
      id: '31',
      concept: {
        name: 'Systolic',
        uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
        lowNormal: 90,
        hiNormal: 140,
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Diastolic' },
      properties: { mandatory: true, location: { column: 1, row: 0 } },
      id: '32',
      concept: {
        name: 'Diastolic',
        uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
        lowNormal: 60,
        hiNormal: 90,
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Temperature (C)' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '33',
      concept: {
        name: 'Temperature (C)',
        uuid: 'temp-concept-uuid-001',
        datatype: 'Numeric',
        lowNormal: 36,
        hiNormal: 37.5,
      },
    },
  ],
};

// Form-level metadata for the real form usage story (uses Container pattern)
const formWithObsGroup = {
  id: 2,
  name: 'Vitals Form',
  version: '1',
  uuid: 'vitals-form-uuid-0001',
  controls: [vitalsMetadata],
};

const commonGroupProps = {
  errors: [],
  formName: 'f',
  formVersion: '1',
  mapper: new ObsGroupMapper(),
  onValueChanged: () => {},
  validate: false,
  validateForm: false,
  showNotification: () => {},
  children: List(),
};

export default {
  title: 'Complex Controls/ObsGroupControl',
  component: ObsGroupControl,
  parameters: {
    docs: {
      description: {
        component:
          'ObsGroupControl renders a collapsible fieldset that groups related observations under ' +
          'a shared parent concept (the obs group). It is the primary mechanism for capturing ' +
          'structured clinical data such as Vitals, Pulse Data, or any custom panel.\n\n' +
          '**Data model**: An obs group is represented as an `Obs` whose `groupMembers` is an ' +
          'immutable `List` of child `Obs` records. The `ObsGroupMapper` is responsible for ' +
          'reading and writing this nested structure to/from the flat OpenMRS observation API.\n\n' +
          '**Collapse / expand**: Clicking the legend toggles `state.collapse`. When collapsed the ' +
          'child controls are hidden via a CSS class (`closing-group-controls`) without unmounting, ' +
          'so partial data is preserved.\n\n' +
          '**Add More**: When `showAddMore` is true (controlled by the parent AddMoreDecorator) an ' +
          'Add button appears above the legend, enabling repeated instances of the group within ' +
          'a single encounter (e.g., multiple blood pressure readings).\n\n' +
          'Accessibility (WCAG 2.1 AA): The group is wrapped in a `<fieldset>` with a `<legend>` ' +
          'providing a programmatic label for screen readers. The collapse toggle is a clickable ' +
          'legend element — keyboard users can focus it and activate with Enter or Space. ' +
          'Child controls inherit their individual `aria-required` and `aria-describedby` attributes ' +
          'from their own ObsControl implementations.',
      },
    },
  },
};

export const DefaultGroupWithChildObservations = {
  render: () => {
    const pulseObs = new Obs({
      concept: pulseMetadata.controls[0].concept,
      formFieldPath: 'f.1/6-0',
      formNamespace: 'bahmni',
    });
    const pulseAbnormalObs = new Obs({
      concept: pulseMetadata.controls[1].concept,
      formFieldPath: 'f.1/7-0',
      formNamespace: 'bahmni',
    });
    const pulseDataObs = new Obs({
      concept: pulseMetadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs, pulseAbnormalObs),
    });
    return (
      <StoryWrapper json={pulseMetadata}>
        <ObsGroupControl
          {...commonGroupProps}
          metadata={pulseMetadata}
          obs={pulseDataObs}
          value={pulseDataObs}
        />
      </StoryWrapper>
    );
  },
};

export const CollapsedGroup = {
  render: () => {
    const pulseObs = new Obs({
      concept: pulseMetadata.controls[0].concept,
      formFieldPath: 'f.1/6-0',
      formNamespace: 'bahmni',
    });
    const pulseDataObs = new Obs({
      concept: pulseMetadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs),
    });
    return (
      <StoryWrapper json={pulseMetadata}>
        <ObsGroupControl
          {...commonGroupProps}
          collapse={true}
          metadata={pulseMetadata}
          obs={pulseDataObs}
          value={pulseDataObs}
        />
      </StoryWrapper>
    );
  },
};

export const RealFormUsageVitalsGroup = {
  render: () => {
    const systolicObs = new Obs({
      concept: vitalsMetadata.controls[0].concept,
      formFieldPath: 'VitalsForm.1/31-0',
      formNamespace: 'bahmni',
    });
    const diastolicObs = new Obs({
      concept: vitalsMetadata.controls[1].concept,
      formFieldPath: 'VitalsForm.1/32-0',
      formNamespace: 'bahmni',
    });
    const temperatureObs = new Obs({
      concept: vitalsMetadata.controls[2].concept,
      formFieldPath: 'VitalsForm.1/33-0',
      formNamespace: 'bahmni',
    });
    const vitalsGroupObs = new Obs({
      concept: vitalsMetadata.concept,
      formNamespace: 'VitalsForm/30',
      groupMembers: List.of(systolicObs, diastolicObs, temperatureObs),
    });
    return (
      <StoryWrapper json={formWithObsGroup}>
        <ObsGroupControl
          {...commonGroupProps}
          formName="VitalsForm"
          metadata={vitalsMetadata}
          obs={vitalsGroupObs}
          value={vitalsGroupObs}
        />
      </StoryWrapper>
    );
  },
};
