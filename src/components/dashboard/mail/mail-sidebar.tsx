import type { FC, MutableRefObject } from 'react';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import type { Theme } from '@mui/material';
import { Box, Button, Drawer, List, ListSubheader, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import type { Label, LabelType } from '../../../types/mail';
import { MailLabel } from './mail-label';

interface MailSidebarProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  label?: string;
  labels: Label[];
  open?: boolean;
  onClose?: () => void;
  onCompose?: () => void;
}

const MailSidebarDesktop = styled(Drawer)({
  flexShrink: 0,
  width: 280,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 280
  }
});

const MailSidebarMobile = styled(Drawer)({
  width: 280,
  '& .MuiDrawer-paper': {
    top: 64,
    height: 'calc(100% - 64px)',
    width: 280
  }
});

type GroupedLabels = {
  [key in LabelType]: Label[];
};

const groupLabels = (labels: Label[]): GroupedLabels => {
  const groups: GroupedLabels = {
    system: [],
    custom: []
  };

  labels.forEach((label) => {
    if (label.type === 'system') {
      groups.system.push(label);
    } else {
      groups.custom.push(label);
    }
  });

  return groups;
};

export const MailSidebar: FC<MailSidebarProps> = (props) => {
  const { containerRef, label: currentLabel, labels, open, onCompose, onClose, ...other } = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const handleLabelClick = () => {
    if (!mdUp) {
      onClose?.();
    }
  };

  const groupedLabels: GroupedLabels = groupLabels(labels);

  const content = (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">
          Mailbox
        </Typography>
        <Button
          fullWidth
          onClick={onCompose}
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Compose
        </Button>
      </Box>
      <Box
        sx={{
          pb: 2,
          px: 2
        }}
      >
        {(Object.keys(groupedLabels) as LabelType[]).map((type) => (
          <Fragment key={type}>
            {type === 'custom' && (
              <ListSubheader disableSticky={true}>
                <Typography
                  color="textSecondary"
                  variant="overline"
                >
                  Labels
                </Typography>
              </ListSubheader>
            )}
            <List disablePadding>
              {groupedLabels[type].map((label) => (
                <MailLabel
                  active={(currentLabel === label.id) || (!currentLabel && label.id === 'inbox')}
                  key={label.id}
                  label={label}
                  onClick={handleLabelClick}
                />
              ))}
            </List>
          </Fragment>
        ))}
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <MailSidebarDesktop
        anchor="left"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </MailSidebarDesktop>
    );
  }

  return (
    <MailSidebarMobile
      anchor="left"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </MailSidebarMobile>
  );
};

MailSidebar.propTypes = {
  containerRef: PropTypes.any,
  label: PropTypes.string,
  labels: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onCompose: PropTypes.func,
  open: PropTypes.bool
};
