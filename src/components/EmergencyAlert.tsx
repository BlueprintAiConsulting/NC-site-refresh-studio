import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyAlert {
  id: string;
  message: string;
  alert_type: string;
  is_active: boolean;
}

export function EmergencyAlert() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("emergency_alerts")
      .select("id, message, alert_type, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAlerts(data);
    }
  };

  const dismissAlert = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const visibleAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="w-full">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "relative py-3 px-4 md:px-6 text-center text-sm md:text-base font-medium",
            alert.alert_type === "urgent" && "bg-red-600 text-white",
            alert.alert_type === "warning" && "bg-amber-500 text-slate-900",
            alert.alert_type === "info" && "bg-blue-600 text-white"
          )}
        >
          <div className="container mx-auto flex items-center justify-center gap-2">
            {alert.alert_type === "urgent" && (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            {alert.alert_type === "warning" && (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            {alert.alert_type === "info" && (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
