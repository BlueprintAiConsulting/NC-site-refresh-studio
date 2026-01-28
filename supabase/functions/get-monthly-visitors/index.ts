import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOATCOUNTER_SITE_CODE = Deno.env.get("GOATCOUNTER_SITE_CODE");
const GOATCOUNTER_API_TOKEN = Deno.env.get("GOATCOUNTER_API_TOKEN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function formatDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GOATCOUNTER_SITE_CODE || !GOATCOUNTER_API_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Missing analytics configuration" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const start = formatDate(startOfMonth);
  const end = formatDate(now);

  try {
    const response = await fetch(
      `https://${GOATCOUNTER_SITE_CODE}.goatcounter.com/api/v0/stats/total?start=${start}&end=${end}`,
      {
        headers: {
          Authorization: `Bearer ${GOATCOUNTER_API_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GoatCounter API error: ${errorText}`);
    }

    const data = await response.json();
    const visitors = Number(
      data?.visitors ??
        data?.total?.visitors ??
        data?.totals?.visitors ??
        data?.count ??
        0,
    );

    return new Response(JSON.stringify({ visitors }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error fetching GoatCounter stats:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch analytics" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
