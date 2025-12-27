import { ValidationError } from 'src/server/utils/errors';
import {
  ArrayBlueprintField,
  BlueprintField,
  NumberBlueprintField,
  ObjectBlueprintField,
  StringBlueprintField,
  BlueprintFieldTypeValues,
} from 'src/types';

const isRecord = (field: unknown): field is Record<string, unknown> =>
  typeof field === 'object' && field !== null;

const isStringField = (field: unknown): field is StringBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.STRING;

const isNumberField = (field: unknown): field is NumberBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.NUMBER;

const isArrayField = (field: unknown): field is ArrayBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.ARRAY;

const isObjectField = (field: unknown): field is ObjectBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.OBJECT;

const depthFirstValidation = (fields: unknown[], parentName = 'root') => {
  return fields.reduce<BlueprintField[]>((validatedFields, field) => {
    const validatedField = {
      id: crypto.randomUUID(),
    } as Record<string, unknown>;

    if (!isRecord(field)) {
      throw new ValidationError(`${parentName} fields input must be a field object`);
    }

    const name = field.name;
    if (!name || typeof name !== 'string') {
      throw new ValidationError(`${parentName} field name must be a string`);
    }

    if (name.length < 3 || name.length > 30) {
      throw new ValidationError(
        `${parentName} field name must be 3 - 30 characters in length`,
      );
    }

    const regex = new RegExp('^[A-Za-z0-9-_+=&^%$#*@!|/(){}?.,<>;\':" ]+$');
    if (!regex.test(name)) {
      throw new ValidationError(`${parentName} field name contains invalid characters`);
    }

    let isRequired = false;
    if (field.isRequired && typeof field.isRequired !== 'boolean') {
      throw new ValidationError(`${parentName} field isRequired must be a boolean`);
    }
    isRequired = typeof field.isRequired === 'boolean' ? field.isRequired : false;

    let type = field.type;
    if (!type || typeof type !== 'string') {
      throw new ValidationError(
        `${parentName} field type must be one of: string, number, boolean, date, array, object`,
      );
    }

    type = type.toLowerCase();
    if (
      type !== BlueprintFieldTypeValues.STRING &&
      type !== BlueprintFieldTypeValues.NUMBER &&
      type !== BlueprintFieldTypeValues.BOOLEAN &&
      type !== BlueprintFieldTypeValues.DATE &&
      type !== BlueprintFieldTypeValues.ARRAY &&
      type !== BlueprintFieldTypeValues.OBJECT
    ) {
      throw new ValidationError(
        `${parentName} field type must be one of: string, number, boolean, date, array, object`,
      );
    }

    if (isStringField(field)) {
      const { regex, maxLength, minLength } = field;
      if (regex && typeof regex !== 'string') {
        throw new ValidationError(`${parentName} string field regex must be a string`);
      }

      if (
        typeof maxLength === 'number' &&
        typeof minLength === 'number' &&
        maxLength < minLength
      ) {
        throw new ValidationError(
          `${parentName} string field maxLength cannot be less than field minLength`,
        );
      }

      if (
        maxLength !== null &&
        maxLength !== undefined &&
        typeof maxLength !== 'number'
      ) {
        throw new ValidationError(
          `${parentName} string field maxLength must be a number`,
        );
      }

      if (
        minLength !== null &&
        minLength !== undefined &&
        typeof minLength !== 'number'
      ) {
        throw new ValidationError(
          `${parentName} string field minLength must be a number`,
        );
      }

      validatedField.regex = regex ?? undefined;
      validatedField.maxLength = maxLength ?? undefined;
      validatedField.minLength = minLength ?? undefined;
    }

    if (isNumberField(field)) {
      const { min, max, isInteger } = field;
      if (typeof max === 'number' && typeof min === 'number' && max < min) {
        throw new ValidationError(
          `${parentName} number field max cannot be less than field min`,
        );
      }

      if (max !== null && max !== undefined && typeof max !== 'number') {
        throw new ValidationError(`${parentName} number field max must be a number`);
      }

      if (min !== null && min !== undefined && typeof min !== 'number') {
        throw new ValidationError(`${parentName} number field min must be a number`);
      }

      if (isInteger && typeof isInteger !== 'boolean') {
        throw new ValidationError(
          `${parentName} number field isInteger must be a boolean`,
        );
      }

      validatedField.min = min ?? undefined;
      validatedField.max = max ?? undefined;
      validatedField.isInteger = isInteger ?? undefined;
    }

    // Boolean fields have no options at the moment, those would go here if added in the future.

    // Date fields have no options at the moment, those would go here if added in the future.

    if (isArrayField(field)) {
      console.log(field);
      const { maxLength, minLength, arrayOf } = field;
      if (
        typeof maxLength === 'number' &&
        typeof minLength === 'number' &&
        maxLength < minLength
      ) {
        throw new ValidationError(
          `${parentName} array field maxLength cannot be less than field minLength`,
        );
      }

      if (
        maxLength !== null &&
        maxLength !== undefined &&
        typeof maxLength !== 'number'
      ) {
        throw new ValidationError(`${parentName} array field maxLength must be a number`);
      }

      if (
        minLength !== null &&
        minLength !== undefined &&
        typeof minLength !== 'number'
      ) {
        throw new ValidationError(`${parentName} array field minLength must be a number`);
      }

      if (!arrayOf || typeof arrayOf !== 'object' || Array.isArray(arrayOf)) {
        throw new ValidationError(
          `${parentName} array field arrayOf must be a field object`,
        );
      }

      const validatedArrayOf = depthFirstValidation(
        [arrayOf],
        parentName === 'root' ? name : `${parentName}.${name}`,
      )[0];

      validatedField.minLength = minLength ?? undefined;
      validatedField.maxLength = maxLength ?? undefined;
      validatedField.arrayOf = validatedArrayOf;
    }

    if (isObjectField(field)) {
      const { fields } = field;
      if (!field || !Array.isArray(fields) || fields.length === 0) {
        throw new ValidationError(
          `${parentName} object field fields must be an array of blueprint field objects`,
        );
      }
      const validatedNestedFields = depthFirstValidation(
        fields,
        parentName === 'root' ? name : `${parentName}.${name}`,
      );
      validatedField.fields = validatedNestedFields;
    }

    validatedField.name = name;
    validatedField.type = type;
    validatedField.isRequired = isRequired;

    return validatedFields.concat(validatedField as unknown as BlueprintField);
  }, []);
};

type ValidateFields = ({
  fields,
  isOptional,
}: {
  fields?: unknown;
  isOptional?: boolean;
}) => BlueprintField[] | void;

const validateFields: ValidateFields = ({ fields, isOptional = false }) => {
  if (isOptional && (fields === undefined || fields === null)) {
    return;
  }

  if (fields === undefined || fields === null) {
    throw new ValidationError('root fields is missing from input');
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    throw new ValidationError('root fields must be an array of blueprint field objects');
  }

  return depthFirstValidation(fields satisfies unknown[]);
};

export default validateFields;
