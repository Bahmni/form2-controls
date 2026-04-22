import React from 'react';
import StoryWrapper from './StoryWrapper';
import { Container } from 'src/components/Container.jsx';
import '../styles/styles.scss';

const form = {
  id: 1,
  name: 'abcd',
  version: '1',
  uuid: 'fbc5d897-64e4-4cc1-90a3-47fde7a98026',
  controls: [
    {
      type: 'obsControl',
      label: {
        id: 'systolic',
        type: 'label',
        value: 'Systolic',
      },
      properties: {
        mandatory: true,
        allowDecimal: false,
        addMore: true,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '1',
      concept: {
        name: 'Systolic',
        uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
      },
    },
    {
      type: 'obsControl',
      label: {
        id: 'diastolic',
        type: 'label',
        value: 'Diastolic',
      },
      properties: {
        mandatory: true,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '2',
      concept: {
        name: 'Diastolic',
        uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75',
        datatype: 'Text',
      },
    },
    {
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      displayType: 'button',
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Smoking History',
      },
      properties: {
        mandatory: true,
        notes: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '3',
      concept: {
        name: 'Smoking History',
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
        datatype: 'Boolean',
        properties: {
          allowDecimal: null,
        },
      },
    },
    {
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Coded concept',
      },
      properties: {
        mandatory: true,
        notes: false,
        autoComplete: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '5',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'Date' },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '7',
      concept: { name: 'Systolic', uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75', datatype: 'DateTime' },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: { mandatory: true, notes: false, autoComplete: false, dropDown: true, location: { column: 0, row: 0 } },
      id: '8',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
  ],
};

const obsList = [
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'systolicUuid',
    value: '120',
    formNamespace: 'Bahmni',
    formFieldPath: 'formUuid/1',
  },
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'diastolicUuid',
    value: '80',
    formNamespace: 'Bahmni',
    formFieldPath: 'formUuid/2',
  },
];

export default {
  title: 'Forms',
};

export const Form1 = {
  render: () => (
    <StoryWrapper json={form}>
      <Container metadata={form} observations={obsList} validate={false} translations={{ labels: {}, concepts: {} }} />
    </StoryWrapper>
  ),
};
