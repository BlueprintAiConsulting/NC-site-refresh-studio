import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadPhoto } from '@/lib/storage';
import { Calendar, Clock, MapPin, Plus, Pencil, Trash2, ArrowLeft, Star, Loader2, Image as ImageIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EventRecord {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  is_featured: boolean;
  image_url?: string | null;
  image_path?: string | null;
}

interface EventFormState {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurringPattern: string;
  isFeatured: boolean;
  imageUrl: string;
  imagePath: string;
}

const defaultFormState: EventFormState = {
  title: '',
  description: '',
  eventDate: '',
  startTime: '',
  endTime: '',
  location: '',
  isRecurring: false,
  recurringPattern: '',
  isFeatured: false,
  imageUrl: '',
  imagePath: '',
};

export default function AdminEvents() {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formState, setFormState] = useState<EventFormState>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Failed to load events:', error);
      toast({
        title: 'Unable to load events',
        description: 'Please check your permissions and try again.',
        variant: 'destructive',
      });
    } else {
      setEvents(data ?? []);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAdmin) {
      toast({
        title: 'Admin access required',
        description: 'Your account does not have permission to manage events.',
        variant: 'destructive',
      });
      return;
    }

    if (!formState.title || !formState.eventDate || !formState.startTime) {
      toast({
        title: 'Missing required fields',
        description: 'Title, date, and start time are required.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim() || null,
      event_date: formState.eventDate,
      start_time: formState.startTime,
      end_time: formState.endTime || null,
      location: formState.location.trim() || null,
      is_recurring: formState.isRecurring,
      recurring_pattern: formState.isRecurring ? (formState.recurringPattern || null) : null,
      is_featured: formState.isFeatured,
      image_url: formState.imageUrl || null,
      image_path: formState.imagePath || null,
    };

    const { error } = editingId
      ? await supabase.from('events').update(payload as any).eq('id', editingId)
      : await supabase.from('events').insert({
          ...payload,
          created_by: user?.id ?? null,
        } as any);

    if (error) {
      console.error('Event save error:', error);
      const fallbackMessage = error.message || 'Please check your permissions and try again.';
      const isRlsError = error.message?.toLowerCase().includes('row-level security');
      toast({
        title: 'Unable to save event',
        description: isRlsError
          ? 'Your account needs the admin role to update events.'
          : fallbackMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: editingId ? 'Event updated' : 'Event created',
        description: 'Your changes have been saved.',
      });
      resetForm();
      await fetchEvents();
    }

    setSaving(false);
  };

  const startEdit = (event: EventRecord) => {
    setEditingId(event.id);
    setFormState({
      title: event.title,
      description: event.description ?? '',
      eventDate: event.event_date,
      startTime: event.start_time,
      endTime: event.end_time ?? '',
      location: event.location ?? '',
      isRecurring: event.is_recurring,
      recurringPattern: event.recurring_pattern ?? '',
      isFeatured: event.is_featured,
      imageUrl: event.image_url ?? '',
      imagePath: event.image_path ?? '',
    });
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (!isAdmin) {
      toast({
        title: 'Admin access required',
        description: 'Your account does not have permission to upload event images.',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);

    try {
      const { url, path } = await uploadPhoto(file, 'events');
      setFormState((prev) => ({
        ...prev,
        imageUrl: url,
        imagePath: path,
      }));
      toast({
        title: 'Image uploaded',
        description: 'The event image is ready to save with this event.',
      });
    } catch (error: any) {
      console.error('Event image upload error:', error);
      toast({
        title: 'Unable to upload image',
        description: error?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm('Delete this event? This cannot be undone.');
    if (!shouldDelete) return;

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Unable to delete event',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Event deleted',
      description: 'The event has been removed.',
    });
    await fetchEvents();
  };

  const formatDate = (value: string) => {
    try {
      return format(parseISO(value), 'MMM d, yyyy');
    } catch {
      return value;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-5">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Events Management</h1>
              <p className="text-muted-foreground">Create, update, and feature upcoming events.</p>
            </div>
          </div>

          {!isAdmin && (
            <Card className="mb-6 border-destructive/40 bg-destructive/5">
              <CardHeader>
                <CardTitle>Admin permissions required</CardTitle>
                <CardDescription>
                  The current account does not have access to create, update, or delete events.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Please assign the admin role to {user?.email ?? 'this user'} in Supabase, then refresh.
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingId ? 'Edit Event' : 'Add New Event'}
                </CardTitle>
                <CardDescription>
                  {editingId ? 'Update the event details below.' : 'Fill in the details to publish a new event.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formState.title}
                      onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                      placeholder="Event title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      placeholder="Short event summary"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formState.eventDate}
                        onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formState.location}
                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                        placeholder="Main Sanctuary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formState.startTime}
                        onChange={(e) => setFormState({ ...formState, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formState.endTime}
                        onChange={(e) => setFormState({ ...formState, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventImage">Event Image</Label>
                    <div className="flex flex-col gap-3">
                      {formState.imageUrl ? (
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={formState.imageUrl}
                              alt={`${formState.title || 'Event'} image`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFormState((prev) => ({ ...prev, imageUrl: '', imagePath: '' }));
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            Remove image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Input
                            id="eventImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files?.[0])}
                            ref={fileInputRef}
                            disabled={uploadingImage}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Upload an image to show with this event.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isRecurring"
                        checked={formState.isRecurring}
                        onCheckedChange={(value) =>
                          setFormState({
                            ...formState,
                            isRecurring: value,
                            recurringPattern: value ? formState.recurringPattern : '',
                          })
                        }
                      />
                      <Label htmlFor="isRecurring">Recurring event</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isFeatured"
                        checked={formState.isFeatured}
                        onCheckedChange={(value) => setFormState({ ...formState, isFeatured: value })}
                      />
                      <Label htmlFor="isFeatured">Featured</Label>
                    </div>
                  </div>

                  {formState.isRecurring && (
                    <div className="space-y-2">
                      <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                      <Select
                        value={formState.recurringPattern}
                        onValueChange={(value) => setFormState({ ...formState, recurringPattern: value })}
                      >
                        <SelectTrigger id="recurringPattern">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="first_saturday">1st Saturday</SelectItem>
                          <SelectItem value="third_saturday">3rd Saturday</SelectItem>
                          <SelectItem value="last_wednesday">Last Wednesday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={saving || !isAdmin}>
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          {editingId ? 'Update Event' : 'Create Event'}
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Events</CardTitle>
                <CardDescription>Manage upcoming events in the database.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No events yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 bg-background">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              {event.is_featured && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3" />
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(event.event_date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {event.start_time}
                                {event.end_time ? ` - ${event.end_time}` : ''}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                            )}
                          </div>
                          {event.image_url && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                              <img
                                src={event.image_url}
                                alt={`${event.title} image`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline" onClick={() => startEdit(event)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
