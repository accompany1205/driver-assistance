import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/timeline/main.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import type { Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { CalendarEventDialog } from '../../components/dashboard/calendar/calendar-event-dialog';
import { CalendarToolbar } from '../../components/dashboard/calendar/calendar-toolbar';
import { gtm } from '../../lib/gtm';
import { useDispatch, useSelector } from '../../store';
import { getEvents, updateEvent } from '../../thunks/calendar';
import type { CalendarView } from '../../types/calendar';

const FullCalendarWrapper = styled('div')(
  ({ theme }) => ({
    marginTop: theme.spacing(3),
    '& .fc-license-message': {
      display: 'none'
    },
    '& .fc': {
      '--fc-bg-event-opacity': 1,
      '--fc-border-color': theme.palette.divider,
      '--fc-daygrid-event-dot-width': '10px',
      '--fc-event-text-color': theme.palette.primary.contrastText,
      '--fc-list-event-hover-bg-color': theme.palette.background.default,
      '--fc-neutral-bg-color': theme.palette.background.default,
      '--fc-page-bg-color': theme.palette.background.default,
      '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.25),
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily
    },
    '& .fc .fc-col-header-cell-cushion': {
      paddingBottom: '10px',
      paddingTop: '10px',
      fontSize: theme.typography.overline.fontSize,
      fontWeight: theme.typography.overline.fontWeight,
      letterSpacing: theme.typography.overline.letterSpacing,
      lineHeight: theme.typography.overline.lineHeight,
      textTransform: theme.typography.overline.textTransform
    },
    '& .fc .fc-day-other .fc-daygrid-day-top': {
      color: theme.palette.text.secondary
    },
    '& .fc-daygrid-event': {
      borderRadius: theme.shape.borderRadius,
      padding: '0px 4px',
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.subtitle2.fontWeight,
      lineHeight: theme.typography.subtitle2.lineHeight
    },
    '& .fc-daygrid-block-event .fc-event-time': {
      fontSize: theme.typography.body2.fontSize,
      fontWeight: theme.typography.body2.fontWeight,
      lineHeight: theme.typography.body2.lineHeight
    },
    '& .fc-daygrid-day-frame': {
      padding: '12px'
    }
  })
);

const Calendar: NextPage = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar | null>(null);
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { events } = useSelector((state) => state.calendar);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>(smDown ? 'timeGridDay' : 'dayGridMonth');
  const [dialog, setDialog] = useState<any>({
    isOpen: false,
    eventId: undefined,
    range: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(
    () => {
      dispatch(getEvents());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleResize = useCallback(
    () => {
      const calendarEl = calendarRef.current;

      if (calendarEl) {
        const calendarApi = calendarEl.getApi();
        const newView = smDown ? 'timeGridDay' : 'dayGridMonth';

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarRef, smDown]
  );

  useEffect(
    () => {
      handleResize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [smDown]
  );

  const handleDateToday = (): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView: CalendarView): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = (): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = (): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleAddClick = (): void => {
    setDialog({
      isOpen: true
    });
  };

  const handleRangeSelect = (arg: DateSelectArg): void => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.unselect();
    }

    setDialog({
      isOpen: true,
      range: {
        start: arg.start.getTime(),
        end: arg.end.getTime()
      }
    });
  };

  const handleEventSelect = (arg: EventClickArg): void => {
    setDialog({
      isOpen: true,
      eventId: arg.event.id
    });
  };

  const handleEventResize = async (arg: EventResizeDoneArg): Promise<void> => {
    const { event } = arg;

    try {
      await dispatch(updateEvent({
        eventId: event.id,
        update: {
          allDay: event.allDay,
          start: event.start?.getTime(),
          end: event.end?.getTime()
        }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventDrop = async (arg: EventDropArg): Promise<void> => {
    const { event } = arg;

    try {
      await dispatch(updateEvent({
        eventId: event.id,
        update: {
          allDay: event.allDay,
          start: event.start?.getTime(),
          end: event.end?.getTime()
        }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseDialog = (): void => {
    setDialog({
      isOpen: false
    });
  };

  const selectedEvent = dialog.eventId && events.find((event) => event.id === dialog.eventId);

  return (
    <>
      <Head>
        <title>
          Dashboard: Calendar | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.paper',
          flexGrow: 1,
          py: 8
        }}
      >
        <CalendarToolbar
          date={date}
          onAddClick={handleAddClick}
          onDateNext={handleDateNext}
          onDatePrev={handleDatePrev}
          onDateToday={handleDateToday}
          onViewChange={handleViewChange}
          view={view}
          mobile={smDown}
        />
        <FullCalendarWrapper>
          <FullCalendar
            allDayMaintainDuration
            dayMaxEventRows={3}
            droppable
            editable
            eventClick={handleEventSelect}
            eventDisplay="block"
            eventDrop={handleEventDrop}
            eventResizableFromStart
            eventResize={handleEventResize}
            events={events}
            headerToolbar={false}
            height={800}
            initialDate={date}
            initialView={view}
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              listPlugin,
              timeGridPlugin,
              timelinePlugin
            ]}
            ref={calendarRef}
            rerenderDelay={10}
            select={handleRangeSelect}
            selectable
            weekends
          />
        </FullCalendarWrapper>
      </Box>
      <CalendarEventDialog
        event={selectedEvent}
        onAddComplete={handleCloseDialog}
        onClose={handleCloseDialog}
        onDeleteComplete={handleCloseDialog}
        onEditComplete={handleCloseDialog}
        open={dialog.isOpen}
        range={dialog.range}
      />
    </>
  );
};

Calendar.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Calendar;
