import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import type { Theme } from '@mui/material';
import { Box, Button, Checkbox, IconButton, Input, OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { Trash as TrashIcon } from '../../../icons/trash';
import { useDispatch } from '../../../store';
import { deleteCheckItem, updateCheckItem } from '../../../thunks/kanban';
import type { CheckItem } from '../../../types/kanban';

interface KanbanCheckItemProps {
  cardId: string;
  checkItem: CheckItem;
  checklistId: string;
  editing?: boolean;
  onEditCancel?: () => void;
  onEditComplete?: () => void;
  onEditInit?: () => void;
  sx?: SxProps<Theme>;
}

const KanbanCheckItemRoot = styled('div')(
  ({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1)
  })
);

export const KanbanCheckItem: FC<KanbanCheckItemProps> = (props) => {
  const {
    cardId,
    checkItem,
    checklistId,
    editing,
    onEditCancel,
    onEditComplete,
    onEditInit,
    ...other
  } = props;
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(checkItem.name);

  const handleStateChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const state = event.target.checked ? 'complete' : 'incomplete';

      await dispatch(updateCheckItem({
        cardId,
        checklistId,
        checkItemId: checkItem.id,
        update: { state }
      }));
      toast.success('Check item updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      await dispatch(updateCheckItem({
        cardId,
        checklistId,
        checkItemId: checkItem.id,
        update: { name }
      }));
      toast.success('Check item updated!');
      onEditComplete?.();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleCancel = (): void => {
    setName(checkItem.name);
    onEditCancel?.();
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteCheckItem({
        cardId,
        checklistId,
        checkItemId: checkItem.id
      }));
      toast.success('Check item deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <KanbanCheckItemRoot {...other}>
      <Checkbox
        edge="start"
        checked={checkItem.state === 'complete'}
        onChange={handleStateChange}
        sx={{ mr: 1 }}
      />
      {
        editing
          ? (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                width: '100%'
              }}
            >
              <OutlinedInput
                onChange={handleNameChange}
                value={name}
                sx={{
                  flexGrow: 1,
                  my: '1px',
                  '& .MuiInputBase-input': {
                    px: 2,
                    py: 1
                  }
                }}
              />
              <Button
                onClick={handleSave}
                size="small"
                sx={{ ml: 2 }}
                variant="contained"
              >
                Update
              </Button>
              <Button
                onClick={handleCancel}
                size="small"
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          )
          : (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1
              }}
            >
              <Input
                disableUnderline
                fullWidth
                onClick={onEditInit}
                value={checkItem.name}
                sx={{
                  borderColor: 'transparent',
                  borderRadius: 1,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  cursor: 'text',
                  m: '-1px',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  },
                  '& .MuiInputBase-input': {
                    fontWeight: 500,
                    px: 2,
                    py: 1
                  }
                }}
              />
              <IconButton
                onClick={handleDelete}
                sx={{ ml: 2 }}
                size="small"
              >
                <TrashIcon fontSize="small" />
              </IconButton>
            </Box>
          )
      }
    </KanbanCheckItemRoot>
  );
};

KanbanCheckItem.propTypes = {
  cardId: PropTypes.string.isRequired,
  // @ts-ignore
  checkItem: PropTypes.object.isRequired,
  checklistId: PropTypes.string.isRequired,
  editing: PropTypes.bool,
  onEditCancel: PropTypes.func,
  onEditComplete: PropTypes.func,
  onEditInit: PropTypes.func,
  sx: PropTypes.object
};

KanbanCheckItem.defaultProps = {
  editing: false
};
