import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import type { Theme } from '@mui/material';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import type { Order } from '../../../types/order';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';

interface OrderDetailsProps {
  order: Order;
}

const statusOptions = ['Canceled', 'Complete', 'Rejected'];

export const OrderSummary: FC<OrderDetailsProps> = (props) => {
  const { order, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [status, setStatus] = useState<string>(statusOptions[0]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const align = smDown ? 'vertical' : 'horizontal';

  return (
    <Card {...other}>
      <CardHeader title="Basic info" />
      <Divider />
      <PropertyList>
        <PropertyListItem
          align={align}
          label="Customer"
        >
          <Typography
            color="primary"
            variant="body2"
          >
            {order.customer.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {order.customer.address1}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {order.customer.city}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {order.customer.country}
          </Typography>
        </PropertyListItem>
        <Divider />
        <PropertyListItem
          align={align}
          label="ID"
          value={order.id}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Invoice"
          value={order.number}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Date"
          value={format(order.createdAt, 'dd/MM/yyyy HH:mm')}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Promotion Code"
          value={order.promotionCode}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Total Amount"
          value={`${order.currency}${order.totalAmount}`}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label="Status"
        >
          <Box
            sx={{
              alignItems: {
                sm: 'center'
              },
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              mx: -1
            }}
          >
            <TextField
              label="Status"
              margin="normal"
              name="status"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              sx={{
                flexGrow: 1,
                m: 1,
                minWidth: 150
              }}
              value={status}
            >
              {statusOptions.map((statusOption) => (
                <option
                  key={statusOption}
                  value={statusOption}
                >
                  {statusOption}
                </option>
              ))}
            </TextField>
            <Button
              sx={{ m: 1 }}
              variant="contained"
            >
              Save
            </Button>
            <Button sx={{ m: 1 }}>
              Cancel
            </Button>
          </Box>
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

OrderSummary.propTypes = {
  // @ts-ignore
  order: PropTypes.object.isRequired
};
