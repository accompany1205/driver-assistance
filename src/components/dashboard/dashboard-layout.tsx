import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { Box, Dialog } from '@mui/material';
import { Account } from "src/pages/dashboard/account";
import { useDispatch, useSelector } from 'react-redux';
import slice from 'src/slices/user';


interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayoutRoot = styled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 280
    }
  })
);

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const {isAccountDialogOpen} = useSelector((state:any)=>state.user);

  const dispatch = useDispatch();

  const handleIsAccountOpen = (event: any) => {
    dispatch(slice.actions.handleADopen(false));
  }
  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onOpenSidebar={(): void => setIsSidebarOpen(true)} />
      <DashboardSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      <Dialog 
          open={isAccountDialogOpen} 
          fullWidth={true}
          maxWidth="md"
          onClose={handleIsAccountOpen} 
          aria-labelledby="form-dialog-title"
        >
          <Account/>
        </Dialog>
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node
};
