import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

export default function AdminManagement() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sendInvite, setSendInvite] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const edgeFunctionTroubleshooting =
    "Could not reach Supabase Edge Functions. Confirm the add-admin function is deployed, your VITE_SUPABASE_URL and publishable key match the live project, and Supabase Auth SMTP settings are configured in the dashboard.";

  const loadAdminsWithFallback = async () => {
    const { data, error } = await supabase.functions.invoke("list-admins");
    if (!error) {
      setAdmins(data?.admins ?? []);
      return;
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc("list_admins_with_emails");
    if (rpcError) throw rpcError;

    setAdmins((rpcData ?? []) as AdminUser[]);
  };

  // Load current admins
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        await loadAdminsWithFallback();
      } catch (err) {
        console.error("Failed to load admins:", err);
        toast({
          title: "Error loading admins",
          description: "Could not fetch admin list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, [toast]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.functions.invoke("add-admin", {
        body: {
          email: normalizedEmail,
          password: password.trim() || null,
          sendInvite: password.trim() ? false : sendInvite,
        },
      });

      if (error) {
        const functionsError = error as Error & { name?: string };
        const message = functionsError.message ?? "";
        const normalizedMessage = message.toLowerCase();
        const isEdgeUnavailable =
          normalizedMessage.includes("edge function") ||
          normalizedMessage.includes("failed to send a request to edge function") ||
          normalizedMessage.includes("failed to send a request to the edge function") ||
          normalizedMessage.includes("failed to fetch") ||
          normalizedMessage.includes("networkerror") ||
          functionsError.name === "FunctionsFetchError";

        if (!isEdgeUnavailable) {
          throw error;
        }

        if (password.trim()) {
          throw new Error(
            "Edge functions are currently unavailable, so password-based admin creation cannot run. Leave password blank and add an existing signed-up user instead.",
          );
        }

        const { data: fallbackMessage, error: fallbackError } = await supabase.rpc(
          "promote_existing_user_to_admin",
          {
            target_email: normalizedEmail,
          },
        );

        if (fallbackError) {
          const fallbackMessage = (fallbackError as Error).message ?? "";
          const isMissingFallbackRpc = fallbackMessage.includes(
            "Could not find the function public.promote_existing_user_to_admin",
          );

          if (isMissingFallbackRpc) {
            throw new Error(
              "Fallback admin promotion is not deployed yet. Run the latest Supabase migrations, then try again.",
            );
          }

          throw fallbackError;
        }

        setEmail("");
        setPassword("");
        await loadAdminsWithFallback();

        toast({
          title: "Admin added",
          description: fallbackMessage ?? `${normalizedEmail} is now an admin`,
        });

        return;
      }

      setEmail("");
      setPassword("");
      await loadAdminsWithFallback();

      toast({
        title: "Admin added",
        description: data?.message ?? `${normalizedEmail} is now an admin`,
      });
    } catch (err) {
      const message = (err as Error).message ?? "";
      const normalizedMessage = message.toLowerCase();
      const isEdgeUnavailable =
        normalizedMessage.includes("edge function") ||
        normalizedMessage.includes("failed to fetch") ||
        normalizedMessage.includes("networkerror");

      const description = isEdgeUnavailable
        ? edgeFunctionTroubleshooting
        : (err as Error).message || "Please try again";

      console.error("Error adding admin:", err);
      toast({
        title: "Failed to add admin",
        description,
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, adminEmail: string) => {
    if (!window.confirm(`Remove ${adminEmail} as admin? This cannot be undone.`)) return;

    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", adminId);

      if (error) throw error;

      setAdmins((prev) => prev.filter((a) => a.id !== adminId));
      toast({
        title: "Admin removed",
        description: `${adminEmail} is no longer an admin`,
      });
    } catch (err) {
      console.error("Error removing admin:", err);
      toast({
        title: "Failed to remove admin",
        description: (err as Error).message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-5">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Admin Management</h1>
              <p className="text-muted-foreground">Add or remove admin users</p>
            </div>
          </div>

          {/* Add Admin Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>
                Enter an email address to make someone an admin. If they don't have an account, one will be created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={adding}
                    />
                    <Button type="submit" disabled={adding}>
                      {adding ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Admin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Set Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Leave blank to send invite email"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={adding}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave blank to send an invite email so the user can set their own password.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="sendInvite"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={sendInvite}
                    onChange={(e) => setSendInvite(e.target.checked)}
                    disabled={adding || Boolean(password.trim())}
                  />
                  <Label htmlFor="sendInvite">Send invite email</Label>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Current Admins Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Admins ({admins.length})</CardTitle>
              <CardDescription>Manage existing admin users</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : admins.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No admins yet</p>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{admin.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(admin.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
