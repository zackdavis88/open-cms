import { BlueprintFieldTypeValues, ObjectBlueprintField } from 'src/types';
import isRecord from './isRecord';

const isObjectField = (field: unknown): field is ObjectBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.OBJECT;

export default isObjectField;
