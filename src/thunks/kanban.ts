import { kanbanApi } from '../__fake-api__/kanban-api';
import { slice } from '../slices/kanban';
import { AppThunk } from '../store';

export const getBoard = (): AppThunk => async (dispatch): Promise<void> => {
  const data = await kanbanApi.getBoard();

  dispatch(slice.actions.getBoard(data));
};

type CreateColumnParams = {
  name: string;
};

export const createColumn = (params: CreateColumnParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.createColumn(params);

  dispatch(slice.actions.createColumn(response));
};

type UpdateColumnParams = {
  columnId: string;
  update: {
    name: string;
  };
};

export const updateColumn = (params: UpdateColumnParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.updateColumn(params);

  dispatch(slice.actions.updateColumn(response));
};

type ClearColumnParams = {
  columnId: string;
};

export const clearColumn = (params: ClearColumnParams): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.clearColumn(params);

  dispatch(slice.actions.clearColumn(params.columnId));
};

type DeleteColumnParams = {
  columnId: string;
};

export const deleteColumn = (params: DeleteColumnParams): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteColumn(params);

  dispatch(slice.actions.deleteColumn(params.columnId));
};

type CreateCardParams = {
  columnId: string;
  name: string;
};

export const createCard = (params: CreateCardParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.createCard(params);

  dispatch(slice.actions.createCard(response));
};

type UpdateCardParams = {
  cardId: string;
  update: {
    name?: string;
    description?: string;
    isSubscribed?: boolean;
    labels?: string[];
  };
};

export const updateCard = (params: UpdateCardParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.updateCard(params);

  dispatch(slice.actions.updateCard(response));
};

type MoveCardParams = {
  cardId: string;
  position: number;
  columnId?: string;
};

export const moveCard = (params: MoveCardParams): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.moveCard(params);

  dispatch(slice.actions.moveCard(params));
};

type DeleteCardParams = {
  cardId: string;
};

export const deleteCard = (params: DeleteCardParams): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteCard(params);

  dispatch(slice.actions.deleteCard(params.cardId));
};

type AddCommentParams = {
  cardId: string;
  message: string;
};

export const addComment = (params: AddCommentParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.addComment(params);

  dispatch(slice.actions.addComment(response));
};

type AddCheckListParams = {
  cardId: string;
  name: string;
};

export const addChecklist = (params: AddCheckListParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.addChecklist(params);

  dispatch(slice.actions.addChecklist({
    cardId: params.cardId,
    checklist: response
  }));
};

type UpdateChecklistParams = {
  cardId: string,
  checklistId: string,
  update: { name: string; }
};

export const updateChecklist = (params: UpdateChecklistParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.updateChecklist(params);

  dispatch(slice.actions.updateChecklist({
    cardId: params.cardId,
    checklist: response
  }));
};

type DeleteChecklistParams = {
  cardId: string;
  checklistId: string;
};

export const deleteChecklist = (params: DeleteChecklistParams): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteChecklist(params);

  dispatch(slice.actions.deleteChecklist(params));
};

type AddCheckItemParams = {
  cardId: string;
  checklistId: string;
  name: string;
};

export const addCheckItem = (params: AddCheckItemParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.addCheckItem(params);

  dispatch(slice.actions.addCheckItem({
    cardId: params.cardId,
    checklistId: params.checklistId,
    checkItem: response
  }));
};

type UpdateCheckItemParams = {
  cardId: string;
  checklistId: string;
  checkItemId: string;
  update: {
    name?: string;
    state?: 'complete' | 'incomplete';
  };
};

export const updateCheckItem = (params: UpdateCheckItemParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await kanbanApi.updateCheckItem(params);

  dispatch(slice.actions.updateCheckItem({
    cardId: params.cardId,
    checklistId: params.checklistId,
    checkItem: response
  }));
};

type DeleteCheckItemParams = {
  cardId: string;
  checklistId: string;
  checkItemId: string;
};

export const deleteCheckItem = (params: DeleteCheckItemParams): AppThunk => async (dispatch): Promise<void> => {
  await kanbanApi.deleteCheckItem(params);

  dispatch(slice.actions.deleteCheckItem(params));
};
