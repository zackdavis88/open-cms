import { Request } from 'express';
import { Op, WhereOptions } from 'sequelize';

const isAssociationColumn = (columnName: string) => columnName.startsWith('__');
const isNotAssociationColumn = (columnName: string) => !columnName.startsWith('__');
const isString = (value: unknown) => typeof value === 'string';
const isArray = (value: unknown) => Array.isArray(value);
const isDate = (value: string) => !isNaN(new Date(value).getTime());
const isBooleanStringValue = (value: string) =>
  value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
const getDateOp = (value: string) => {
  switch (value.toLowerCase()) {
    case 'eq':
      return Op.eq;
    case 'gt':
      return Op.gt;
    case 'lt':
      return Op.lt;
    case 'gte':
      return Op.gte;
    case 'lte':
      return Op.lte;
    default:
      return undefined;
  }
};

type ValidateBooleanFilters = ({
  query,
  booleanColumns,
}: {
  query: Request['query'];
  booleanColumns: string[];
}) => void | WhereOptions;

const validateBooleanFilters: ValidateBooleanFilters = ({
  query,
  booleanColumns,
}: {
  query: Request['query'];
  booleanColumns: string[];
}) => {
  const { filterBooleanColumn, filterBooleanValue } = query;
  const lowerCasedColumnNames = booleanColumns.map((columnName) =>
    columnName.toLowerCase(),
  );

  if (isString(filterBooleanColumn) && isString(filterBooleanValue)) {
    const filterBooleanColumnIndex = lowerCasedColumnNames.indexOf(
      filterBooleanColumn.toLowerCase(),
    );
    const filterBooleanColumnIsValid = filterBooleanColumnIndex !== -1;
    if (filterBooleanColumnIsValid && isBooleanStringValue(filterBooleanValue)) {
      return {
        [booleanColumns[filterBooleanColumnIndex]]:
          filterBooleanValue.toLowerCase() === 'true',
      };
    }
  } else if (isArray(filterBooleanColumn) && isArray(filterBooleanValue)) {
    return filterBooleanColumn.reduce<WhereOptions>(
      (prev, filterBooleanColumnName, index) => {
        if (isString(filterBooleanColumnName)) {
          const filterBooleanColumnIndex = lowerCasedColumnNames.indexOf(
            filterBooleanColumnName.toLowerCase(),
          );
          const filterBooleanColumnIsValid = filterBooleanColumnIndex !== -1;
          const filterBooleanValueFromArray = filterBooleanValue[index];
          if (
            filterBooleanColumnIsValid &&
            filterBooleanValueFromArray &&
            isString(filterBooleanValueFromArray) &&
            isBooleanStringValue(filterBooleanValueFromArray)
          ) {
            return {
              ...prev,
              [booleanColumns[filterBooleanColumnIndex]]:
                filterBooleanValueFromArray.toLowerCase() === 'true',
            };
          }
        }

        return prev;
      },
      {},
    );
  }
};

type ValidateStringFilters = ({
  query,
  stringColumns,
}: {
  query: Request['query'];
  stringColumns: string[];
}) => void | WhereOptions;

const validateStringFilters: ValidateStringFilters = ({
  query,
  stringColumns,
}: {
  query: Request['query'];
  stringColumns: string[];
}) => {
  const { filterStringColumn, filterStringValue } = query;
  const lowerCasedColumnNames = stringColumns.map((columnName) =>
    columnName.toLowerCase(),
  );

  if (isString(filterStringColumn) && isString(filterStringValue)) {
    // Make sure filterStringColumn is a valid column.
    // Return object that can be used in where-query later on.
    const filterStringColumnIndex = lowerCasedColumnNames.indexOf(
      filterStringColumn.toLowerCase(),
    );
    const filterStringColumnIsValid = filterStringColumnIndex !== -1;
    if (filterStringColumnIsValid) {
      return {
        [stringColumns[filterStringColumnIndex]]: {
          [Op.iLike]: filterStringValue,
        },
      };
    }
  } else if (isArray(filterStringColumn) && isArray(filterStringValue)) {
    // Iterate over the filterStringColumn array.
    // Make sure each entry is a valid column.
    // Assume value is at the same index as column.
    return filterStringColumn.reduce<WhereOptions>(
      (prev, filterStringColumnName, index) => {
        if (isString(filterStringColumnName)) {
          const filterStringColumnIndex = lowerCasedColumnNames.indexOf(
            filterStringColumnName.toLowerCase(),
          );
          const filterStringColumnIsValid = filterStringColumnIndex !== -1;
          const filterStringValueFromArray = filterStringValue[index];
          if (
            filterStringColumnIsValid &&
            filterStringValueFromArray &&
            isString(filterStringValueFromArray)
          ) {
            return {
              ...prev,
              [stringColumns[filterStringColumnIndex]]: {
                [Op.iLike]: filterStringValueFromArray,
              },
            };
          }
        }

        return prev;
      },
      {},
    );
  }
};

type ValidateDateFilters = ({
  query,
  dateColumns,
}: {
  query: Request['query'];
  dateColumns: string[];
}) => void | WhereOptions;
const validateDateFilters: ValidateDateFilters = ({ query, dateColumns }) => {
  const { filterDateColumn, filterDateValue, filterDateOp } = query;
  const lowerCasedColumnNames = dateColumns.map((columnName) => columnName.toLowerCase());

  if (isString(filterDateColumn) && isString(filterDateValue) && isString(filterDateOp)) {
    const filterDateColumnIndex = lowerCasedColumnNames.indexOf(
      filterDateColumn.toLowerCase(),
    );
    const filterDateColumnIsValid = filterDateColumnIndex !== -1;
    const dateOp = getDateOp(filterDateOp);
    if (filterDateColumnIsValid && isDate(filterDateValue) && dateOp) {
      return {
        [dateColumns[filterDateColumnIndex]]: {
          [dateOp]: filterDateValue,
        },
      };
    }
  } else if (
    isArray(filterDateColumn) &&
    isArray(filterDateValue) &&
    isArray(filterDateOp)
  ) {
    return filterDateColumn.reduce<WhereOptions>((prev, filterDateColumnName, index) => {
      const filterDateArrayValue = filterDateValue[index];
      const filterDateArrayOp = filterDateOp[index];
      if (
        isString(filterDateColumnName) &&
        isString(filterDateArrayValue) &&
        isString(filterDateArrayOp)
      ) {
        const filterDateColumnIndex = lowerCasedColumnNames.indexOf(
          filterDateColumnName.toLowerCase(),
        );
        const filterDateColumnIsValid = filterDateColumnIndex !== -1;
        const dateOp = getDateOp(filterDateArrayOp);
        if (filterDateColumnIsValid && isDate(filterDateArrayValue) && dateOp) {
          return {
            ...prev,
            [dateColumns[filterDateColumnIndex]]: {
              [dateOp]: filterDateValue,
            },
          };
        }
      }

      return prev;
    }, {});
  }
};

type ValidateFilters = ({
  query,
  allowedColumns,
}: {
  query: Request['query'];
  allowedColumns: {
    stringColumns?: string[];
    dateColumns?: string[];
    booleanColumns?: string[];
  };
}) => {
  filterStrings: WhereOptions | void;
  filterDates: WhereOptions | void;
  filterBooleans: WhereOptions | void;
  filterAssociations: Record<string, WhereOptions>;
} | void;

const validateFilters: ValidateFilters = ({
  query,
  allowedColumns: { stringColumns, dateColumns, booleanColumns },
}) => {
  const stringAssociationColumns =
    stringColumns && stringColumns.filter(isAssociationColumn);
  const dateAssociationColumns = dateColumns && dateColumns.filter(isAssociationColumn);
  const booleanAssociationColumns =
    booleanColumns && booleanColumns.filter(isAssociationColumn);

  const filterStrings =
    stringColumns &&
    validateStringFilters({
      query,
      stringColumns: stringColumns.filter(isNotAssociationColumn),
    });
  const filterAssociationStrings =
    stringAssociationColumns &&
    validateStringFilters({ query, stringColumns: stringAssociationColumns });
  const filterDates =
    dateColumns &&
    validateDateFilters({
      query,
      dateColumns: dateColumns.filter(isNotAssociationColumn),
    });
  const filterAssociationDates =
    dateAssociationColumns &&
    validateDateFilters({ query, dateColumns: dateAssociationColumns });

  const filterBooleans =
    booleanColumns &&
    validateBooleanFilters({
      query,
      booleanColumns: booleanColumns.filter(isNotAssociationColumn),
    });

  const filterAssociationBooleans =
    booleanAssociationColumns &&
    validateBooleanFilters({
      query,
      booleanColumns: booleanAssociationColumns,
    });

  if (
    !filterStrings &&
    !filterDates &&
    !filterAssociationStrings &&
    !filterAssociationDates &&
    !filterBooleans &&
    !filterAssociationBooleans
  ) {
    return;
  }

  return {
    filterStrings,
    filterDates,
    filterBooleans,
    filterAssociations: { ...filterAssociationStrings, ...filterAssociationDates },
  };
};

export default validateFilters;
