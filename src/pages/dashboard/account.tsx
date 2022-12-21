import React from 'react';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { AccountBillingSettings } from '../../components/dashboard/account/account-billing-settings';
import { AccountGeneralSettings } from '../../components/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from '../../components/dashboard/account/account-notifications-settings';
import { AccountTeamSettings } from '../../components/dashboard/account/account-team-settings';
import { AccountSecuritySettings } from '../../components/dashboard/account/account-security-settings';
import { gtm } from '../../lib/gtm';
import { AuthContextValue } from 'src/contexts/firebase-auth-context';
import { AuthContext } from 'src/contexts/jwt-context';

const tabs = [
  { label: 'General', value: 'general' },
];

export const Account: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<string>('general');

  const { user } = React.useContext(AuthContext);
  // const {user} = React.useSel

  React.useEffect(() => {
    if(user) {
      
    }
  }, [user])

  

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4">
            Account
          </Typography>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabsChange}
            scrollButtons="auto"
            textColor="primary"
            value={currentTab}
            variant="scrollable"
            sx={{ mt: 3 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          {currentTab === 'general' && <AccountGeneralSettings user={user} />}
          {/* {currentTab === 'billing' && <AccountBillingSettings />}
          {currentTab === 'team' && <AccountTeamSettings />}
          {currentTab === 'notifications' && <AccountNotificationsSettings />}
          {currentTab === 'security' && <AccountSecuritySettings />} */}
        </Container>
      </Box>
    </>
  );
};


