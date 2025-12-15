import { Request } from 'express';
import { fn, cast, col, Order } from 'sequelize';

type ValidateOrder = ({
  query,
  defaultOrderColumn,
  allowedColumns,
}: {
  query: Request['query'];
  defaultOrderColumn: string;
  allowedColumns: string[];
}) => Order;

const validateOrder: ValidateOrder = ({ query, defaultOrderColumn, allowedColumns }) => {
  let orderColumn = defaultOrderColumn;
  if (typeof query.orderColumn === 'string') {
    orderColumn = query.orderColumn;
  }

  const loweredColumnNames = allowedColumns.map((columnName) => columnName.toLowerCase());
  const columnNameIndex = loweredColumnNames.indexOf(orderColumn.toLowerCase());
  if (columnNameIndex !== -1) {
    orderColumn = allowedColumns[columnNameIndex];
  } else {
    orderColumn = defaultOrderColumn;
  }

  let orderBy = 'ASC';
  if (typeof query.orderBy === 'string' && query.orderBy.toUpperCase() === 'DESC') {
    orderBy = 'DESC';
  }

  const order = [[fn('LOWER', cast(col(orderColumn), 'text')), orderBy]] satisfies Order;

  return order;
};

export type OrderData = ReturnType<typeof validateOrder>;
export default validateOrder;
