import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("LEMON_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  // Vérification de la signature LemonSqueezy
  const signature = req.headers.get("x-signature");
  const body = await req.text();

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (signature !== expectedSig) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventName = payload.meta?.event_name;
  const data = payload.data?.attributes;
  const userId = payload.meta?.custom_data?.user_id;

  if (!userId) {
    return new Response("No user_id in custom_data", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Déterminer le plan selon le variant ID
  const variantId = String(data?.variant_id);
  const VARIANT_MENSUEL = Deno.env.get("LEMON_VARIANT_MENSUEL") ?? "";
  const VARIANT_ANNUEL = Deno.env.get("LEMON_VARIANT_ANNUEL") ?? "";

  let plan = "free";
  if (variantId === VARIANT_MENSUEL || variantId === VARIANT_ANNUEL) {
    plan = "premium";
  }

  // Mapper le statut LemonSqueezy → statut interne
  const statusMap: Record<string, string> = {
    active: "active",
    on_trial: "trialing",
    cancelled: "canceled",
    expired: "inactive",
    past_due: "past_due",
    paused: "inactive",
  };
  const status = statusMap[data?.status] ?? "inactive";

  // Upsert dans la table subscriptions
  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan: ["active", "trialing"].includes(status) ? plan : "free",
        status,
        lemon_subscription_id: String(data?.id ?? ""),
        lemon_customer_id: String(data?.customer_id ?? ""),
        current_period_end: data?.renews_at ?? data?.ends_at ?? null,
        cancel_at_period_end: data?.cancelled ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Supabase error:", error);
    return new Response("DB error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
