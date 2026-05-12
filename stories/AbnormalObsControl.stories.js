/* global componentStore */
import React from 'react';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'src/components/ObsGroupControl.jsx';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import StoryWrapper from './StoryWrapper';
import { pulseDataMetadata as metadata, registerCommonComponents } from './mockData';

registerCommonComponents();

export default {
  title: 'Abnormal ObsControl',
};

export const BasicView = {
  render: () => {
    const pulseObs = new Obs({ concept: metadata.controls[0].concept, formFieldPath: 'f.1/6-0', formNamespace: 'bahmni' });
    const pulseAbnormalObs = new Obs({ concept: metadata.controls[1].concept, formFieldPath: 'f.1/7-0', formNamespace: 'bahmni' });
    const pulseDataObs = new Obs({
      concept: metadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs, pulseAbnormalObs),
    });
    return (
      <StoryWrapper json={metadata}>
        <ObsGroupControl
          errors={[]}
          formName="f"
          formVersion="1"
          mapper={new ObsGroupMapper()}
          metadata={metadata}
          obs={pulseDataObs}
          onValueChanged={() => {}}
          validate={false}
          children={List()}
        />
      </StoryWrapper>
    );
  },
};
