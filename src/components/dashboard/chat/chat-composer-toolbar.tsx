import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  TextField,
  Typography
} from '@mui/material';
import { chatApi } from '../../../__fake-api__/chat-api';
import { Search as SearchIcon } from '../../../icons/search';
import type { Contact } from '../../../types/chat';
import { Scrollbar } from '../../scrollbar';

interface ChatThreadComposerProps {
  onAddRecipient?: (contact: Contact) => void;
  onRemoveRecipient?: (recipientId: string) => void;
  recipients: Contact[];
}

const filterSearchResults = (
  searchResults: Contact[],
  recipients: Contact[]
): Contact[] => {
  const recipientIds = recipients.reduce((acc: string[], recipient) => [
    ...acc,
    recipient.id
  ], []);

  return searchResults.filter((result) => !recipientIds.includes(result.id));
};

export const ChatComposerToolbar: FC<ChatThreadComposerProps> = (props) => {
  const { onAddRecipient, onRemoveRecipient, recipients, ...other } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  const displaySearchResults = query && isSearchFocused;
  const filteredSearchResults = filterSearchResults(searchResults, recipients);

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const { value } = event.target;

      setQuery(value);

      if (value) {
        const data = await chatApi.getContacts({ query: value });

        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchBlur = (): void => {
    if (!displaySearchResults) {
      setIsSearchFocused(false);
    }
  };

  const handleSearchFocus = (): void => {
    setIsSearchFocused(true);
  };

  const handleSearchResultsClickAway = (): void => {
    setIsSearchFocused(false);
  };

  const handleAddRecipient = (contact: Contact): void => {
    setQuery('');

    if (onAddRecipient) {
      onAddRecipient(contact);
    }
  };

  const handleRemoveRecipient = (recipientId: string): void => {
    if (onRemoveRecipient) {
      onRemoveRecipient(recipientId);
    }
  };

  return (
    <>
      <Box
        sx={{
          borderBottomColor: 'divider',
          borderBottomStyle: 'solid',
          borderBottomWidth: 1
        }}
        {...other}
      >
        <Scrollbar>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              p: 2
            }}
          >
            <Box
              ref={containerRef}
              sx={{
                alignItems: 'center',
                display: 'flex',
                mr: 1,
                '& .MuiInputBase-root': {
                  backgroundColor: 'background.paper',
                  height: 40,
                  minWidth: 260
                }
              }}
            >
              <TextField
                fullWidth
                onBlur={handleSearchBlur}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Search contacts"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                value={query}
              />
            </Box>
            <Typography
              color="textSecondary"
              sx={{ mr: 2 }}
              variant="body2"
            >
              To:
            </Typography>
            {recipients.reverse().map((recipient) => (
              <Chip
                avatar={(<Avatar src={recipient.avatar} />)}
                key={recipient.id}
                label={recipient.name}
                onDelete={(): void => handleRemoveRecipient(recipient.id)}
                sx={{ mr: 2 }}
              />
            ))}
          </Box>
        </Scrollbar>
      </Box>
      {displaySearchResults && (
        <ClickAwayListener onClickAway={handleSearchResultsClickAway}>
          <Popper
            anchorEl={containerRef?.current}
            open={isSearchFocused}
            placement="bottom-start"
          >
            <Paper
              elevation={16}
              sx={{
                borderColor: 'divider',
                borderStyle: 'solid',
                borderWidth: 1,
                maxWidth: '100%',
                mt: 1,
                width: 320
              }}
            >
              {
                filteredSearchResults.length === 0
                  ? (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                      >
                        Nothing Found
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        We couldn&apos;t find any matches
                        for &quot;
                        {query}
                        &quot;. Try checking for typos or using
                        complete words.
                      </Typography>
                    </Box>
                  )
                  : (
                    <>
                      <Box
                        sx={{
                          px: 2,
                          pt: 2
                        }}
                      >
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                        >
                          Contacts
                        </Typography>
                      </Box>
                      <List>
                        {filteredSearchResults.map((result) => (
                          <ListItem
                            button
                            key={result.id}
                            onClick={(): void => handleAddRecipient(result)}
                          >
                            <ListItemAvatar>
                              <Avatar src={result.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={result.name}
                              primaryTypographyProps={{
                                noWrap: true,
                                variant: 'subtitle2'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )
              }
            </Paper>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

ChatComposerToolbar.propTypes = {
  onAddRecipient: PropTypes.func,
  onRemoveRecipient: PropTypes.func,
  // @ts-ignore
  recipients: PropTypes.array
};

ChatComposerToolbar.defaultProps = {
  recipients: []
};
