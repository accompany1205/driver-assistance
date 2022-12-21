import type { ChangeEvent, MouseEvent, FC } from 'react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Switch,
  MenuItem,
  Stack 
} from '@mui/material';
import { gtm } from '../../../../lib/gtm';
import type { User } from '../../../../types/user';

import { addUser, updateAvatar } from '../../../../slices/user';

import axios from '../../../../utils/axios';
import { CONSTANTS } from '../../../../utils/constants';
import  {UploadAvatar}  from '../../../../components/upload';



type SortField = 'updatedAt' | 'totalOrders';

type SortDir = 'asc' | 'desc';

type Sort =
  | 'updatedAt|desc'
  | 'updatedAt|asc'
  | 'totalOrders|desc'
  | 'totalOrders|asc';

interface SortOption {
  label: string;
  value: Sort;
}

type TabValue = 'all' | 'active' | 'inActive';

interface Tab {
  label: string;
  value: TabValue;
}

const tabs: Tab[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Passive',
    value: 'inActive'
  }
];

const sortOptions: SortOption[] = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  }
];

interface FIleType{
  file: File|null,
  preview: string
}
interface UserAddType{
    callback:() => void,
}


export const UserAdd: FC<UserAddType> = (props) => {

  const {callback} = props;

  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('3');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);

  const dispatch = useDispatch();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

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

  const handleSubmit = async (event: MouseEvent<{}>): Promise<any> => {
    setStatus(false);
    //
    callback();
    const id = await dispatch(addUser(name, lastName, role, phone, email, password, status, avatarFile?.file?.name));
    
    if(!id)  return;
    if(id && avatarFile && avatarFile.file){
      
       dispatch(updateAvatar(id,avatarFile.file));
    }
  }

  const handleCancel = (event: any):void =>{
    callback();
  }

  const handleName = (event: ChangeEvent<HTMLInputElement>):void => {
    setName(event.target.value);
  }
  const handleLastName = (event: ChangeEvent<HTMLInputElement>):void => {
    setLastName(event.target.value);
  }
  const handleEmail = (event: ChangeEvent<HTMLInputElement>):void => {
    setEmail(event.target.value);
  }
  const handlePhone = (event: ChangeEvent<HTMLInputElement>):void => {
    setPhone(event.target.value);
  }
  const handleRole = (event: ChangeEvent<HTMLInputElement>):void => {
    setRole(event.target.value);
  }
  const handlePassword = (event: ChangeEvent<HTMLInputElement>):void => {
    setPassword(event.target.value);
  }

  const handleSwitch = (event: any):void => {
    
    setStatus(!status);
    
  }

  return (
    <>
        <DialogContent>
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
                    m: -1.5,
                    p: 3
                    }}
                >
                    <Typography 
                    sx={{
                        textAlign: 'center', 
                        width:'100%',
                        mb:4
                        }} 
                    variant='h4'
                    >
                    New User
                    </Typography>
                    <UploadAvatar photoURL={'/static/mock-images/user.png'} callback={handleDrop}/>
                    
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
                        defaultChecked
                        color="success"
                        onChange={handleSwitch}
                    />
                    </Box>
                </Box>
                    
                </Grid>
                <Grid item xs={7} md={7} sm={12}>
                <Typography 
                    sx={{
                    width:'100%',
                    mb:3,
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
                    display:'flex',
                    flexWrap:'wrap',
                    alignItems:'center',
                    justifyContent:'space-between'
                    }}
                >
                    <Grid item xs={3} md={3} sm={12}>
                    <p style={{fontSize: 13}}>Name</p>
                    </Grid>
                    <Grid item xs={7} md={7} sm={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        onChange={handleName}
                        value={name}
                    />
                    </Grid>
                </Grid>
                <Grid 
                    container
                    sx={{
                    pr:3,
                    pl:2,
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
                        margin="dense"
                        id="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        onChange={handleLastName}
                        value={lastName}
                    />
                    </Grid>
                </Grid>
                <Grid 
                    container
                    sx={{
                    pr:3,
                    pl:2,
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
                        margin="dense"
                        select
                        id="roldId"
                        label="Role"
                        type="text"
                        fullWidth
                        onChange={handleRole}
                        value={role}
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
                        margin="dense"
                        id="phone"
                        label="Phone"
                        type="text"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        fullWidth
                        onChange={handlePhone}
                        value={phone}
                    />
                    </Grid>
                </Grid>
                <Grid 
                    container
                    sx={{
                    pr:3,
                    pl:2,
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
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        onChange = {handleEmail}
                        value={email}
                    />
                    </Grid>
                </Grid>
                <Grid 
                    container
                    sx={{
                    pr:3,
                    pl:2,
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
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        onChange={handlePassword}
                        value={password}
                    />
                    </Grid>
                </Grid>
                
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions 
            sx={{
              display:'flex',
              justifyContent:'center',
              mb:2  
            }}>
            <Button onClick={handleCancel} color="primary" variant='outlined' sx={{mr: 10}}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant='contained'>
              Create
            </Button>
        </DialogActions>
    </>
  );
};

