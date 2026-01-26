const GOOGLE_CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const GOOGLE_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
}

export interface FormattedEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  link: string;
  startDateTime: Date;
}

/**
 * Fetch events from Google Calendar
 */
export async function fetchCalendarEvents(
  maxResults: number = 10
): Promise<FormattedEvent[]> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Google Calendar API key not configured');
    return [];
  }

  const now = new Date().toISOString();
  const params = new URLSearchParams({
    key: GOOGLE_CALENDAR_API_KEY,
    timeMin: now,
    maxResults: maxResults.toString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        GOOGLE_CALENDAR_ID
      )}/events?${params}`
    );

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    return formatEvents(data.items || []);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

/**
 * Format Google Calendar events for display
 */
function formatEvents(events: CalendarEvent[]): FormattedEvent[] {
  return events.map((event) => {
    const startDateTime = event.start.dateTime || event.start.date;
    const endDateTime = event.end.dateTime || event.end.date;
    const isAllDay = !event.start.dateTime;

    const startDate = new Date(startDateTime!);
    const endDate = new Date(endDateTime!);

    return {
      id: event.id,
      title: event.summary,
      date: formatDate(startDate),
      time: isAllDay ? 'All Day' : formatTime(startDate, endDate),
      location: event.location,
      description: event.description,
      link: event.htmlLink,
      startDateTime: startDate,
    };
  });
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time range for display
 */
function formatTime(start: Date, end: Date): string {
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${startTime} - ${endTime}`;
}
