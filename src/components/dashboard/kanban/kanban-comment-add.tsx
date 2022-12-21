import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Avatar, Box, TextField } from '@mui/material';
import { useDispatch } from '../../../store';
import { addComment } from '../../../thunks/kanban';

interface KanbanCommentAddProps {
  cardId: string;
}

export const KanbanCommentAdd: FC<KanbanCommentAddProps> = (props) => {
  const { cardId, ...other } = props;
  const dispatch = useDispatch();
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png'
  };
  const [message, setMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleKeyUp = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    try {
      if (event.code === 'Enter' && message) {
        await dispatch(addComment({
          cardId,
          message
        }));
        setMessage('');
        toast.success('Comment added!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex'
      }}
      {...other}
    >
      <Avatar
        src={user.avatar}
        sx={{ mr: 2 }}
      />
      <TextField
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Write a comment..."
        size="small"
        value={message}
      />
    </Box>
  );
};

KanbanCommentAdd.propTypes = {
  cardId: PropTypes.string.isRequired
};
