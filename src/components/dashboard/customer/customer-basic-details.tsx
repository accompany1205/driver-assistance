import type { FC } from 'react';
import PropTypes from 'prop-types';
import type { Theme } from '@mui/material';
import { Button, Card, CardActions, CardHeader, Divider, useMediaQuery } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';

interface CustomerBasicDetailsProps {
  address1?: string;
  address2?: string;
  country?: string;
  email: string;
  isVerified: boolean;
  phone?: string;
  state?: string;
}

export const CustomerBasicDetails: FC<CustomerBasicDetailsProps> = (props) => {
  const { address1, address2, country, email, isVerified, phone, state, ...other } = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const align = mdUp ? 'horizontal' : 'vertical';

  return (
    <Card {...other}>
      <CardHeader title="Basic Details" />
      <Divider />
      <PropertyList>
        <PropertyListItem
          align={align}
          divider
          label="Email"
          value={email}
        />
        <PropertyListItem
          align={align}
          divider
          label="Phone"
          value={phone}
        />
        <PropertyListItem
          align={align}
          divider
          label="Country"
          value={country}
        />
        <PropertyListItem
          align={align}
          divider
          label="State/Region"
          value={state}
        />
        <PropertyListItem
          align={align}
          divider
          label="Address 1"
          value={state}
        />
        <PropertyListItem
          align={align}
          divider
          label="Address 2"
          value={address2}
        />
      </PropertyList>
      <CardActions
        sx={{
          flexWrap: 'wrap',
          px: 3,
          py: 2,
          m: -1
        }}
      >
        <Button
          sx={{ m: 1 }}
          variant="outlined"
        >
          Reset &amp; Send Password
        </Button>
        <Button sx={{ m: 1 }}>
          Login as Customer
        </Button>
      </CardActions>
    </Card>
  );
};

CustomerBasicDetails.propTypes = {
  address1: PropTypes.string,
  address2: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
  phone: PropTypes.string,
  state: PropTypes.string
};
