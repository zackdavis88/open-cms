import { BlueprintFieldTypeValues, NumberBlueprintField } from 'src/types';
import isRecord from './isRecord';

const isNumberField = (field: unknown): field is NumberBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.NUMBER;

export default isNumberField;
