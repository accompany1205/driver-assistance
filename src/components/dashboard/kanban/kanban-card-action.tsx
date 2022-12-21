import type { FC, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';

interface KanbanCardActionProps extends ButtonProps {
  icon?: ReactElement;
  children?: ReactNode;
}

export const KanbanCardAction: FC<KanbanCardActionProps> = (props) => {
  const { icon, children, ...other } = props;

  return (
    <Button
      fullWidth
      startIcon={icon}
      sx={{
        justifyContent: 'flex-start',
        '& + &': {
          mt: 2
        }
      }}
      variant="contained"
      {...other}
    >
      {children}
    </Button>
  );
};

KanbanCardAction.propTypes = {
  icon: PropTypes.element,
  children: PropTypes.node
};
