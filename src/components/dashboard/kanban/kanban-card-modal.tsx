import type { ChangeEvent, FC } from 'react';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
// @ts-ignore
import debounce from 'lodash.debounce';
import {
  Box,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { Archive as ArchiveIcon } from '../../../icons/archive';
import { Check as CheckIcon } from '../../../icons/check';
import { DocumentText as DocumentTextIcon } from '../../../icons/document-text';
import { Eye as EyeIcon } from '../../../icons/eye';
import { EyeOff as EyeOffIcon } from '../../../icons/eye-off';
import { Users as UsersIcon } from '../../../icons/users';
import { useDispatch, useSelector } from '../../../store';
import { addChecklist, deleteCard, moveCard, updateCard } from '../../../thunks/kanban';
import type { Card, Column } from '../../../types/kanban';
import { KanbanCardAction } from './kanban-card-action';
import { KanbanChecklist } from './kanban-checklist';

interface KanbanCardModalProps {
  card: Card;
  column: Column;
  onClose?: () => void;
  open: boolean;
}

const labels = [
  'Business',
  'Planning',
  'Frontend',
  'Design'
];

export const KanbanCardModal: FC<KanbanCardModalProps> = (props) => {
  const { card, column, onClose, open, ...other } = props;
  const dispatch = useDispatch();
  const { columns } = useSelector((state) => state.kanban);

  const handleDetailsUpdate = debounce(async (update: { name?: string; description?: string; }) => {
    try {
      await dispatch(updateCard({
        cardId: card.id,
        update
      }));
      toast.success('Card updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, 1000);

  const handleColumnChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      await dispatch(moveCard({
        cardId: card.id,
        position: 0,
        columnId: event.target.value
      }));
      toast.success('Card moved!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleSubscribe = async (): Promise<void> => {
    try {
      await dispatch(updateCard({
        cardId: card.id,
        update: { isSubscribed: true }
      }));
      toast.success('Unsubscribed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleUnsubscribe = async (): Promise<void> => {
    try {
      await dispatch(updateCard({
        cardId: card.id,
        update: { isSubscribed: false }
      }));
      toast.success('Subscribed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteCard({
        cardId: card.id
      }));
      toast.success('Card archived!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleAddChecklist = async (): Promise<void> => {
    try {
      await dispatch(addChecklist({
        cardId: card.id,
        name: 'Untitled Checklist'
      }));
      toast.success('Checklist added!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleLabelsChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      let newValue = [...card.labels];

      if (event.target.checked) {
        newValue.push(event.target.value);
      } else {
        newValue = newValue.filter((item) => item !== event.target.value);
      }

      await dispatch(updateCard({
        cardId: card.id,
        update: { labels: newValue }
      }));
      toast.success('Card updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Grid container>
        <Grid
          item
          sm={8}
          xs={12}
        >
          <Box
            sx={{
              py: 4,
              px: 3
            }}
          >
            <TextField
              defaultValue={card.name}
              fullWidth
              label="Task name"
              onChange={(event): Promise<void> => handleDetailsUpdate({ name: event.target.value })}
            />
            <TextField
              defaultValue={card.description}
              fullWidth
              label="Description"
              multiline
              onChange={(event): Promise<void> => handleDetailsUpdate({ description: event.target.value })}
              placeholder="Leave a message"
              rows={6}
              sx={{ mt: 3 }}
            />
            {card.checklists.length > 0 && (
              <>
                <Typography
                  sx={{ my: 3 }}
                  variant="h6"
                >
                  Checklist
                </Typography>
                <div>
                  {card.checklists.map((checklist) => (
                    <KanbanChecklist
                      card={card}
                      checklist={checklist}
                      key={checklist.id}
                      sx={{ mb: 3 }}
                    />
                  ))}
                </div>
              </>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
        >
          <Box
            sx={{
              backgroundColor: 'background.default',
              px: 3,
              py: 4,
              height: '100%'
            }}
          >
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Status
            </Typography>
            <TextField
              fullWidth
              placeholder="Status"
              onChange={handleColumnChange}
              select
              SelectProps={{
                native: true
              }}
              sx={{ mt: 2 }}
              value={card.columnId}
            >
              {Object.values(columns.byId).map((_column) => (
                <option
                  key={_column.id}
                  value={_column.id}
                >
                  {_column.name}
                </option>
              ))}
            </TextField>
            <Box sx={{ mt: 2 }}>
              <Typography
                color="textSecondary"
                variant="overline"
              >
                Add
              </Typography>
              <Box sx={{ mt: 2 }}>
                <KanbanCardAction
                  icon={<CheckIcon fontSize="small" />}
                  onClick={handleAddChecklist}
                >
                  Checklist
                </KanbanCardAction>
                <KanbanCardAction
                  disabled
                  icon={<UsersIcon fontSize="small" />}
                >
                  Members
                </KanbanCardAction>
                <KanbanCardAction
                  disabled
                  icon={<DocumentTextIcon fontSize="small" />}
                >
                  Attachments
                </KanbanCardAction>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                component="h4"
                sx={{
                  fontWeight: 600,
                  mb: 2
                }}
                variant="overline"
              >
                Actions
              </Typography>
              {
                card.isSubscribed
                  ? (
                    <KanbanCardAction
                      icon={<EyeOffIcon fontSize="small" />}
                      onClick={handleUnsubscribe}
                    >
                      Unwatch
                    </KanbanCardAction>
                  )
                  : (
                    <KanbanCardAction
                      icon={<EyeIcon fontSize="small" />}
                      onClick={handleSubscribe}
                    >
                      Watch
                    </KanbanCardAction>
                  )
              }
              <KanbanCardAction
                icon={<ArchiveIcon fontSize="small" />}
                onClick={handleDelete}
              >
                Archive
              </KanbanCardAction>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                color="textSecondary"
                component="h4"
                sx={{ mb: 2 }}
                variant="overline"
              >
                Labels
              </Typography>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <FormGroup>
                  {labels.map((label, index) => (
                    <Fragment key={label}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={card.labels.includes(label)}
                            onChange={handleLabelsChange}
                          />
                        )}
                        label={(
                          <Typography variant="body2">
                            {label}
                          </Typography>
                        )}
                        sx={{
                          pl: 2,
                          pr: 1,
                          py: 0.5
                        }}
                        value={label}
                      />
                      {index !== labels.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </FormGroup>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

KanbanCardModal.propTypes = {
  // @ts-ignore
  card: PropTypes.object.isRequired,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

KanbanCardModal.defaultProps = {
  open: false
};
