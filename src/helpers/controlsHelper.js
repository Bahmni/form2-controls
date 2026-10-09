import constants from 'src/constants';

export function getValidations(properties, conceptProperties, conceptDatatype) {
  const validations = [];
  if (properties && properties.mandatory) validations.push(constants.validations.mandatory);
  if (conceptProperties && conceptProperties.allowDecimal === false) {
    validations.push(constants.validations.allowDecimal);
  }
  const dateDatatypes = [constants.dataTypes.date, constants.dataTypes.dateTime];
  if (properties && dateDatatypes.includes(conceptDatatype) && properties.allowFutureDates !== true) {
    validations.push(constants.validations.allowFutureDates);
  }
  return validations;
}
