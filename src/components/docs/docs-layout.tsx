import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { DocsNavbar } from './docs-navbar';
import { DocsSidebar } from './docs-sidebar';

interface DocsLayoutProps {
  children: ReactNode;
}

const DocsLayoutRoot = styled('div')(
  ({ theme }) => ({
    minHeight: 'calc(100vh - 64px)',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      marginLeft: 256
    }
  })
);

export const DocsLayout: FC<DocsLayoutProps> = (props) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <DocsLayoutRoot>
      <DocsNavbar onOpenSidebar={(): void => setIsSidebarOpen(true)} />
      <DocsSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      {children}
    </DocsLayoutRoot>
  );
};
