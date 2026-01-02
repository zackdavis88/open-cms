import { BlueprintFieldTypeValues, BooleanBlueprintField } from 'src/types';
import isRecord from './isRecord';

const isBooleanField = (field: unknown): field is BooleanBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.BOOLEAN;

export default isBooleanField;
