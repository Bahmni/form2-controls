import { forwardRef } from 'react';
import { Container } from 'components/Container.jsx';
import ComponentStore from 'src/helpers/componentStore';
import { TextBox } from 'components/bahmni-design-system/TextBox';
import { ObsGroupControl } from 'components/bahmni-design-system/ObsGroupControl';

const carbonComponents = {
  text: TextBox,
  obsgroupcontrol: ObsGroupControl,
};

/**
 * A scoped component store for Carbon components.
 * Falls back to the global ComponentStore for any type not yet migrated to Carbon.
 */
const carbonStore = {
  getRegisteredComponent(type) {
    return carbonComponents[type.toLowerCase()]
      || ComponentStore.getRegisteredComponent(type);
  },
};

/**
 * CarbonContainer is a drop-in replacement for Container that renders
 * atomic leaf components using the Carbon Design System (@bahmni/design-system).
 *
 * Usage is identical to Container — pass the same props including refs.
 * Components not yet migrated to Carbon automatically fall back to their
 * original implementations.
 */
export const CarbonContainer = forwardRef(function CarbonContainer(props, ref) {
  return <Container {...props} ref={ref} componentStore={carbonStore} />;
});
