// src/pages/RefundPolicy.tsx
import { Link } from "react-router-dom";
import { RefreshCw, Mail } from "lucide-react";

const LAST_UPDATED = "May 1, 2026";
const CONTACT_EMAIL = "kingmenu.app@gmail.com";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl font-bold text-content-title mb-3 pb-2 border-b border-neutral-200">
        {title}
      </h2>
      <div className="space-y-3 text-content-body leading-relaxed text-base">
        {children}
      </div>
    </section>
  );
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background-page">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 shadow-soft">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-primary-500" />
            </div>
            <Link to="/" className="text-content-muted text-sm hover:text-primary-500 transition-colors">
              ← KingMenu
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-content-title mb-2">Refund Policy</h1>
          <p className="text-content-muted text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong>
          </p>
          <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
            <strong>Summary:</strong> KingMenu subscriptions give immediate access to digital content
            and are generally non-refundable. Exceptions apply as described below.
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        <Section id="general" title="1. General Principle">
          <p>
            In accordance with applicable consumer protection law (including Article L.221-28
            of the French Consumer Code), the 14-day right of withdrawal <strong>does not apply</strong> to
            digital content made available immediately upon purchase, provided you have expressly
            waived this right at checkout.
          </p>
          <p>
            By subscribing to a KingMenu Premium or Family plan, you acknowledge that you
            immediately receive access to premium digital content and expressly waive your
            right of withdrawal.
          </p>
        </Section>

        <Section id="accepted" title="2. Accepted Refund Cases">
          <p>We will review refund requests favorably in the following situations:</p>
          <div className="space-y-2 mt-2">
            {[
              {
                title: "Billing Error",
                desc: "You were charged twice, or an incorrect amount was charged due to a technical error on our side.",
              },
              {
                title: "Extended Service Outage",
                desc: "The KingMenu service was inaccessible for more than 72 consecutive hours due to an issue on our end (not a third-party outage beyond our control).",
              },
              {
                title: "First Purchase — Unused",
                desc: "You subscribed but did not access any Premium content within 48 hours of your first subscription. This exception applies only once per account.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="font-semibold text-content-title text-sm mb-1">✓ {title}</p>
                <p className="text-sm text-content-muted">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="not-accepted" title="3. Non-Refundable Cases">
          <p>The following situations are <strong>not eligible</strong> for a refund:</p>
          <div className="space-y-2 mt-2">
            {[
              "Change of mind after accessing Premium content",
              "Forgetting to cancel before automatic renewal (a reminder email is sent 3 days before renewal)",
              "Subjective dissatisfaction with recipe content",
              "Partial period remaining after cancellation",
              "Account suspension due to Terms of Use violations",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-error-500 font-bold text-sm mt-0.5">✗</span>
                <p className="text-sm text-content-muted">{item}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="process" title="4. How to Request a Refund">
          <p>To submit a refund request, please follow these steps:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm pl-2">
            <li>Send an email to <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-500 hover:underline">{CONTACT_EMAIL}</a></li>
            <li>Use the subject line: <strong>"Refund Request — KingMenu"</strong></li>
            <li>Include your account email address and the reason for your request</li>
            <li>Attach your LemonSqueezy payment receipt if available</li>
          </ol>
          <p>
            We respond to all refund requests within <strong>72 business hours</strong>.
            If approved, refunds are processed by LemonSqueezy within <strong>5–10 business days</strong>
            to your original payment method.
          </p>
        </Section>

        <Section id="cancellation" title="5. Subscription Cancellation">
          <p>
            You may cancel your subscription at any time from your LemonSqueezy customer portal.
            Cancellation takes effect at the end of the current billing period — you retain
            Premium access until then.
          </p>
          <p>
            Cancellation does not automatically trigger a refund for the current period.
            If you believe you are entitled to a refund, please follow the process in Section 4.
          </p>
        </Section>

        <Section id="contact" title="6. Contact">
          <p>For any questions about this Refund Policy, please contact us:</p>
          <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl mt-3">
            <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-content-title text-sm">KingMenu Support</p>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary-500 hover:text-primary-700 hover:underline text-sm">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="border-t border-neutral-200 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-content-muted">
          <span>© {new Date().getFullYear()} KingMenu. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-primary-500 hover:underline">Privacy Policy</Link>
            <Link to="/terms-of-use" className="text-primary-500 hover:underline">Terms of Use</Link>
            <Link to="/" className="text-primary-500 hover:underline">Back to App</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
