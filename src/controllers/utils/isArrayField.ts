import { BlueprintFieldTypeValues, ArrayBlueprintField } from 'src/types';
import isRecord from './isRecord';

const isArrayField = (field: unknown): field is ArrayBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.ARRAY;

export default isArrayField;
