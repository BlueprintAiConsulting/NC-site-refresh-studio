import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    console.log("Received contact form submission:", { name, email, message });

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

    // Send notification email to the church
    const churchEmailResponse = await sendEmail({
      from: "New Creation Website <onboarding@resend.dev>",
      to: ["newcreation25@comcast.net"],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message provided"}</p>
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
        <h2>Thank you for reaching out, ${name}!</h2>
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
