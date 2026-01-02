import { BlueprintFieldTypeValues, StringBlueprintField } from 'src/types';
import isRecord from './isRecord';

const isStringField = (field: unknown): field is StringBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.STRING;

export default isStringField;
