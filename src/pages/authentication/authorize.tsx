// This page is only for Auth0. If you use some other Auth Provider, you can (should) delete this.
// The role of this page is to handle the "authorize" callback.

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';

const Authorize = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { handleRedirectCallback } = useAuth();

  useEffect(() => {
    const query = window.location.search;

    if (query.includes('code=') && query.includes('state=')) {
      handleRedirectCallback()
        .then((appState?: { returnUrl?: string }) => {
          if (isMounted()) {
            const returnUrl = appState?.returnUrl || '/dashboard';
            router.push(returnUrl).catch(console.error);
          }
        })
        .catch((err: any) => {
          console.error(err);

          if (isMounted()) {
            router.push('/authentication/login').catch(console.error);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Authorize;
