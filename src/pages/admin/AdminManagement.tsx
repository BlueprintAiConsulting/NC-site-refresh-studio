import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import {
  addLocalAdminAccount,
  canAdminResetPassword,
  getConfiguredAdmin,
  listAdminAccounts,
  resetLocalAdminPassword,
  removeLocalAdminAccount,
  SUPER_ADMIN_EMAIL,
} from "@/lib/admin-auth";

interface AdminUser {
  email: string;
  created_at: string;
  source: "env" | "local";
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
  const isSuperAdmin = currentAdminEmail === SUPER_ADMIN_EMAIL;

  const canResetPassword = (admin: AdminUser) => {
    if (!currentAdminEmail) return false;
    if (admin.source === "env") return false;

    const targetEmail = normalizeEmail(admin.email);
    return canAdminResetPassword(currentAdminEmail, targetEmail);
  };

  const loadAdmins = () => {
    const accounts = listAdminAccounts();
    setAdmins(
      accounts.map((account) => ({
        email: account.email,
        created_at: account.createdAt,
        source: account.source,
      })),
    );
  };

  useEffect(() => {
    try {
      loadAdmins();
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
  }, [toast]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
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
        description: "Set a password for local admin accounts.",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      addLocalAdminAccount(normalizedEmail, password.trim());
      setEmail("");
      setPassword("");
      loadAdmins();

      toast({
        title: "Admin added",
        description: `${normalizedEmail} can now sign in to the admin dashboard.`,
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

  const handleRemoveAdmin = (adminEmail: string) => {
    const configuredAdmin = getConfiguredAdmin();

    if (configuredAdmin?.email === adminEmail) {
      toast({
        title: "Cannot remove primary admin",
        description: "The env-configured admin can only be changed through VITE_ADMIN_EMAIL.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Remove ${adminEmail} as admin? This cannot be undone.`)) return;

    const removed = removeLocalAdminAccount(adminEmail);

    if (!removed) {
      toast({
        title: "Failed to remove admin",
        description: "Admin account not found.",
        variant: "destructive",
      });
      return;
    }

    loadAdmins();
    toast({
      title: "Admin removed",
      description: `${adminEmail} is no longer an admin`,
    });
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
              <p className="text-muted-foreground">Add or remove admin users (local site storage)</p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>
                Enter an email and password to create a local admin account for this site.
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
                    These admin accounts are stored locally in this browser. For multi-device production access,
                    replace this with your backend user management.
                  </p>
                </div>

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
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium">{admin.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {admin.source === "env"
                                ? "Primary admin (from environment config)"
                                : `Added ${new Date(admin.created_at).toLocaleDateString()}`}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveAdmin(admin.email)}
                            disabled={admin.source === "env"}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                          <div className="flex-1">
                            <Label htmlFor={`reset-password-${normalizedAdminEmail}`}>Reset password</Label>
                            <Input
                              id={`reset-password-${normalizedAdminEmail}`}
                              type="password"
                              placeholder={
                                admin.source === "env"
                                  ? "Password managed by environment variables"
                                  : resetAllowed
                                    ? "Enter a new password"
                                    : "You can only reset your own password"
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
