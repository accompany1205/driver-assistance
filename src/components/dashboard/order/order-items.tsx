import type { FC } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import type { OrderItem } from '../../../types/order';
import { Scrollbar } from '../../scrollbar';

interface OrderItemsProps {
  orderItems: OrderItem[];
}

export const OrderItems: FC<OrderItemsProps> = (props) => {
  const { orderItems, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Order items" />
      <Divider />
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Billing Cycle
                </TableCell>
                <TableCell>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {item.name}
                      {' '}
                      x
                      {' '}
                      {item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.billingCycle}
                  </TableCell>
                  <TableCell>
                    {numeral(item.unitAmount).format(`${item.currency}0,0.00`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={orderItems.length}
        onPageChange={(): void => { }}
        onRowsPerPageChange={(): void => { }}
        page={0}
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

OrderItems.propTypes = {
  orderItems: PropTypes.array.isRequired
};
