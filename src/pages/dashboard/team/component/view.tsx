import { useCallback, useEffect, useState, FC } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography, Grid, Stack, Button, Divider, Table, TableBody, TableRow, TableCell} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMounted } from '../../../../hooks/use-mounted';
import type { User } from '../../../../types/user';
import { getInitials } from '../../../../utils/get-initials';
import Iconify from '../../../../components/Iconify';
import { CONSTANTS } from 'src/utils/constants';
import { useSelector } from 'react-redux';

interface UserViewType {
  editCallback: (user:User) => void,
}
export const UserView: FC<UserViewType> = (props) => {
  const isMounted = useMounted();
  const { editCallback } = props;
  
  const user = useSelector((slice:any)=>slice.user.selectedUser);
  if (!user) {
    return null;
  }
  const handleEdit = () => {
    editCallback(user);
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: 'white',
          flexGrow: 1,
          py: 8,
          borderRadius:1
        }}
      >
        <Container maxWidth="md">
        <Grid container >
            <Grid item xs={12} md={5}>
              <Stack direction="column" alignItems="center">
                <Typography
                  noWrap
                  variant="h3"
                  sx={{ textAlign: 'center', mb:4 }}
                >
                  {user?.firstname + ' ' + user?.lastname}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={1}></Grid>
            <Grid item xs={12} md={6}>
              <Stack direction='row' justifyContent="space-between" sx={{mt:2}}>
                <Typography variant='h6' sx={{fontWeight:'bold',ml:2}}>Personal Info</Typography>
                <Button variant='text' onClick={handleEdit}><Iconify icon={'akar-icons:pencil'} width={20} height={20} /> edit</Button>
              </Stack>
              <Divider />
            </Grid>
          </Grid>
          <Grid container >
            <Grid item xs={12} md={5}>
              <Stack direction="column" alignItems="center">
                <Avatar
                  src={CONSTANTS.serverURL+'/'+user.photoURL}
                  sx={{
                    height: '17vw',
                    mr: 2,
                    width: '17vw',
                    minHeight:170,
                    minWidth:170,
                    
                  }}
                />
              </Stack>

            </Grid>
            <Grid item xs={12} md={1}></Grid>
            <Grid item xs={12} md={6}>
              <div 
                style={{
                  height:'100%',
                  display:'flex',
                  flexWrap:'wrap',
                  alignItems:'center'
                }}
                >
                <Table >
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{width: '50%'}}>Full Name</TableCell>
                      <TableCell sx={{fontWeight:'bold'}}>{user?.firstname+' '+user?.lastname}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell sx={{fontWeight:'bold'}}>{user?.role}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell sx={{fontWeight:'bold'}}>{user?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell sx={{fontWeight:'bold'}}>{user?.phone}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>              
              </div>
              
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

UserView.propTypes = {

};
