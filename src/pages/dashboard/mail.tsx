import { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { MailComposer } from '../../components/dashboard/mail/mail-composer';
import { MailDetails } from '../../components/dashboard/mail/mail-details';
import { MailList } from '../../components/dashboard/mail/mail-list';
import { MailSidebar } from '../../components/dashboard/mail/mail-sidebar';
import { gtm } from '../../lib/gtm';
import { useDispatch, useSelector } from '../../store';
import {
  closeComposer,
  closeSidebar,
  getLabels,
  openComposer,
  openSidebar
} from '../../thunks/mail';

const MailInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      marginLeft: -280
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('md')]: {
        marginLeft: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const Mail: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { labels, isComposeOpen, isSidebarOpen } = useSelector((state) => state.mail);
  const mdUp = useMediaQuery(
    (theme: Theme) => theme.breakpoints.up('md'),
    { noSsr: true }
  );
  const emailId = router.query.emailId as string | undefined;
  const label = router.query.label as string | undefined;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(
    () => {
      dispatch(getLabels());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      if (!mdUp) {
        dispatch(closeSidebar());
      } else {
        dispatch(openSidebar());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mdUp]
  );

  const handleToggleSidebar = (): void => {
    if (isSidebarOpen) {
      dispatch(closeSidebar());
    } else {
      dispatch(openSidebar());
    }
  };

  const handleCloseSidebar = () => {
    dispatch(closeSidebar());
  };

  const handleComposeClick = (): void => {
    if (!mdUp) {
      dispatch(closeSidebar());
    }

    dispatch(openComposer());
  };

  const handleComposerClose = (): void => {
    dispatch(closeComposer());
  };

  return (
    <>
      <Head>
        <title>
          Dashboard: Mail | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <MailSidebar
            containerRef={rootRef}
            label={label}
            labels={labels}
            onClose={handleCloseSidebar}
            onCompose={handleComposeClick}
            open={isSidebarOpen}
          />
          <MailInner open={isSidebarOpen}>
            {
              emailId
                ? (
                  <MailDetails
                    label={label}
                    emailId={emailId}
                  />
                )
                : (
                  <MailList
                    onToggleSidebar={handleToggleSidebar}
                    label={label}
                  />
                )
            }
          </MailInner>
        </Box>
      </Box>
      <MailComposer
        open={isComposeOpen}
        onClose={handleComposerClose}
      />
    </>
  );
};

Mail.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Mail;
