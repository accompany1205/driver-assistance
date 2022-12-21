import type { FC } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import type { User } from '../../../types/user';
import { wait } from '../../../utils/wait';

interface UserEditFormProps {
  user: User;
}

export const UserView: FC<UserEditFormProps> = (props) => {
  const { user, ...other } = props;
  const formik = useFormik({
    initialValues: {
      address1: user.address1 || '',
      address2: user.address2 || '',
      country: user.country || '',
      email: user.email || '',
      password: user.password || '',
      hasDiscount: user.hasDiscount || false,
      isVerified: user.isVerified || false,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      phone: user.phone || '',
      status: user.status || '',
      submit: null
    },
    validationSchema: Yup.object({
      address1: Yup.string().max(255),
      address2: Yup.string().max(255),
      country: Yup.string().max(255),
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      hasDiscount: Yup.bool(),
      isVerified: Yup.bool(),
      firstname: Yup
        .string()
        .max(255)
        .required('First Name is required'),
      lastname: Yup
        .string()
        .max(255)
        .required('Last Name is required'),
      phone: Yup.string().max(15),
      state: Yup.string().max(255)
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      
    }
  });

  return (
    <form
      
      {...other}
    >
      <Card>
        <CardHeader title="Edit user" />
        <Divider />
        <CardContent>
        <Grid container spacing={3} sx={{mb:5}}>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.firstname && formik.errors.firstname)}
                fullWidth
                //helperText={formik.touched.name && formik.errors.name}
                label="First name"
                name="first"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                defaultValue={formik.values.firstname}
              />
            
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.lastname && formik.errors.lastname)}
                fullWidth
                //helperText={formik.touched.name && formik.errors.name}
                label="Full name"
                name="lastname"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                defaultValue={formik.values.lastname}
              />
            </Grid>
        </Grid>
        <Grid
            container
            spacing={3}
            sx={{mb:5}}
          >
            
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email address"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                defaultValue={formik.values.email}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                defaultValue={formik.values.password}
              />
            </Grid>
        </Grid>
        <Grid
            container
            spacing={3}
            sx={{mb:5}}
          >
            
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors.phone}
                label="Phone"
                name="phone"
                onBlur={formik.handleBlur}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onChange={formik.handleChange}
                required
                defaultValue={formik.values.phone}
              />
            </Grid>
        </Grid>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3
            }}
          >
            <Switch
              defaultChecked={formik.values.status === 'active' ? true : false}
              color="primary"
              edge="start"
              name="status"
              onChange={formik.handleChange}
              //value={formik.values.status === 'active' ? true : false}
            />
          </Box>
        </CardContent>
        <CardActions
          sx={{
            flexWrap: 'wrap',
            m: -1,
            display:'flex',
            justifyContent:'space-around'
          }}
        >
        <Button
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
            >
            Update
        </Button>

        <Button
            color="error"
            disabled={formik.isSubmitting}
        >
            Delete user
        </Button>
        </CardActions>
      </Card>
    </form>
  );
};

UserView.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};
