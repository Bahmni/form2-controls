import { forwardRef } from 'react';
import { Container } from 'components/Container.jsx';
import { ComplexControl } from 'components/ComplexControl';
import ComponentStore from 'src/helpers/componentStore';
import { TextBox } from 'components/bahmni-design-system/TextBox';
import { ObsGroupControl } from 'components/bahmni-design-system/ObsGroupControl';
import { SectionWithIntl } from 'components/bahmni-design-system/Section';
import { Date } from 'components/bahmni-design-system/Date';
import { DateTime } from 'components/bahmni-design-system/DateTime';
import { NumericBox } from 'components/bahmni-design-system/NumericBox';
import { DropDown } from 'components/bahmni-design-system/DropDown';
import { Button } from 'components/bahmni-design-system/Button';
import { FreeTextAutoComplete } from 'components/bahmni-design-system/FreeTextAutoComplete';
import { AutoComplete } from 'components/bahmni-design-system/AutoComplete';
import { Location } from 'components/bahmni-design-system/Location';
import { Provider } from 'components/bahmni-design-system/Provider';
import { ObsControlWithIntl } from 'components/bahmni-design-system/ObsControl';
import { RadioButton } from 'components/bahmni-design-system/RadioButton';
import { Image } from 'components/bahmni-design-system/Image';
import { Video } from 'components/bahmni-design-system/Video';
import { TableWithIntl } from 'components/bahmni-design-system/Table';
import { BooleanControlWithIntl } from 'components/bahmni-design-system/BooleanControl';

const carbonComponents = {
  text: TextBox,
  obsgroupcontrol: ObsGroupControl,
  section: SectionWithIntl,
  date: Date,
  datetime: DateTime,
  numeric: NumericBox,
  dropdown: DropDown,
  button: Button,
  freetextautocomplete: FreeTextAutoComplete,
  autocomplete: AutoComplete,
  locationobshandler: Location,
  providerobshandler: Provider,
  obscontrol: ObsControlWithIntl,
  radio: RadioButton,
  imageurlhandler: Image,
  videourlhandler: Video,
  table: TableWithIntl,
  boolean: BooleanControlWithIntl,
  complex: ComplexControl,
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
