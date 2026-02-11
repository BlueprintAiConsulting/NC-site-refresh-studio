import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { canAdminResetPassword, SUPER_ADMIN_EMAIL } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  email: string;
  created_at: string;
  source: "backend";
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export default function AdminManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [passwordResets, setPasswordResets] = useState<Record<string, string>>({});

  const currentAdminEmail = normalizeEmail(user?.email ?? "");

  const canResetPassword = (admin: AdminUser) => {
    if (!currentAdminEmail) return false;
    return canAdminResetPassword(currentAdminEmail, normalizeEmail(admin.email));
  };

  const loadAdmins = async () => {
    const { data, error } = await supabase.functions.invoke("list-admins");

    if (!error && data?.admins) {
      setAdmins(
        (data.admins as Array<{ email: string; created_at: string }>).map((admin) => ({
          email: admin.email,
          created_at: admin.created_at,
          source: "backend",
        })),
      );
      return;
    }

    const rpcResult = await supabase.rpc("list_admins_with_emails");
    if (rpcResult.error) {
      throw error || rpcResult.error;
    }

    setAdmins(
      (rpcResult.data ?? []).map((admin) => ({
        email: admin.email,
        created_at: admin.created_at,
        source: "backend",
      })),
    );
  };

  useEffect(() => {
    const run = async () => {
      try {
        await loadAdmins();
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

    run();
  }, [toast]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Set a password for the admin account.",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke("add-admin", {
        body: {
          email: normalizedEmail,
          password: password.trim(),
          sendInvite: false,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to add admin");
      }

      setEmail("");
      setPassword("");
      await loadAdmins();

      toast({
        title: "Admin updated",
        description: data?.message ?? `${normalizedEmail} can now sign in on any device.`,
      });
    } catch (err) {
      console.error("Error adding admin:", err);
      toast({
        title: "Failed to add admin",
        description: (err as Error).message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleResetPassword = async (admin: AdminUser) => {
    const adminEmail = normalizeEmail(admin.email);

    if (!canResetPassword(admin)) {
      toast({
        title: "Not allowed",
        description: "Only the super admin can reset other admins. You can only reset your own password.",
        variant: "destructive",
      });
      return;
    }

    const nextPassword = passwordResets[adminEmail]?.trim() ?? "";

    if (!nextPassword) {
      toast({
        title: "Password required",
        description: "Enter a new password before resetting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("add-admin", {
        body: {
          email: adminEmail,
          password: nextPassword,
          sendInvite: false,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to reset password");
      }

      setPasswordResets((current) => ({
        ...current,
        [adminEmail]: "",
      }));

      toast({
        title: "Password updated",
        description: data?.message ?? `${adminEmail}'s password has been updated.`,
      });
    } catch (err) {
      console.error("Error resetting admin password:", err);
      toast({
        title: "Unable to reset password",
        description: (err as Error).message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = (admin: AdminUser) => {
    const adminEmail = normalizeEmail(admin.email);

    if (!canResetPassword(admin)) {
      toast({
        title: "Not allowed",
        description: "Only the super admin can reset other admins. You can only reset your own password.",
        variant: "destructive",
      });
      return;
    }

    const nextPassword = passwordResets[adminEmail]?.trim() ?? "";

    if (!nextPassword) {
      toast({
        title: "Password required",
        description: "Enter a new password before resetting.",
        variant: "destructive",
      });
      return;
    }

    const updated = resetLocalAdminPassword(adminEmail, nextPassword, currentAdminEmail);

    if (!updated) {
      toast({
        title: "Unable to reset password",
        description: "Only locally-stored admin accounts can be updated here.",
        variant: "destructive",
      });
      return;
    }

    setPasswordResets((current) => ({
      ...current,
      [adminEmail]: "",
    }));

    toast({
      title: "Password updated",
      description: `${adminEmail}'s password has been reset on this site.`,
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-5">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Admin Management</h1>
              <p className="text-muted-foreground">Manage admin users through shared backend auth</p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add or Update Admin</CardTitle>
              <CardDescription>
                Create or update an admin account in backend auth so it works across devices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={adding}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Set a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={adding}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Admin credentials are stored and verified by Supabase Auth, enabling multi-device sign-in.
                  </p>
                </div>

                <Button type="submit" disabled={adding}>
                  {adding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Save Admin
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Admins ({admins.length})</CardTitle>
              <CardDescription>
                Only {SUPER_ADMIN_EMAIL} can reset another admin's password. Other admins can only reset their own.
              </CardDescription>
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
                  {admins.map((admin) => {
                    const normalizedAdminEmail = normalizeEmail(admin.email);
                    const resetAllowed = canResetPassword(admin);

                    return (
                      <div key={admin.email} className="p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{admin.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Added {new Date(admin.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                          <div className="flex-1">
                            <Label htmlFor={`reset-password-${normalizedAdminEmail}`}>Reset password</Label>
                            <Input
                              id={`reset-password-${normalizedAdminEmail}`}
                              type="password"
                              placeholder={
                                resetAllowed ? "Enter a new password" : "You can only reset your own password"
                              }
                              value={passwordResets[normalizedAdminEmail] ?? ""}
                              onChange={(e) =>
                                setPasswordResets((current) => ({
                                  ...current,
                                  [normalizedAdminEmail]: e.target.value,
                                }))
                              }
                              disabled={!resetAllowed}
                              className="mt-2"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            onClick={() => handleResetPassword(admin)}
                            disabled={!resetAllowed}
                          >
                            Reset Password
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
