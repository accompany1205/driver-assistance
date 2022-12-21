import type { ChangeEvent, MouseEvent } from 'react';
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
import { customerApi } from '../../../__fake-api__/customer-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { UserListTable } from '../../../components/dashboard/team/user-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Download as DownloadIcon } from '../../../icons/download';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { Upload as UploadIcon } from '../../../icons/upload';
import { gtm } from '../../../lib/gtm';
import type { User } from '../../../types/user';

import { addUser, getUsers } from 'src/slices/user';

import { UserEdit} from './component/edit';
import { UserView } from './component/view';
import { UserAdd } from './component/add';
import  {UploadAvatar}  from '../../../components/upload';
import axios from '../../../utils/axios';
import { CONSTANTS } from '../../../utils/constants';


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


const UserList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  //const [users, setUsers] = useState<User[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);

  const [user, setUser] = useState<User|undefined>();

  const [file, setFile] = useState<File>();

  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<string>("");

  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('3');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);

  

  const dispatch = useDispatch();

  const {users, totalCount} = useSelector((state:any)=> state.user)
  
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(
   () => {
      initial();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTab,sort, filters, page, rowsPerPage]
  );
  useEffect(
    () => {
      initial();
    },
    []
  )
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

  const rowCallback = (rowId:string, info: string): void=> {
    if(rowId){
      const selected_user = users.filter((item:any)=> item.id === rowId)[0];
      setUser(selected_user);
      if(info === 'edit')
        setEditOpen(true);
      return;   
    }
    setViewOpen(true); 
  }
  const initial = async() =>{
    await dispatch(getUsers(currentTab,sort,filters,{page:page,rows:rowsPerPage}));
      
  }

  const handleModalStatus = (event: MouseEvent<{}>): void => {
    setOpen(!open);
  }
  const handleSubmit = async (event: MouseEvent<{}>): Promise<any> => {
    handleModalStatus(event);
    setStatus(false);
    //
    const id = await dispatch(addUser(name, lastName, role, phone, email, password, status, avatarFile?.file?.name));
    const formData = new FormData();
    if(!id)  return;
    if(id && avatarFile && avatarFile.file){
      
      formData.append('file', avatarFile?.file);
      axios.post('/api/user/uploadAvatar',
        formData,{
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'x-id': id },
        }).then((res)=>{
          
        })
    }

  }

  const handleEditModalStatus = (event: MouseEvent<{}>): void => {
    setEditOpen(!editOpen);
  }
  const handleViewModalStatus = (event: MouseEvent<{}>): void => {
    setViewOpen(!viewOpen);
  }
  const handleEditSubmit = (event: MouseEvent<{}>): void => {
    handleModalStatus(event);
    setEditOpen(false);
    
  }
  // const handleFileChange = (event: ChangeEvent<{}>, value: File): void => {
  //   if(value)
  //     setFile(value);
  //   else
      
  // }

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

  const handleTabsChange = (event: ChangeEvent<{}>, value: TabValue): void => {
    
    setCurrentTab(value);
  };

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters(queryRef.current?queryRef.current.value:"");
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const profileEditCallback = (viewUser: User):void => {
    setUser(viewUser);
    setViewOpen(false);
    setEditOpen(true);
  }

  const editCallback = (description: string): void => {
    setEditOpen(false);
    if(description === 'update')
      setViewOpen(true);
    
  }

  const addCallback = (): void => {
    setOpen(false);
  }



  
  return (
    <>
      <Head>
        <title>
          Dashboard: User List | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Team
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                  onClick={handleModalStatus}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            
          </Box>
          <Card>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ px: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                m: -1.5,
                p: 3
              }}
            >
              <Box
                component="form"
                onSubmit={handleQueryChange}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search users"
                />
              </Box>
              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            {
              users && users.length>0 &&
              <UserListTable
                users={users}
                usersCount={totalCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={rowsPerPage}
                rowcallback={rowCallback}
                page={page}
              />
            }
          </Card>
        </Container>
        <Dialog 
          open={open} 
          fullWidth={true}
          maxWidth="md"
          onClose={handleModalStatus} 
          aria-labelledby="form-dialog-title"
        >
          <UserAdd callback={addCallback}/>
        </Dialog>
        <Dialog 
          open={editOpen} 
          fullWidth={true}
          maxWidth="md"
          onClose={handleEditModalStatus} 
          aria-labelledby="form-dialog-title"
        >
          <UserEdit user={user} callback={editCallback}/>
        </Dialog>
        <Dialog 
          open={viewOpen} 
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewModalStatus} 
          aria-labelledby="form-dialog-title"
          sx={{}}
        >
          <DialogContent sx={{backgroundColor: "#F9FAFC !important", p:6}}>
            <UserView editCallback={profileEditCallback}/>
          </DialogContent>
          <DialogActions sx={{backgroundColor: "#F9FAFC !important", mt:-5, pb:5, display:'flex', justifyContent:'center'}}>
            <Stack direction='row' justifyContent="center">
              <Button onClick={handleViewModalStatus} color="primary" variant='outlined'>
                Close
              </Button>
            </Stack>
            
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

UserList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default UserList;
