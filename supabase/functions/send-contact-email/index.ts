import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// HTML escape function to prevent XSS
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

async function sendEmail(options: { from: string; to: string[]; subject: string; html: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return response.json();
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  message?: string;
}

async function checkRateLimit(supabase: any, ipAddress: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  
  // Count recent submissions from this IP
  const { count, error } = await supabase
    .from('contact_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ipAddress)
    .gte('submitted_at', windowStart);

  if (error) {
    console.error("Rate limit check error:", error);
    // Allow on error to not block legitimate users
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_WINDOW };
  }

  const currentCount = count || 0;
  const remaining = Math.max(0, MAX_SUBMISSIONS_PER_WINDOW - currentCount);
  
  return { 
    allowed: currentCount < MAX_SUBMISSIONS_PER_WINDOW, 
    remaining 
  };
}

async function recordSubmission(supabase: any, ipAddress: string): Promise<void> {
  const { error } = await supabase
    .from('contact_rate_limits')
    .insert({ ip_address: ipAddress });

  if (error) {
    console.error("Failed to record submission:", error);
  }

  // Clean up old entries occasionally (1 in 10 chance)
  if (Math.random() < 0.1) {
    await supabase.rpc('cleanup_old_rate_limits');
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client with service role for rate limiting
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  // Get client IP for rate limiting
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                    req.headers.get("cf-connecting-ip") || 
                    req.headers.get("x-real-ip") || 
                    "unknown";

  try {
    // Check rate limit before processing
    const { allowed, remaining } = await checkRateLimit(supabase, ipAddress);
    
    if (!allowed) {
      console.log(`Rate limit exceeded for IP: ${ipAddress}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many submissions. Please try again later." 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "X-RateLimit-Remaining": "0",
            ...corsHeaders 
          },
        }
      );
    }

    const { name, email, message }: ContactFormRequest = await req.json();

    console.log("Received contact form submission:", { name, email, message: message?.substring(0, 50) });

    // Validate required fields
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Escape user inputs to prevent XSS in HTML emails
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = message ? escapeHtml(message) : "No message provided";

    // Send notification email to the church
    const churchEmailResponse = await sendEmail({
      from: "New Creation Website <onboarding@resend.dev>",
      to: ["newcreation25@comcast.net"],
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">This message was sent from the New Creation Community Church website contact form.</p>
      `,
    });

    console.log("Church notification email sent:", churchEmailResponse);

    // Send confirmation email to the visitor
    const visitorEmailResponse = await sendEmail({
      from: "New Creation Community Church <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting New Creation Community Church",
      html: `
        <h2>Thank you for reaching out, ${safeName}!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>In the meantime, we invite you to join us for worship:</p>
        <ul>
          <li><strong>Traditional Service:</strong> Sundays at 8:00 AM</li>
          <li><strong>Sunday School:</strong> 9:15 AM (adults and children)</li>
          <li><strong>Contemporary Service:</strong> Sundays at 10:30 AM</li>
        </ul>
        <p>We look forward to connecting with you!</p>
        <p>Blessings,<br/>New Creation Community Church<br/>3005 Emig Mill Road, Dover PA 17315<br/>717-764-0252</p>
      `,
    });

    console.log("Visitor confirmation email sent:", visitorEmailResponse);

    // Record successful submission for rate limiting
    await recordSubmission(supabase, ipAddress);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully!" 
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          "X-RateLimit-Remaining": String(remaining - 1),
          ...corsHeaders 
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    // Return generic error message - do not expose internal details
    return new Response(
      JSON.stringify({ 
        error: "We couldn't send your message. Please try again or call us at 717-764-0252." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);