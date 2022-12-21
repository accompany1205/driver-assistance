import type { FC } from 'react';
import { GuestGuard } from '../components/authentication/guest-guard';

/**
 * @deprecated Use the layout strategy
 * @param Component
 */
export const withGuestGuard = (Component: FC) => (props: any) => (
  <GuestGuard>
    <Component {...props} />
  </GuestGuard>
);
