import { Request } from 'express';
import { fn, col, Order, OrderItem } from 'sequelize';

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

  let orderBy: 'ASC' | 'DESC' = 'DESC';
  if (typeof query.orderBy === 'string' && query.orderBy.toUpperCase() === 'ASC') {
    orderBy = 'ASC';
  }

  // TODO: This is not my favorite but it works for now. Its just flimsy because it makes assumptions
  //       that all date-related column names end with 'On'. Its always true for now, but be wary.
  let orderItem: OrderItem = [orderColumn, orderBy];
  if (orderColumn.startsWith('__')) {
    const [associationName, columnName] = orderColumn.replace('__', '').split('_');
    orderItem = [associationName, columnName, orderBy];
  } else if (!orderColumn.startsWith('is') && !orderColumn.endsWith('On')) {
    orderItem = [fn('LOWER', col(orderColumn)), orderBy];
  }

  const order = [orderItem] satisfies Order;

  return order;
};

export default validateOrder;
