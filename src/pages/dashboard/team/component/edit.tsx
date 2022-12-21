import { useEffect, useState, FC, ChangeEvent, useCallback } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { Avatar, Box, Typography, Grid, TextField, Switch, MenuItem, Divider, Button,Stack } from '@mui/material';

import { useMounted } from '../../../../hooks/use-mounted';
import type { User } from '../../../../types/user';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { updateUser } from 'src/slices/user';
import  {UploadAvatar}  from '../../../../components/upload';
import {CONSTANTS} from '../../../../utils/constants';
import { useAuth } from '../../../../hooks/use-auth';
import { AuthContext } from '../../../../contexts/jwt-context';


interface UserEditType{
  user: User|undefined,
  callback: (description: string) => void;
}
interface FIleType{
  file: File|null,
  preview: string
}
export const UserEdit: FC<UserEditType> = (props) => {
  const isMounted = useMounted();
  const {user, callback} = props;

  const authUser = React.useContext(AuthContext).user;

  const { update } = useAuth()
  if (!user) {
    return null;
  }
  
  const {serverURL} = CONSTANTS;
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      // address1: user.address1 || '',
      // address2: user.address2 || '',
      // country: user.country || '',
      email: user.email || '',
      password: user.password || '',
      // hasDiscount: user.hasDiscount || false,
      // isVerified: user.isVerified || false,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      phone: user.phone || '',
      status: user.status || '',
      submit: null,
      roleId: user.roleId || 2,
      role: user.role || 'User',
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
      try {
            await dispatch(updateUser(user.id,values.firstname, values.lastname, values.phone, values.email, values.password, values.status.length>0?'active':'inActive',values.role, avatarFile?.file))
            if(user.id == authUser?.id)
              update(user.id);
            callback('update');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const [avatarFile, setAvatarFile]  = useState<FIleType>();

  const handleDrop = useCallback(async (acceptedFile: File) => {
    const file = acceptedFile;
    if (file) {
      setAvatarFile({
        file,
        preview: URL.createObjectURL(file)
      });
    }
    
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
      <Grid 
        container
        sx={{
          pt:6
        }}
      >
        <Grid item xs={5} md={5} sm={12}
        >
          <Box
            sx={{
              alignItems: 'center',
              justifyContent:'center',
              display: 'flex',
              flexWrap: 'wrap',
              mt: 7,
              
            }}
          >
            <UploadAvatar photoURL={user.photoURL?CONSTANTS.serverURL+'/'+user.photoURL:'/static/mock-images/user.png'} callback={handleDrop}/>
            
            <Box
              sx={{
                alignItems: 'center',
                justifyContent:'space-around',
                display: 'flex',
                width:'100%',
                mt:4
              }}
            >
              <p>
                Status
              </p>
              <Switch
                defaultChecked={formik.values.status === 'active' ? true : false}
                color="success"
                edge="start"
                name="status"
                onChange={formik.handleChange}
                //value={formik.values.status === 'active' ? true : false}
              />
            </Box>
            
          </Box>
            
        </Grid>
        <Grid item xs={7} md={7} sm={12}>
          <Typography 
            sx={{
              width:'100%',
              mb:1,
              mt:5,
              pl:2
              }} 
            variant='h6'
          >
            Personal Info
          </Typography>
          <Divider/>
          <Grid 
            container
            sx={{
              pr:3,
              pl:2,
              mb:2,
              mt:2,
              display:'flex',
              flexWrap:'wrap',
              alignItems:'center',
              justifyContent:'space-between'
            }}
          >
            <Grid item xs={12} md={3} sm={12}>
              <p style={{fontSize: 13}}>First Name</p>
            </Grid>
            <Grid item xs={12} md={7} sm={12}>
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
          </Grid>
          <Grid 
            container
            sx={{
              pr:3,
              pl:2,
              mb:2,
              display:'flex',
              flexWrap:'wrap',
              alignItems:'center',
              justifyContent:'space-between'
            }}
          >
            <Grid item xs={3} md={3} sm={12}>
              <p style={{fontSize: 13}}>Last Name</p>
            </Grid>
            <Grid item xs={7} md={7} sm={12}>
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
            sx={{
              pr:3,
              pl:2,
              mb:2,
              display:'flex',
              flexWrap:'wrap',
              alignItems:'center',
              justifyContent:'space-between'
            }}
          >
            <Grid item xs={3} md={3} sm={12}>
              <p style={{fontSize: 13}}>Role</p>
            </Grid>
            <Grid item xs={7} md={7} sm={12}>
              <TextField
                error={Boolean(formik.touched.role && formik.errors.role)}
                fullWidth
                //helperText={formik.touched.role && formik.errors.role}
                select
                id="rold"
                label="Role"
                name='role'
                type="text"
                onChange={formik.handleChange}
                defaultValue={user?.roleId||3}
              >
                <MenuItem value='1'>
                  {"Admin"}
                </MenuItem>
                <MenuItem value='2'>
                  {"Dispatcher"}
                </MenuItem>
                <MenuItem value='3'>
                  {"User"}
                </MenuItem>
                
              </TextField>
            </Grid>
          </Grid>
          <Grid 
            container
            sx={{
              pr:3,
              pl:2,
              mb:2,
              display:'flex',
              flexWrap:'wrap',
              alignItems:'center',
              justifyContent:'space-between'
            }}
          >
            <Grid item xs={3} md={3} sm={12}>
              <p style={{fontSize: 13}}>Phone</p>
            </Grid>
            <Grid item xs={7} md={7} sm={12}>
              <TextField
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors.phone}
                label="Phone"
                name="phone"
                onBlur={formik.handleBlur}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onChange={formik.handleChange}
                //required
                defaultValue={formik.values.phone}
              />
            </Grid>
          </Grid>
          <Grid 
            container
            sx={{
              pr:3,
              pl:2,
              mb:2,
              display:'flex',
              flexWrap:'wrap',
              alignItems:'center',
              justifyContent:'space-between'
            }}
          >
            <Grid item xs={3} md={3} sm={12}>
              <p style={{fontSize: 13}}>Email</p>
            </Grid>
            <Grid item xs={7} md={7} sm={12}>
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
          </Grid>
          <Grid 
            container
            sx={{
              pr:3,
              pl:2,
              mb:2,
              display:'flex',
              flexWrap:'wrap',
              alignItems:'center',
              justifyContent:'space-between'
            }}
          >
            <Grid item xs={3} md={3} sm={12}>
              <p style={{fontSize: 13}}>Password</p>
            </Grid>
            <Grid item xs={7} md={7} sm={12}>
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
          
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="center">
        <Button
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 3,mr:4 }}
            variant="contained"
            >
            Update
          </Button>

        <Button
            color="error"
            onClick={(e)=>callback('cancel')}
        >
            Cancel
        </Button>
      </Stack>
    </form>
  );
};

UserEdit.propTypes = {
 
};
