import { chatApi } from '../__fake-api__/chat-api';
import { slice } from '../slices/chat';
import { AppThunk } from '../store';

export const getContacts = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await chatApi.getContacts({});

  dispatch(slice.actions.getContacts(response));
};

export const getThreads = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await chatApi.getThreads();

  dispatch(slice.actions.getThreads(response));
};

type GetThreadParams = {
  threadKey: string;
};

export const getThread = (params: GetThreadParams): AppThunk => async (dispatch): Promise<string | undefined> => {
  const response = await chatApi.getThread(params);

  dispatch(slice.actions.getThread(response));

  return response?.id;
};

type MarkThreadAsSeenParams = {
  threadId: string;
}

export const markThreadAsSeen = (params: MarkThreadAsSeenParams): AppThunk => async (dispatch): Promise<void> => {
  await chatApi.markThreadAsSeen(params);

  dispatch(slice.actions.markThreadAsSeen(params.threadId));
};

type SetActiveThreadParams = {
  threadId?: string;
};

export const setActiveThread = (params: SetActiveThreadParams): AppThunk => (dispatch): void => {
  dispatch(slice.actions.setActiveThread(params.threadId));
};

type AddMessageParams = {
  threadId?: string;
  recipientIds?: string[];
  body: string;
}

export const addMessage = (params: AddMessageParams): AppThunk => async (dispatch): Promise<string> => {
  const response = await chatApi.addMessage(params);

  dispatch(slice.actions.addMessage(response));

  return response.threadId;
};
