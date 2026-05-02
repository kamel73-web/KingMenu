import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";

export type Plan = "free" | "premium" | "family";
export type SubStatus = "active" | "inactive" | "trialing" | "past_due" | "canceled";

export interface Subscription {
  plan: Plan;
  status: SubStatus;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  isPremium: boolean;
  isLoading: boolean;
}

const DEFAULT: Subscription = {
  plan: "free", status: "inactive",
  currentPeriodEnd: null, cancelAtPeriodEnd: false,
  isPremium: false, isLoading: true,
};

export function useSubscription(): Subscription {
  const { state } = useApp();
  const user = state.user;
  const [sub, setSub] = useState<Subscription>(DEFAULT);

  useEffect(() => {
    if (!user) { setSub({ ...DEFAULT, isLoading: false }); return; }

    const fetchSub = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end, cancel_at_period_end")
        .eq("user_id", user.id)
        .single();

      if (!data) { setSub({ ...DEFAULT, isLoading: false }); return; }

      const isPremium =
        ["premium", "family"].includes(data.plan) &&
        ["active", "trialing"].includes(data.status);

      setSub({
        plan: data.plan as Plan,
        status: data.status as SubStatus,
        currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
        cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
        isPremium, isLoading: false,
      });
    };

    fetchSub();

    const channel = supabase
      .channel(`subscription:${user.id}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "subscriptions",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const d = payload.new as any;
        if (!d) return;
        const isPremium =
          ["premium", "family"].includes(d.plan) &&
          ["active", "trialing"].includes(d.status);
        setSub({
          plan: d.plan, status: d.status,
          currentPeriodEnd: d.current_period_end ? new Date(d.current_period_end) : null,
          cancelAtPeriodEnd: d.cancel_at_period_end ?? false,
          isPremium, isLoading: false,
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  return sub;
}
