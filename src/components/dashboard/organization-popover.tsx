import type { FC } from 'react';
import { MenuItem, Popover } from '@mui/material';

interface OrganizationPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

const organizations = [
  'GT Inc',
  'GTX Inc'
];

export const OrganizationPopover: FC<OrganizationPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;

  const handleChange = (organization: string): void => {
    onClose?.();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 248 } }}
      transitionDuration={0}
      {...other}
    >
      {organizations.map((organization) => (
        <MenuItem
          key={organization}
          onClick={() => handleChange(organization)}
        >
          {organization}
        </MenuItem>
      ))}
    </Popover>
  );
};
