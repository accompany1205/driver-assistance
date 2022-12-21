import type { FC } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

export const CustomerDataManagement: FC = (props) => (
  <Card {...props}>
    <CardHeader title="Data Management" />
    <Divider />
    <CardContent>
      <Button
        color="error"
        variant="outlined"
      >
        Delete Account
      </Button>
      <Box sx={{ mt: 1 }}>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          Remove this customer’s chart if he requested that, if not
          please be aware that what has been deleted can never brought
          back
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
