import { useQuery } from '@tanstack/react-query';
import { fetchCalendarEvents, FormattedEvent } from '@/lib/googleCalendar';

/**
 * Hook to fetch and cache Google Calendar events
 */
export function useCalendarEvents(maxResults: number = 10) {
  return useQuery<FormattedEvent[]>({
    queryKey: ['calendar-events', maxResults],
    queryFn: () => fetchCalendarEvents(maxResults),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
