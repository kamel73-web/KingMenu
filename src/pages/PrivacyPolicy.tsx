// src/pages/PrivacyPolicy.tsx
import { Link } from "react-router-dom";
import { Shield, Mail, ExternalLink } from "lucide-react";

const LAST_UPDATED = "April 25, 2026";
const CONTACT_EMAIL = "allogusto@gmail.com";
const APP_URL = "https://kamel73-web.github.io/KingMenu/";

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

function Provider({ name, url, role }: { name: string; url: string; role: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
      <div className="flex-1">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
          {name} <ExternalLink className="h-3 w-3" />
        </a>
        <p className="text-sm text-content-muted mt-0.5">{role}</p>
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background-page">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 shadow-soft">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-500" />
            </div>
            <Link to="/" className="text-content-muted text-sm hover:text-primary-500 transition-colors">
              ← KingMenu
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-content-title mb-2">Privacy Policy</h1>
          <p className="text-content-muted text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong> · Effective immediately upon publication
          </p>
          <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
            <strong>Summary:</strong> KingMenu collects only the minimum data necessary to provide
            its meal planning service. We do not sell your data. We use Google Sign-In for
            authentication only. Your data is stored securely via Supabase and the application
            is hosted on GitHub Pages.
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 mb-10">
          <h2 className="text-sm font-semibold text-content-muted uppercase tracking-wider mb-4">
            Table of Contents
          </h2>
          <ol className="grid sm:grid-cols-2 gap-1 text-sm">
            {[
              ["#who-we-are", "1. Who We Are"],
              ["#data-collected", "2. Data We Collect"],
              ["#how-we-use", "3. How We Use Your Data"],
              ["#legal-basis", "4. Legal Basis (GDPR)"],
              ["#data-sharing", "5. Data Sharing & Third Parties"],
              ["#hosting", "6. Hosting & Infrastructure"],
              ["#cookies", "7. Cookies & Local Storage"],
              ["#retention", "8. Data Retention"],
              ["#your-rights", "9. Your Rights"],
              ["#children", "10. Children's Privacy"],
              ["#security", "11. Security"],
              ["#international", "12. International Transfers"],
              ["#changes", "13. Changes to This Policy"],
              ["#contact", "14. Contact Us"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-primary-500 hover:text-primary-700 hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <Section id="who-we-are" title="1. Who We Are">
          <p>
            KingMenu ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") is a
            meal planning web application developed and maintained by an independent developer. The
            application is accessible at{" "}
            <a href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="text-primary-500 hover:underline inline-flex items-center gap-1">
              {APP_URL} <ExternalLink className="h-3 w-3" />
            </a>.
          </p>
          <p>
            For any privacy-related questions or requests, you may contact us at:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-500 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

        <Section id="data-collected" title="2. Data We Collect">
          <p>We collect the following categories of personal data:</p>
          <div className="space-y-2 mt-2">
            {[
              {
                cat: "Account & Identity Data",
                items: "Full name, email address — collected when you register via Google Sign-In or email/password.",
              },
              {
                cat: "Authentication Data",
                items: "OAuth tokens (Google), session tokens — used solely to authenticate you and maintain your session.",
              },
              {
                cat: "User-Generated Content",
                items: "Meal plans, selected dishes, shopping lists, saved favorites, ingredient preferences — stored to provide the core service.",
              },
              {
                cat: "Preferences & Settings",
                items: "Preferred language, cuisine preferences, dietary restrictions, location (optional, used for local recipes).",
              },
              {
                cat: "Technical Data",
                items: "IP address, browser type, operating system, device type — collected automatically by our hosting provider (GitHub Pages) and backend (Supabase). We do not use this data for profiling.",
              },
            ].map(({ cat, items }) => (
              <div key={cat} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="font-semibold text-content-title text-sm mb-1">{cat}</p>
                <p className="text-sm text-content-muted">{items}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-content-muted mt-2">
            We do not collect payment information, government IDs, or sensitive health data.
          </p>
        </Section>

        <Section id="how-we-use" title="3. How We Use Your Data">
          <p>Your data is used exclusively for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>To create and manage your KingMenu account</li>
            <li>To provide the meal planning, recipe browsing, and shopping list features</li>
            <li>To authenticate you securely via Google OAuth 2.0 or email/password</li>
            <li>To save and synchronize your preferences and meal plans across devices</li>
            <li>To improve the application and fix technical issues</li>
            <li>To comply with applicable legal obligations</li>
            <li>To send transactional communications (e.g. email verification) if applicable</li>
          </ul>
          <p>
            We do <strong>not</strong> use your data for advertising, behavioral profiling,
            automated decision-making with legal effects, or sale to third parties.
          </p>
        </Section>

        <Section id="legal-basis" title="4. Legal Basis for Processing (GDPR)">
          <p>
            If you are located in the European Economic Area (EEA), we process your personal data
            under the following legal bases as defined by the General Data Protection Regulation
            (GDPR — Regulation EU 2016/679):
          </p>
          <div className="space-y-2 mt-2">
            {[
              { basis: "Contract (Art. 6(1)(b))", desc: "Processing necessary to provide the KingMenu service you requested (account creation, meal planning, shopping lists)." },
              { basis: "Legitimate Interests (Art. 6(1)(f))", desc: "Security monitoring, fraud prevention, and improving the service — balanced against your rights." },
              { basis: "Consent (Art. 6(1)(a))", desc: "Where you explicitly consent, such as optional location-based features. You may withdraw consent at any time." },
              { basis: "Legal Obligation (Art. 6(1)(c))", desc: "Where we are required by law to retain or disclose data." },
            ].map(({ basis, desc }) => (
              <div key={basis} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="font-semibold text-content-title text-sm mb-1">{basis}</p>
                <p className="text-sm text-content-muted">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="data-sharing" title="5. Data Sharing & Third-Party Providers">
          <p>
            We do not sell, rent, or trade your personal data. We share limited data only
            with the following trusted service providers, strictly to operate the application:
          </p>
          <div className="space-y-2 mt-3">
            <Provider
              name="Supabase"
              url="https://supabase.com/privacy"
              role="Database, authentication, and backend API. Your account data, meal plans, and preferences are stored on Supabase servers (hosted on AWS). Supabase is GDPR-compliant and processes data under a Data Processing Agreement."
            />
            <Provider
              name="GitHub Pages (Microsoft)"
              url="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              role="Static file hosting for the KingMenu web application. GitHub Pages may collect visitor IP addresses and HTTP request logs as part of its standard hosting operations. KingMenu does not control this collection. See GitHub's Privacy Statement for details."
            />
            <Provider
              name="Google LLC (Google Sign-In / OAuth 2.0)"
              url="https://policies.google.com/privacy"
              role="Authentication only. When you sign in with Google, we receive your name and email address. We do not access your Gmail, Google Drive, Calendar, or any other Google service. Google's use of your data is governed by their Privacy Policy."
            />
            <Provider
              name="Google Fonts"
              url="https://developers.google.com/fonts/faq/privacy"
              role="Typography. Our application loads the Inter font from Google Fonts CDN, which may result in your IP address being logged by Google."
            />
          </div>
          <p className="text-sm text-content-muted mt-3">
            We may also disclose data if required by law, court order, or to protect the rights,
            property, or safety of KingMenu, our users, or the public.
          </p>
        </Section>

        <Section id="hosting" title="6. Hosting & Infrastructure">
          <p>
            KingMenu is hosted as a static web application on{" "}
            <strong>GitHub Pages</strong>, a service provided by GitHub, Inc. (a subsidiary of
            Microsoft Corporation). The application frontend (HTML, CSS, JavaScript) is served
            from GitHub's servers located in the United States.
          </p>
          <p>
            All application data (user accounts, meal plans, preferences) is stored on{" "}
            <strong>Supabase</strong>, which uses Amazon Web Services (AWS) infrastructure.
            Data is stored in the <strong>eu-central-1 (Frankfurt, Germany)</strong> region
            by default, ensuring data remains within the EEA for EU users where possible.
          </p>
          <p>
            The source code of KingMenu is publicly available on GitHub at{" "}
            <a href="https://github.com/kamel73-web/KingMenu" target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline inline-flex items-center gap-1">
              github.com/kamel73-web/KingMenu <ExternalLink className="h-3 w-3" />
            </a>.
            The public repository does not contain any personal user data.
          </p>
        </Section>

        <Section id="cookies" title="7. Cookies & Local Storage">
          <p>KingMenu uses the following storage mechanisms:</p>
          <div className="space-y-2 mt-2">
            {[
              {
                type: "Session Cookies (Supabase)",
                purpose: "Essential — used to maintain your authenticated session. Without these, you cannot remain logged in.",
                basis: "Strictly necessary — no consent required",
              },
              {
                type: "localStorage (browser)",
                purpose: "Used to remember your preferred language (e.g. 'fr', 'en') and certain UI preferences between sessions.",
                basis: "Legitimate interest / functionality",
              },
              {
                type: "GitHub Pages logs",
                purpose: "GitHub may set cookies or log HTTP requests as part of its hosting service. We do not control this.",
                basis: "Third-party — see GitHub's Cookie Policy",
              },
            ].map(({ type, purpose, basis }) => (
              <div key={type} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="font-semibold text-content-title text-sm mb-1">{type}</p>
                <p className="text-sm text-content-muted mb-1">{purpose}</p>
                <span className="inline-block text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                  {basis}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-content-muted mt-2">
            We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
            You may clear cookies and localStorage at any time via your browser settings.
          </p>
        </Section>

        <Section id="retention" title="8. Data Retention">
          <p>We retain your personal data for as long as your account is active or as needed to provide the service:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li><strong>Account data</strong> (name, email): Retained until you delete your account or request deletion.</li>
            <li><strong>Meal plans & preferences</strong>: Retained as long as your account exists.</li>
            <li><strong>Authentication tokens</strong>: Session tokens expire automatically (typically after 1 hour; refresh tokens after 7 days for inactive sessions).</li>
            <li><strong>Server logs</strong> (GitHub Pages, Supabase): Retained per their respective policies (typically 30–90 days).</li>
          </ul>
          <p>
            Upon account deletion, your personal data is permanently deleted from Supabase within
            30 days, except where retention is required by law.
          </p>
        </Section>

        <Section id="your-rights" title="9. Your Rights">
          <p>
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <div className="grid sm:grid-cols-2 gap-2 mt-2">
            {[
              { right: "Right of Access", desc: "Request a copy of all personal data we hold about you." },
              { right: "Right to Rectification", desc: "Request correction of inaccurate or incomplete data." },
              { right: "Right to Erasure", desc: "Request deletion of your data ('right to be forgotten')." },
              { right: "Right to Restriction", desc: "Request that we limit how we process your data." },
              { right: "Right to Portability", desc: "Receive your data in a structured, machine-readable format." },
              { right: "Right to Object", desc: "Object to processing based on legitimate interests." },
              { right: "Right to Withdraw Consent", desc: "Withdraw consent at any time where processing is consent-based." },
              { right: "Right to Lodge a Complaint", desc: "File a complaint with your national Data Protection Authority (e.g. CNIL in France, ICO in the UK)." },
            ].map(({ right, desc }) => (
              <div key={right} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="font-semibold text-content-title text-sm mb-0.5">{right}</p>
                <p className="text-xs text-content-muted">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-3">
            To exercise any of these rights, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-500 hover:underline">
              {CONTACT_EMAIL}
            </a>. We will respond within 30 days (GDPR) or 45 days (CCPA).
          </p>
          <p className="text-sm text-content-muted">
            <strong>California residents (CCPA/CPRA):</strong> You have the right to know what
            personal information is collected, to delete it, to opt-out of its sale (we do not
            sell personal data), and to non-discrimination for exercising these rights.
          </p>
        </Section>

        <Section id="children" title="10. Children's Privacy">
          <p>
            KingMenu is not directed to children under the age of <strong>13</strong> (or{" "}
            <strong>16</strong> in the European Union, per GDPR Article 8). We do not knowingly
            collect personal data from minors. If we become aware that we have inadvertently
            collected personal data from a child without verifiable parental consent, we will
            take steps to delete that information promptly.
          </p>
          <p>
            If you are a parent or guardian and believe your child has provided us with personal
            data, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-500 hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </Section>

        <Section id="security" title="11. Security">
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal data against unauthorized access, alteration, disclosure, or destruction:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>All data in transit is encrypted using TLS/HTTPS</li>
            <li>Supabase enforces Row-Level Security (RLS) policies ensuring users can only access their own data</li>
            <li>Passwords are never stored in plain text — authentication is handled by Supabase Auth using bcrypt hashing</li>
            <li>OAuth tokens (Google) are short-lived and never stored on our servers</li>
            <li>The application source code is reviewed regularly for security vulnerabilities</li>
            <li>GitHub Pages serves content over HTTPS with automatic certificate renewal</li>
          </ul>
          <p>
            No method of transmission over the Internet or electronic storage is 100% secure.
            While we strive to use commercially acceptable means to protect your data, we cannot
            guarantee absolute security. In the event of a data breach affecting your rights and
            freedoms, we will notify you in accordance with applicable law.
          </p>
        </Section>

        <Section id="international" title="12. International Data Transfers">
          <p>
            KingMenu is operated from Algeria and serves users internationally. Your data may be
            transferred to and processed in countries outside your country of residence, including
            the United States (GitHub — Microsoft) and the European Union (Supabase — AWS
            eu-central-1).
          </p>
          <p>
            For transfers of EEA data to the United States, we rely on appropriate safeguards
            including Standard Contractual Clauses (SCCs) as implemented by our service providers
            (Supabase, GitHub/Microsoft). These providers are certified under applicable data
            transfer frameworks.
          </p>
        </Section>

        <Section id="changes" title="13. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices, technology, legal requirements, or other factors. When we make material
            changes, we will update the "<strong>Last updated</strong>" date at the top of this
            page. We encourage you to review this policy periodically.
          </p>
          <p>
            Continued use of KingMenu after changes are posted constitutes your acceptance of
            the updated Privacy Policy. If changes are significant, we may provide additional
            notice (e.g. via email or an in-app notification).
          </p>
        </Section>

        <Section id="contact" title="14. Contact Us">
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or
            our data practices, please contact us:
          </p>
          <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl mt-3">
            <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-content-title text-sm">KingMenu Privacy Team</p>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary-500 hover:text-primary-700 hover:underline text-sm">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <p className="text-sm text-content-muted mt-3">
            We aim to respond to all privacy-related requests within <strong>30 days</strong>.
            For urgent matters or data breach notifications, please mark your email subject
            as <em>"URGENT — Privacy Request"</em>.
          </p>
        </Section>

        {/* Footer nav */}
        <div className="border-t border-neutral-200 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-content-muted">
          <span>© {new Date().getFullYear()} KingMenu. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/terms-of-use" className="text-primary-500 hover:underline">Terms of Use</Link>
            <Link to="/" className="text-primary-500 hover:underline">Back to App</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
