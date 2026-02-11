import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ADMIN_INVITE_REDIRECT_URL = Deno.env.get("ADMIN_INVITE_REDIRECT_URL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AddAdminRequest {
  email?: string;
  password?: string | null;
  sendInvite?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing Supabase configuration" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const { data: roleRow, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleRow) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { email, password, sendInvite }: AddAdminRequest = await req.json();

    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: existingUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 50,
        email: normalizedEmail,
      });

    if (listError) throw listError;

    const matchedUser = existingUsers?.users?.find(
      (existing) => existing.email?.toLowerCase() === normalizedEmail,
    );

    let userId = matchedUser?.id;
    let message = `${normalizedEmail} is now an admin.`;

    if (matchedUser) {
      if (password) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          matchedUser.id,
          { password },
        );
        if (updateError) throw updateError;
        message = "Admin updated with a new password.";
      } else {
        message =
          "Admin role added. Existing user should use password reset if needed.";
      }
    } else if (password) {
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
        });

      if (createError) throw createError;
      if (!newUser?.user?.id) throw new Error("Failed to create user");
      userId = newUser.user.id;
      message = "Admin created with the provided password.";
    } else if (sendInvite) {
      const inviteOptions = ADMIN_INVITE_REDIRECT_URL
        ? { redirectTo: ADMIN_INVITE_REDIRECT_URL }
        : undefined;

      const { data: inviteData, error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, inviteOptions);

      if (inviteError) throw inviteError;
      if (!inviteData?.user?.id) throw new Error("Failed to invite user");
      userId = inviteData.user.id;
      message = ADMIN_INVITE_REDIRECT_URL
        ? "Invite email sent so the user can set a password."
        : "Invite email sent. If signup cannot verify the invite, set ADMIN_INVITE_REDIRECT_URL for this function to your /admin/login URL.";
    } else {
      return new Response(
        JSON.stringify({
          error: "Provide a password or enable invite email.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    if (!userId) {
      throw new Error("Unable to resolve user ID");
    }

    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!existingRole) {
      const { error: insertError } = await supabaseAdmin.from("user_roles").insert({
        user_id: userId,
        role: "admin",
      });

      if (insertError) throw insertError;
    } else {
      message = `${normalizedEmail} is already an admin.`;
    }

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error adding admin:", error);
    const message = error instanceof Error ? error.message : "Failed to add admin";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
