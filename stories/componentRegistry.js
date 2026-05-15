/* global componentStore */
import { NumericBox } from 'src/components/NumericBox.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';
import { Button } from 'src/components/Button.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { TextBox } from 'src/components/TextBox.jsx';

export function registerCoreComponents() {
  componentStore.registerComponent('numeric', NumericBox);
  componentStore.registerComponent('boolean', BooleanControl);
  componentStore.registerComponent('button', Button);
  componentStore.registerComponent('Coded', CodedControl);
  componentStore.registerComponent('autoComplete', AutoComplete);
  componentStore.registerComponent('text', TextBox);
}