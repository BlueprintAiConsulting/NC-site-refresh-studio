import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ArrowLeft, LogOut, AlertTriangle, Info, Bell } from "lucide-react";
import { format } from "date-fns";
import churchLogo from "@/assets/church-logo.png";

interface Alert {
  id: string;
  message: string;
  alert_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const alertTypes = [
  { value: "info", label: "Info (Blue)", icon: Info },
  { value: "warning", label: "Warning (Yellow)", icon: AlertTriangle },
  { value: "urgent", label: "Urgent (Red)", icon: AlertTriangle },
];

export default function AdminAlerts() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    message: "",
    alert_type: "warning",
    is_active: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAlerts();
    }
  }, [user, isAdmin]);

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    const { data, error } = await supabase
      .from("emergency_alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load alerts");
    } else {
      setAlerts(data || []);
    }
    setLoadingAlerts(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAlert.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("emergency_alerts").insert({
        message: newAlert.message.trim(),
        alert_type: newAlert.alert_type,
        is_active: newAlert.is_active,
        created_by: user?.id,
      });

      if (error) throw error;

      toast.success("Alert created successfully!");
      setNewAlert({ message: "", alert_type: "warning", is_active: true });
      setShowForm(false);
      fetchAlerts();
    } catch (error: any) {
      toast.error(error.message || "Failed to create alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (alert: Alert) => {
    try {
      const { error } = await supabase
        .from("emergency_alerts")
        .update({ is_active: !alert.is_active })
        .eq("id", alert.id);

      if (error) throw error;

      toast.success(alert.is_active ? "Alert deactivated" : "Alert activated");
      setAlerts(alerts.map((a) => 
        a.id === alert.id ? { ...a, is_active: !a.is_active } : a
      ));
    } catch (error: any) {
      toast.error(error.message || "Failed to update alert");
    }
  };

  const handleDelete = async (alert: Alert) => {
    try {
      const { error } = await supabase
        .from("emergency_alerts")
        .delete()
        .eq("id", alert.id);

      if (error) throw error;

      toast.success("Alert deleted successfully");
      setAlerts(alerts.filter((a) => a.id !== alert.id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete alert");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have admin permissions to access this page.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={churchLogo} alt="Logo" className="w-10 h-10 object-contain" />
            <span className="text-white font-semibold">Emergency Alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/events")} className="text-slate-300 hover:text-white">
              Events
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/gallery")} className="text-slate-300 hover:text-white">
              Gallery
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-300 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-5 py-8">
        {/* Info Card */}
        <Card className="mb-6 border-blue-500/30 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-blue-400 mb-1">Emergency Alert Banner</p>
                <p>Use this to display important notices at the top of the website, such as service cancellations, weather closures, or urgent announcements. Only active alerts are shown to visitors.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Alert Form */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{showForm ? "Create New Alert" : "Alerts Management"}</CardTitle>
              <CardDescription>Manage emergency notifications displayed on the website</CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Alert
              </Button>
            )}
          </CardHeader>
          {showForm && (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Alert Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="e.g., Due to inclement weather, all Sunday services are cancelled. Stay safe!"
                    value={newAlert.message}
                    onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="alert_type">Alert Type</Label>
                    <Select
                      value={newAlert.alert_type}
                      onValueChange={(value) => setNewAlert({ ...newAlert, alert_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch
                      id="is_active"
                      checked={newAlert.is_active}
                      onCheckedChange={(checked) => setNewAlert({ ...newAlert, is_active: checked })}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">Active immediately</Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Alert
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setNewAlert({ message: "", alert_type: "warning", is_active: true });
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>All Alerts ({alerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlerts ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No alerts created yet. Create one above when needed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      alert.is_active 
                        ? "bg-card border-primary/30" 
                        : "bg-muted/30 border-border opacity-60"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          alert.alert_type === "urgent" ? "bg-red-500/20 text-red-400" :
                          alert.alert_type === "warning" ? "bg-amber-500/20 text-amber-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {alert.alert_type.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.is_active 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-slate-500/20 text-slate-400"
                        }`}>
                          {alert.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {format(new Date(alert.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={alert.is_active}
                        onCheckedChange={() => toggleActive(alert)}
                        aria-label={alert.is_active ? "Deactivate alert" : "Activate alert"}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Alert</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this alert? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(alert)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
