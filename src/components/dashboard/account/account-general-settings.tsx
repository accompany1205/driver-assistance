import type { FC } from 'react';
import React from 'react';
import { ChangeEvent, MouseEvent, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
  MenuItem
} from '@mui/material';
import { UserCircle as UserCircleIcon } from '../../../icons/user-circle';
import { User } from 'src/types/user';
import slice, { updateUser } from "src/slices/user";
import { CONSTANTS } from 'src/utils/constants';
import { AuthContext, AuthContextValue } from 'src/contexts/jwt-context';

interface AccountType{
  user:User|null;
}
export const AccountGeneralSettings: FC<AccountType> = (props) => {
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const {user} = props;

  const [name, setName] = useState<string>(user?.firstname||'');
  const [lastName, setLastName] = useState<string>(user?.lastname||'');
  const [email, setEmail] = useState<string>(user?.email||'');
  const [role, setRole] = useState<string>(user?.roleId+''||'3');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>(user?.phone||'');
  const [status, setStatus] = useState<boolean>(user?.status === 'active'? true : false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const fileButtonRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgSrc, setImgSrc] = useState<string>(CONSTANTS.serverURL+'/'+user?.photoURL);
  const [file, setFile] = useState('')


  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      //setCrop(undefined) // Makes crop preview update between images.
      //callback(e.target.files[0]);
      setFile(e.target.files[0]);
      
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const dispatch = useDispatch();

  useEffect(()=>{

  },[]);

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

  const handleEditPassword = (event:any): void => {
    setIsDisabled(false);
  }

  const handleSaveAccount = async (event:any): void => {
    const photoURL = await dispatch(updateUser(user.id,name, lastName, phone, email, password, status?'active':'inActive',role, file))

    dispatch(slice.actions.handleADopen(false));
  } 

  const handleChangeBtn = (event: any):void =>{
    fileButtonRef.current?.click();
  }
  return (
    <Box
      sx={{ mt: 4 }}
      {...props}
    >
      <input ref={fileButtonRef} type='file' onChange={onSelectFile} style={{display:'none'}}/>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Basic details
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mb:4,
                  pl:2
                }}
              >
                <Avatar
                  src={imgSrc}
                  ref={imgRef}
                  sx={{
                    height: 64,
                    mr: 2,
                    width: 64
                  }}
                >
                  <UserCircleIcon fontSize="small" />
                </Avatar>
                <Button onClick={handleChangeBtn}>
                  Change
                </Button>
              </Box>
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
                  
                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      autoFocus
                      defaultValue={name}
                      margin="dense"
                      id="firstname"
                      label="First Name"
                      type="text"
                      fullWidth
                      onChange={handleName}
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
                  
                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      
                      value={lastName}
                      margin="dense"
                      id="lastName"
                      label="Last Name"
                      type="text"
                      fullWidth
                      onChange={handleLastName}
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
                  
                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      margin="dense"
                      value={role}
                      select
                      id="roldId"
                      label="Role"
                      type="text"
                      fullWidth
                      onChange={handleRole}
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
                  
                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      value={phone}
                      margin="dense"
                      id="phone"
                      label="Phone"
                      type="text"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      fullWidth
                      onChange={handlePhone}
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
                  
                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      value={email}
                      margin="dense"
                      id="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      onChange = {handleEmail}
                    />
                  </Grid>
                </Grid>
                <Switch
                  defaultChecked={user?.status === 'active' ? true : false}
                  color="success"
                  onChange={handleSwitch}
                  sx={{mt:3,ml:2}}
                />
                
            </Grid>
            
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Change password
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              sm={12}
              xs={12}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pl:2
                }}
              >
                <TextField
                  label="Password"
                  type="password"
                  defaultValue=""
                  size="small"
                  disabled={isDisabled}
                  onChange={handlePassword}
                  sx={{mr:5}}
                />
                <Button variant='outlined' onClick={handleEditPassword} sx={{mr:5}}>
                  Edit
                </Button>
                <Button variant='contained' color="primary" onClick={handleSaveAccount}>
                  save
                </Button>
              </Box>
              
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
    </Box>
  );
};
