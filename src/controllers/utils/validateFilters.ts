import { Request } from 'express';
import { Op, WhereOptions } from 'sequelize';

const isString = (value: unknown) => typeof value === 'string';
const isArray = (value: unknown) => Array.isArray(value);
const isDate = (value: string) => !isNaN(new Date(value).getTime());
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
    stringColumns: string[];
    dateColumns: string[];
  };
}) => void | WhereOptions;

const validateFilters: ValidateFilters = ({
  query,
  allowedColumns: { stringColumns, dateColumns },
}) => {
  const filterStrings = validateStringFilters({ query, stringColumns });
  const filterDates = validateDateFilters({ query, dateColumns });

  if (!filterStrings && !filterDates) {
    return;
  }

  return { ...filterStrings, ...filterDates };
};

export default validateFilters;
