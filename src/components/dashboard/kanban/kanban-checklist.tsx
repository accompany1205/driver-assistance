import type { ChangeEvent, FC } from 'react';
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import type { Theme } from '@mui/material';
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  IconButton,
  Input,
  LinearProgress,
  OutlinedInput,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { useDispatch } from '../../../store';
import { deleteChecklist, updateChecklist } from '../../../thunks/kanban';
import type { Card as CardType, Checklist } from '../../../types/kanban';
import { KanbanCheckItem } from './kanban-check-item';
import { KanbanCheckItemAdd } from './kanban-check-item-add';
import { Trash as TrashIcon } from '../../../icons/trash';

interface KanbanChecklistProps {
  card: CardType;
  checklist: Checklist;
  sx?: SxProps<Theme>;
}

const KanbanChecklistRoot = styled('div')``;

export const KanbanChecklist: FC<KanbanChecklistProps> = (props) => {
  const { card, checklist, ...other } = props;
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(checklist.name);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingCheckItem, setEditingCheckItem] = useState<string | null>(null);

  const handleNameEdit = (): void => {
    setEditingName(true);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleNameSave = async (): Promise<void> => {
    try {
      if (!name || name === checklist.name) {
        setEditingName(false);
        setName(checklist.name);
        return;
      }

      setEditingName(false);
      await dispatch(updateChecklist({
        cardId: card.id,
        checklistId: checklist.id,
        update: { name }
      }));
      toast.success('Checklist updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleCancel = (): void => {
    setEditingName(false);
    setName(checklist.name);
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteChecklist({
        cardId: card.id,
        checklistId: checklist.id
      }));
      toast.success('Checklist deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleCheckItemEditInit = (checkItemId: string): void => {
    setEditingCheckItem(checkItemId);
  };

  const handleCheckItemEditCancel = (): void => {
    setEditingCheckItem(null);
  };

  const handleCheckItemEditComplete = (): void => {
    setEditingCheckItem(null);
  };

  const totalCheckItems = checklist.checkItems.length;
  const completedCheckItems = (
    checklist
      .checkItems
      .filter((checkItem) => checkItem.state === 'complete')
  ).length;
  const completePercentage = totalCheckItems === 0
    ? 100
    : (completedCheckItems / totalCheckItems) * 100;

  return (
    <KanbanChecklistRoot {...other}>
      <Card variant="outlined">
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            {
              editingName
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
                        '& .MuiInputBase-input': {
                          px: 2,
                          py: 1
                        }
                      }}
                    />
                    <Button
                      onClick={handleNameSave}
                      size="small"
                      sx={{ ml: 2 }}
                      variant="contained"
                    >
                      Save
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
                      onClick={handleNameEdit}
                      value={checklist.name}
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
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 3
            }}
          >
            <Typography
              color="textSecondary"
              variant="caption"
            >
              {Math.round(completePercentage)}
              %
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                ml: 2
              }}
            >
              <LinearProgress
                color="primary"
                sx={{
                  borderRadius: 1,
                  height: 8,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 'inherit'
                  }
                }}
                value={completePercentage}
                variant="determinate"
              />
            </Box>
          </Box>
        </Box>
        <Divider />
        {checklist.checkItems.map((checkItem) => (
          <Fragment key={checkItem.id}>
            <KanbanCheckItem
              cardId={card.id}
              checkItem={checkItem}
              checklistId={checklist.id}
              editing={editingCheckItem === checkItem.id}
              onEditCancel={handleCheckItemEditCancel}
              onEditComplete={handleCheckItemEditComplete}
              onEditInit={(): void => handleCheckItemEditInit(checkItem.id)}
            />
            <Divider />
          </Fragment>
        ))}
        <CardActions>
          <KanbanCheckItemAdd
            cardId={card.id}
            checklistId={checklist.id}
          />
        </CardActions>
      </Card>
    </KanbanChecklistRoot>
  );
};

KanbanChecklist.propTypes = {
  // @ts-ignore
  card: PropTypes.object.isRequired,
  // @ts-ignore
  checklist: PropTypes.object.isRequired,
  sx: PropTypes.object
};
