import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import type { Message, Participant } from '../../../types/chat';
import { ChatMessage } from './chat-message';

interface ChatMessagesProps {
  messages: Message[];
  participants: Participant[];
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
  const { messages, participants, ...other } = props;
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    name: 'Anika Visser'
  };

  return (
    <Box
      sx={{ p: 2 }}
      {...other}
    >
      {messages.map((message) => {
        const participant = participants.find(
          (_participant) => _participant.id === message.authorId
        );
        let authorAvatar: string | null;
        let authorName: string;
        let authorType: 'user' | 'contact';

        // Since chat mock db is not synced with external auth providers
        // we set the user details from user auth state instead of thread participants
        if (message.authorId === '5e86809283e28b96d2d38537') {
          authorAvatar = user.avatar;
          authorName = 'Me';
          authorType = 'user';
        } else {
          authorAvatar = participant!.avatar;
          authorName = participant!.name;
          authorType = 'contact';
        }

        return (
          <ChatMessage
            authorAvatar={authorAvatar}
            authorName={authorName}
            authorType={authorType}
            body={message.body}
            contentType={message.contentType}
            createdAt={message.createdAt}
            key={message.id}
          />
        );
      })}
    </Box>
  );
};

ChatMessages.propTypes = {
  // @ts-ignore
  messages: PropTypes.array,
  // @ts-ignore
  participants: PropTypes.array
};
