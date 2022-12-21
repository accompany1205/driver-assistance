import { mailApi } from '../__fake-api__/mail-api';
import { slice } from '../slices/mail';
import { AppThunk } from '../store';

export const getLabels = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await mailApi.getLabels();

  dispatch(slice.actions.getLabels(response));
};

type GetEmailsParams = {
  label?: string;
};

export const getEmails = (params: GetEmailsParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await mailApi.getEmails(params);

  dispatch(slice.actions.getEmails(response));
};

type GetEmailParams = {
  emailId: string
}

export const getEmail = (params: GetEmailParams): AppThunk => async (dispatch): Promise<void> => {
  const response = await mailApi.getEmail(params);

  dispatch(slice.actions.getEmail(response));
};

export const openSidebar = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.closeSidebar());
};

export const openComposer = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.openCompose());
};

export const closeComposer = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.closeCompose());
};
