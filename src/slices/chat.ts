import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Contact, Message, Thread } from '../types/chat';
import { objFromArray } from '../utils/obj-from-array';

interface ChatState {
  activeThreadId?: string;
  contacts: {
    byId: Record<string, Contact>;
    allIds: string[];
  };
  threads: {
    byId: Record<string, Thread>;
    allIds: string[];
  };
}

const initialState: ChatState = {
  activeThreadId: undefined,
  contacts: {
    byId: {},
    allIds: []
  },
  threads: {
    byId: {},
    allIds: []
  }
};

export const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getContacts(state: ChatState, action: PayloadAction<Contact[]>): void {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },
    getThreads(state: ChatState, action: PayloadAction<Thread[]>): void {
      const threads = action.payload;

      state.threads.byId = objFromArray(threads);
      state.threads.allIds = Object.keys(state.threads.byId);
    },
    getThread(state: ChatState, action: PayloadAction<Thread | null>): void {
      const thread = action.payload;

      if (thread) {
        state.threads.byId[thread.id!] = thread;

        if (!state.threads.allIds.includes(thread.id!)) {
          state.threads.allIds.unshift(thread.id!);
        }
      }
    },
    markThreadAsSeen(state: ChatState, action: PayloadAction<string>): void {
      const threadId = action.payload;
      const thread = state.threads.byId[threadId];

      if (thread) {
        thread.unreadCount = 0;
      }
    },
    setActiveThread(state: ChatState, action: PayloadAction<string | undefined>): void {
      state.activeThreadId = action.payload;
    },
    addMessage(state: ChatState,
      action: PayloadAction<{ message: Message, threadId: string }>): void {
      const { threadId, message } = action.payload;
      const thread = state.threads.byId[threadId];

      if (thread) {
        thread.messages.push(message);
      }
    }
  }

});

export const { reducer } = slice;
