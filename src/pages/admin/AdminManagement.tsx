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
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Load current admins
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("id, user_id, created_at")
          .eq("role", "admin");

        if (error) throw error;

        // Fetch user emails from auth
        const adminsWithEmail: AdminUser[] = [];
        for (const admin of data || []) {
          const { data: authUser } = await supabase.auth.admin.getUserById(admin.user_id);
          if (authUser?.user?.email) {
            adminsWithEmail.push({
              id: admin.id,
              user_id: admin.user_id,
              email: authUser.user.email,
              created_at: admin.created_at,
            });
          }
        }
        setAdmins(adminsWithEmail);
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
    try {
      // 1. Create user in auth if doesn't exist
      const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserByEmail(
        email
      );

      let userId: string;

      if (existingUser?.user) {
        userId = existingUser.user.id;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          password: Math.random().toString(36).slice(-16), // Random password
        });

        if (createError) throw createError;
        if (!newUser?.user?.id) throw new Error("Failed to create user");
        userId = newUser.user.id;
      }

      // 2. Check if already admin
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (existingRole) {
        toast({
          title: "Already an admin",
          description: `${email} is already an admin`,
        });
        return;
      }

      // 3. Add admin role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
      });

      if (roleError) throw roleError;

      // 4. Refresh admin list
      const newAdmin: AdminUser = {
        id: crypto.randomUUID(),
        user_id: userId,
        email,
        created_at: new Date().toISOString(),
      };
      setAdmins((prev) => [...prev, newAdmin]);
      setEmail("");

      toast({
        title: "Admin added",
        description: `${email} is now an admin`,
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
