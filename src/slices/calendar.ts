import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { CalendarEvent } from '../types/calendar';

interface CalendarState {
  events: CalendarEvent[];
}

const initialState: CalendarState = {
  events: []
};

export const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(
      state: CalendarState,
      action: PayloadAction<CalendarEvent[]>
    ): void {
      state.events = action.payload;
    },
    createEvent(
      state: CalendarState,
      action: PayloadAction<CalendarEvent>
    ): void {
      state.events.push(action.payload);
    },
    updateEvent(
      state: CalendarState,
      action: PayloadAction<CalendarEvent>
    ): void {
      const event = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },
    deleteEvent(
      state: CalendarState,
      action: PayloadAction<string>
    ): void {
      state.events = state.events.filter((event) => event.id !== action.payload);
    }
  }
});

export const { reducer } = slice;
