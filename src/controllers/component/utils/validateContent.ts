import { Blueprint, BlueprintVersion } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';
import {
  BlueprintFieldTypeValues,
  StringBlueprintField,
  NumberBlueprintField,
  ArrayBlueprintField,
  ObjectBlueprintField,
  BooleanBlueprintField,
  DateBlueprintField,
} from 'src/types';

// TODO: These is-helpers are copy-pasted from Blueprint validation. If we end up using them, lets move them to
//       a central location for both endpoints to use.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStringField = (field: unknown): field is StringBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.STRING;

const isNumberField = (field: unknown): field is NumberBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.NUMBER;

const isBooleanField = (field: unknown): field is BooleanBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.BOOLEAN;

const isDateField = (field: unknown): field is DateBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.DATE;

const isArrayField = (field: unknown): field is ArrayBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.ARRAY;

const isObjectField = (field: unknown): field is ObjectBlueprintField =>
  isRecord(field) &&
  typeof field.type === 'string' &&
  field.type.toLowerCase() === BlueprintFieldTypeValues.OBJECT;

const validateStringContent = ({
  blueprintField,
  contentValue,
}: {
  blueprintField: StringBlueprintField;
  contentValue: unknown;
}) => {
  const { name, minLength, maxLength } = blueprintField;

  if (typeof contentValue !== 'string') {
    throw new ValidationError(`${name} value must be a string`);
  }

  if (typeof minLength === 'number' && contentValue.length < minLength) {
    throw new ValidationError(`${name} value has a minLength of ${minLength}`);
  }

  if (typeof maxLength === 'number' && contentValue.length > maxLength) {
    throw new ValidationError(`${name} value has a maxLength of ${maxLength}`);
  }

  // Attempt to compare the regex, if somehow we cant then consider validation as passing.
  if (blueprintField.regex) {
    try {
      const regex = new RegExp(blueprintField.regex);
      if (!regex.test(contentValue)) {
        throw new ValidationError(
          `${name} value does not match regex: ${blueprintField.regex}`,
        );
      }
    } catch (error) {
      // SyntaxError means we failed to instantiate a RegExp class, in that scenario lets silently move on.
      if (error instanceof SyntaxError) {
        return;
      }
      throw error;
    }
  }
};

const validateNumberContent = ({
  blueprintField,
  contentValue,
}: {
  blueprintField: NumberBlueprintField;
  contentValue: unknown;
}) => {
  const { name, min, max, isInteger } = blueprintField;

  if (typeof contentValue !== 'number') {
    throw new ValidationError(`${name} value must be a number`);
  }

  if (typeof min === 'number' && contentValue < min) {
    throw new ValidationError(`${name} value has a min of ${min}`);
  }

  if (typeof max === 'number' && contentValue > max) {
    throw new ValidationError(`${name} value has a max of ${max}`);
  }

  if (isInteger && !Number.isInteger(contentValue)) {
    throw new ValidationError(`${name} value must be an integer`);
  }
};

const validateBooleanContent = ({
  blueprintField,
  contentValue,
}: {
  blueprintField: BooleanBlueprintField;
  contentValue: unknown;
}) => {
  const { name } = blueprintField;

  if (typeof contentValue !== 'boolean') {
    throw new ValidationError(`${name} value must be a boolean`);
  }
};

const validateDateContent = ({
  blueprintField,
  contentValue,
}: {
  blueprintField: DateBlueprintField;
  contentValue: unknown;
}) => {
  const { name } = blueprintField;
  if (typeof contentValue !== 'string' && contentValue !== 'number') {
    throw new ValidationError(`${name} value must be a valid date-string or epoch time`);
  }

  const date = new Date(contentValue);
  if (isNaN(date.valueOf())) {
    throw new ValidationError(`${name} value must be a valid date`);
  }

  return date;
};

type ValidateArrayContent = ({
  blueprintField,
  contentValue,
}: {
  blueprintField: ArrayBlueprintField;
  contentValue: unknown;
}) => unknown[];

const validateArrayContent: ValidateArrayContent = ({ blueprintField, contentValue }) => {
  const { name, maxLength, minLength, arrayOf } = blueprintField;
  if (!Array.isArray(contentValue)) {
    throw new ValidationError(`${name} value must be an array`);
  }

  if (typeof minLength === 'number' && contentValue.length < minLength) {
    throw new ValidationError(`${name} has a minLength of ${minLength}`);
  }

  if (typeof maxLength === 'number' && contentValue.length > maxLength) {
    throw new ValidationError(`${name} has a maxLength of ${maxLength}`);
  }

  const arrayOfIsString = isStringField(arrayOf);
  const arrayOfIsNumber = isNumberField(arrayOf);
  const arrayOfIsBoolean = isBooleanField(arrayOf);
  const arrayOfIsDate = isDateField(arrayOf);
  const arrayOfIsArray = isArrayField(arrayOf);
  const arrayOfIsObject = isObjectField(arrayOf);
  const validatedArrayContent = contentValue.reduce<unknown[]>(
    (validatedArrayContent, contentArrayItem) => {
      if (arrayOfIsString) {
        validateStringContent({
          blueprintField: arrayOf,
          contentValue: contentArrayItem,
        });
        return validatedArrayContent.concat(contentArrayItem);
      }

      if (arrayOfIsNumber) {
        validateNumberContent({
          blueprintField: arrayOf,
          contentValue: contentArrayItem,
        });
        return validatedArrayContent.concat(contentArrayItem);
      }

      if (arrayOfIsBoolean) {
        validateBooleanContent({
          blueprintField: arrayOf,
          contentValue: contentArrayItem,
        });
        return validatedArrayContent.concat(contentArrayItem);
      }

      if (arrayOfIsDate) {
        validateDateContent({
          blueprintField: arrayOf,
          contentValue: contentArrayItem,
        });
        return validatedArrayContent.concat(contentArrayItem);
      }

      if (arrayOfIsArray) {
        const validatedNestedArrayContent = validateArrayContent({
          blueprintField: arrayOf,
          contentValue: contentArrayItem,
        });
        return validatedArrayContent.concat(validatedNestedArrayContent);
      }

      if (arrayOfIsObject) {
        const validatedObjectContent = validateObjectContent({
          blueprintField: arrayOf,
          contentValue: contentArrayItem,
        });
        return validatedArrayContent.concat(validatedObjectContent);
      }

      return validatedArrayContent;
    },
    [],
  );

  return validatedArrayContent;
};

const validateObjectContent = ({
  blueprintField,
  contentValue,
}: {
  blueprintField: ObjectBlueprintField;
  contentValue: unknown;
}) => {
  const { name, fields } = blueprintField;
  if (!isRecord(contentValue)) {
    throw new ValidationError(`${name} value must be an object`);
  }

  const validatedContentObject = depthFirstValidation({ fields, content: contentValue });
  return validatedContentObject;
};

/**
 * The purpose of this function is to validate and sanitize the content that a user has given us.
 * We will iterate over the blueprint, ensuring that component data matches blueprint specs.
 *
 * The end result, assuming no errors, will be a plain JSON object that contains only keys/values that
 * match the blueprint spec.
 */
type DepthFirstValidation = (input: {
  fields: Blueprint['fields'];
  content: Record<string, unknown>;
}) => Record<string, unknown>;

const depthFirstValidation: DepthFirstValidation = ({ fields, content }) => {
  return fields.reduce<Record<string, unknown>>((validatedContent, blueprintField) => {
    const { name, isRequired } = blueprintField;
    const contentValue = content[name];
    if (!isRequired && (contentValue === null || contentValue === undefined)) {
      return validatedContent;
    }

    if (isStringField(blueprintField)) {
      validateStringContent({ blueprintField, contentValue });
      return Object.assign(validatedContent, { [name]: contentValue });
    }

    if (isNumberField(blueprintField)) {
      validateNumberContent({ blueprintField, contentValue });
      return Object.assign(validatedContent, { [name]: contentValue });
    }

    if (isBooleanField(blueprintField)) {
      validateBooleanContent({ blueprintField, contentValue });
      return Object.assign(validatedContent, { [name]: contentValue });
    }

    if (isDateField(blueprintField)) {
      const contentValueAsDate = validateDateContent({ blueprintField, contentValue });
      return Object.assign(validatedContent, { [name]: contentValueAsDate });
    }

    if (isArrayField(blueprintField)) {
      const validatedContentArray = validateArrayContent({
        blueprintField,
        contentValue,
      });
      return Object.assign(validatedContent, { [name]: validatedContentArray });
    }

    if (isObjectField(blueprintField)) {
      const validatedContentObject = validateObjectContent({
        blueprintField,
        contentValue,
      });
      return Object.assign(validatedContent, { [name]: validatedContentObject });
    }

    return validatedContent;
  }, {});
};

type ValidateContent = (input: {
  blueprint: Blueprint | BlueprintVersion;
  content?: unknown;
  isOptional?: boolean;
}) => Record<string, unknown> | undefined;

const validateContent: ValidateContent = ({ blueprint, content, isOptional }) => {
  if (isOptional && (content === undefined || content === null)) {
    return;
  }

  if (content === undefined || content === null) {
    throw new ValidationError('content is missing from input');
  }

  if (!isRecord(content)) {
    throw new ValidationError(
      'content must be an object that matches the blueprint shape',
    );
  }

  return depthFirstValidation({ fields: blueprint.fields, content });
};

export default validateContent;
