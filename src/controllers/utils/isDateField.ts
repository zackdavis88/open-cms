import { BlueprintFieldTypeValues, DateBlueprintField } from 'src/types';
import isRecord from './isRecord';

const isDateField = (field: unknown): field is DateBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.DATE;

export default isDateField;
