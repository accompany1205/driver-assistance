import type { FC } from 'react';
import { AuthGuard } from '../components/authentication/auth-guard';

/**
 * @deprecated Use the layout strategy
 * @param Component
 */
export const withAuthGuard = (Component: FC) => (props: any) => (
  <AuthGuard>
    <Component {...props} />
  </AuthGuard>
);
