-- Create newsletters table
CREATE TABLE public.newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    pdf_path TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on newsletters
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view newsletters (public)
CREATE POLICY "Anyone can view newsletters"
ON public.newsletters
FOR SELECT
USING (true);

-- Policy: Only admins can insert newsletters
CREATE POLICY "Admins can insert newsletters"
ON public.newsletters
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update newsletters
CREATE POLICY "Admins can update newsletters"
ON public.newsletters
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete newsletters
CREATE POLICY "Admins can delete newsletters"
ON public.newsletters
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_newsletters_updated_at
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for newsletters
INSERT INTO storage.buckets (id, name, public)
VALUES ('newsletters', 'newsletters', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for newsletters bucket
CREATE POLICY "Newsletters are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'newsletters');

CREATE POLICY "Admins can upload newsletters"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'newsletters' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update newsletters"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'newsletters' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete newsletters"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'newsletters' AND public.has_role(auth.uid(), 'admin'));
