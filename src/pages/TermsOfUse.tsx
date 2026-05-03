// src/pages/TermsOfUse.tsx
import { Link } from "react-router-dom";
import { FileText, Mail, ExternalLink } from "lucide-react";

const LAST_UPDATED = "April 25, 2026";
const CONTACT_EMAIL = "kingmenu.app@gmail.com";
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

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-background-page">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 shadow-soft">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-secondary-500" />
            </div>
            <Link to="/" className="text-content-muted text-sm hover:text-primary-500 transition-colors">
              ← KingMenu
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-content-title mb-2">Terms of Use</h1>
          <p className="text-content-muted text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong> · Please read carefully before using KingMenu
          </p>
          <div className="mt-4 p-4 bg-secondary-50 border border-secondary-100 rounded-xl text-sm text-secondary-700">
            <strong>Important:</strong> By accessing or using KingMenu at{" "}
            <a href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="underline inline-flex items-center gap-1">
              {APP_URL} <ExternalLink className="h-3 w-3" />
            </a>{" "}
            you agree to be bound by these Terms of Use. If you do not agree, please do not use the application.
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
              ["#acceptance", "1. Acceptance of Terms"],
              ["#description", "2. Description of Service"],
              ["#eligibility", "3. Eligibility"],
              ["#account", "4. User Account"],
              ["#acceptable-use", "5. Acceptable Use"],
              ["#content", "6. User Content"],
              ["#ip", "7. Intellectual Property"],
              ["#third-party", "8. Third-Party Services"],
              ["#hosting", "9. Hosting & Availability"],
              ["#disclaimer", "10. Disclaimer of Warranties"],
              ["#liability", "11. Limitation of Liability"],
              ["#termination", "12. Termination"],
              ["#governing-law", "13. Governing Law & Disputes"],
              ["#changes", "14. Changes to Terms"],
              ["#contact", "15. Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-primary-500 hover:text-primary-700 hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <Section id="acceptance" title="1. Acceptance of Terms">
          <p>
            By accessing, browsing, or using the KingMenu application (the "<strong>Service</strong>"),
            available at{" "}
            <a href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="text-primary-500 hover:underline">
              {APP_URL}
            </a>
            , you acknowledge that you have read, understood, and agree to be bound by these
            Terms of Use ("<strong>Terms</strong>") and our{" "}
            <Link to="/privacy-policy" className="text-primary-500 hover:underline">Privacy Policy</Link>,
            which is incorporated herein by reference.
          </p>
          <p>
            If you are using the Service on behalf of an organization, you represent that you have
            the authority to bind that organization to these Terms.
          </p>
        </Section>

        <Section id="description" title="2. Description of Service">
          <p>
            KingMenu is a meal planning web application that allows users to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>Browse and discover recipes from a curated database</li>
            <li>Select dishes and create weekly meal plans</li>
            <li>Manage personal ingredient inventories</li>
            <li>Automatically generate shopping lists based on selected dishes</li>
            <li>Save favorite recipes and access them across devices</li>
            <li>Use their available ingredients to find matching recipes</li>
          </ul>
          <p>
            The Service is provided free of charge. We reserve the right to introduce premium
            features, modify the Service, or discontinue it at any time with reasonable notice.
          </p>
        </Section>

        <Section id="eligibility" title="3. Eligibility">
          <p>
            To use KingMenu, you must be:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>At least <strong>13 years old</strong> (or the minimum age in your country)</li>
            <li>At least <strong>16 years old</strong> if you are located in the European Union (per GDPR Article 8)</li>
            <li>Legally capable of entering into a binding agreement in your jurisdiction</li>
          </ul>
          <p>
            If you are under the required age, you may only use KingMenu with the verifiable
            consent of a parent or legal guardian, who accepts these Terms on your behalf.
            We reserve the right to terminate accounts of users who do not meet these requirements.
          </p>
        </Section>

        <Section id="account" title="4. User Account">
          <p>
            To access certain features of KingMenu, you must create an account. You may register
            using an email address and password, or via <strong>Google Sign-In (OAuth 2.0)</strong>.
          </p>
          <p>You agree to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your account information as necessary</li>
            <li>Keep your login credentials confidential and not share them with third parties</li>
            <li>Notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary-500 hover:underline">{CONTACT_EMAIL}</a> of any unauthorized access or security breach</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <p>
            One person may not maintain more than one account. Accounts created for the purpose
            of circumvention, abuse, or misrepresentation will be terminated without notice.
          </p>
        </Section>

        <Section id="acceptable-use" title="5. Acceptable Use Policy">
          <p>
            You agree to use KingMenu only for lawful purposes and in a manner consistent with
            these Terms. You must <strong>not</strong>:
          </p>
          <div className="space-y-2 mt-2">
            {[
              { cat: "Illegal Activities", desc: "Use the Service for any unlawful purpose or in violation of any applicable local, national, or international law or regulation." },
              { cat: "Abuse & Harassment", desc: "Harass, threaten, defame, or harm other users or any third party." },
              { cat: "Security Violations", desc: "Attempt to gain unauthorized access to any part of the Service, its servers, or connected databases. Probe, scan, or test the vulnerability of the Service without explicit written permission." },
              { cat: "Data Scraping", desc: "Use bots, scrapers, crawlers, or automated tools to extract data from the Service without prior written consent." },
              { cat: "Impersonation", desc: "Impersonate any person, entity, or KingMenu, or misrepresent your affiliation." },
              { cat: "Malware", desc: "Upload, transmit, or distribute viruses, malware, or any code designed to interfere with the Service or users' devices." },
              { cat: "Overloading", desc: "Take any action that imposes an unreasonable load on the Service's infrastructure, including DDoS attacks." },
            ].map(({ cat, desc }) => (
              <div key={cat} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="font-semibold text-content-title text-sm mb-0.5">{cat}</p>
                <p className="text-sm text-content-muted">{desc}</p>
              </div>
            ))}
          </div>
          <p>
            Violation of this Acceptable Use Policy may result in immediate suspension or
            termination of your account.
          </p>
        </Section>

        <Section id="content" title="6. User Content">
          <p>
            KingMenu allows you to create and store personal content such as meal plans,
            shopping lists, and ingredient preferences ("<strong>User Content</strong>").
          </p>
          <p>
            You retain full ownership of your User Content. By using the Service, you grant
            KingMenu a limited, non-exclusive, royalty-free license to store and process your
            User Content solely to provide you with the Service.
          </p>
          <p>You represent and warrant that your User Content:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>Does not infringe any intellectual property, privacy, or other rights of third parties</li>
            <li>Does not contain unlawful, offensive, or harmful material</li>
            <li>Complies with all applicable laws</li>
          </ul>
          <p>
            We do not review or moderate User Content, but we reserve the right to remove
            content that violates these Terms.
          </p>
        </Section>

        <Section id="ip" title="7. Intellectual Property">
          <p>
            The KingMenu application, including its design, source code, logo, interface,
            text, graphics, and all related materials (collectively, "<strong>KingMenu Content</strong>"),
            are the property of KingMenu and are protected by copyright, trademark, and other
            intellectual property laws.
          </p>
          <p>
            The source code of KingMenu is publicly available on GitHub under its applicable
            license. Access to the source code does not grant permission to use the KingMenu
            name, logo, or brand assets without prior written consent.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable, revocable license to
            access and use the Service for personal, non-commercial purposes only.
          </p>
          <p>
            You may <strong>not</strong>: copy, modify, distribute, sell, sublicense, or create
            derivative works of KingMenu Content; reverse engineer or decompile the application;
            or remove any copyright or proprietary notices.
          </p>
        </Section>

        <Section id="third-party" title="8. Third-Party Services">
          <p>
            KingMenu integrates and depends on third-party services to function. These include:
          </p>
          <div className="space-y-2 mt-2">
            {[
              { name: "Supabase", role: "Database, authentication, and backend API" },
              { name: "GitHub Pages (Microsoft)", role: "Web application hosting" },
              { name: "Google LLC (OAuth 2.0)", role: "Sign-In authentication" },
              { name: "Google Fonts", role: "Typography (Inter font)" },
            ].map(({ name, role }) => (
              <div key={name} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div>
                  <p className="font-semibold text-content-title text-sm">{name}</p>
                  <p className="text-sm text-content-muted">{role}</p>
                </div>
              </div>
            ))}
          </div>
          <p>
            These providers have their own terms of service and privacy policies. Your use of
            their services (e.g. Google Sign-In) is also subject to their terms. KingMenu is
            not responsible for the availability, accuracy, security, or practices of these
            third-party services. Any disruption or failure of these services may affect
            your ability to use KingMenu.
          </p>
        </Section>

        <Section id="hosting" title="9. Hosting & Service Availability">
          <p>
            KingMenu is hosted as a static application on <strong>GitHub Pages</strong>, a free
            hosting service provided by GitHub, Inc. (Microsoft). The availability of the Service
            therefore depends on GitHub Pages' uptime and policies.
          </p>
          <p>
            We do not guarantee that the Service will be available at all times, uninterrupted,
            or free of errors. We reserve the right to perform maintenance, apply updates, or
            modify the Service at any time without prior notice.
          </p>
          <p>
            GitHub may modify or discontinue GitHub Pages at any time. In such an event, we will
            make reasonable efforts to migrate the Service to an alternative hosting provider.
          </p>
        </Section>

        <Section id="disclaimer" title="10. Disclaimer of Warranties">
          <p>
            The Service is provided on an "<strong>AS IS</strong>" and "<strong>AS AVAILABLE</strong>"
            basis, without any warranties of any kind, either express or implied, including but
            not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>Implied warranties of merchantability or fitness for a particular purpose</li>
            <li>Warranties that the Service will be uninterrupted, error-free, or free of viruses</li>
            <li>Warranties regarding the accuracy, completeness, or reliability of any content, recipes, or nutritional information provided through the Service</li>
          </ul>
          <p>
            Nutritional and caloric information provided in KingMenu is for informational purposes
            only and does not constitute medical or dietary advice. Always consult a qualified
            health professional before making significant dietary changes.
          </p>
        </Section>

        <Section id="liability" title="11. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, KingMenu and its developers shall
            not be liable for any indirect, incidental, special, consequential, or punitive
            damages arising from:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>Your use of or inability to use the Service</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Loss of data, meal plans, or preferences</li>
            <li>Interruption or failure of third-party services (GitHub Pages, Supabase, Google)</li>
            <li>Errors or inaccuracies in recipe or nutritional information</li>
          </ul>
          <p>
            In jurisdictions that do not allow the exclusion of certain warranties or limitation
            of liability, our liability shall be limited to the maximum extent permitted by law.
          </p>
          <p>
            Nothing in these Terms limits our liability for death or personal injury caused by
            negligence, fraud, or any other liability that cannot be excluded by law.
          </p>
        </Section>

        <Section id="termination" title="12. Termination">
          <p>
            We reserve the right to suspend or permanently terminate your account and access to
            the Service, at our sole discretion, without notice or liability, if:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            <li>You breach any provision of these Terms</li>
            <li>You engage in fraudulent, abusive, or illegal activity</li>
            <li>Continued provision of the Service to you is no longer commercially or technically feasible</li>
          </ul>
          <p>
            You may delete your account at any time by contacting us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-500 hover:underline">
              {CONTACT_EMAIL}
            </a>. Upon account deletion, your personal data will be removed in accordance with
            our Privacy Policy.
          </p>
          <p>
            Sections 7 (Intellectual Property), 10 (Disclaimer), 11 (Limitation of Liability),
            and 13 (Governing Law) shall survive any termination of these Terms.
          </p>
        </Section>

        <Section id="governing-law" title="13. Governing Law & Dispute Resolution">
          <p>
            These Terms shall be governed by and construed in accordance with applicable
            international law, with particular reference to the laws applicable in the
            jurisdiction of the developer's residence, to the extent permitted by law.
          </p>
          <p>
            For users in the <strong>European Union</strong>: You may benefit from mandatory
            consumer protection provisions of the law of your country of residence that cannot
            be derogated from by contract. Nothing in these Terms affects your rights as a
            consumer under applicable EU law, including the right to bring proceedings before
            the courts of your country of residence.
          </p>
          <p>
            We encourage you to contact us first to resolve any disputes informally. For unresolved
            disputes, EU users may access the European Commission's Online Dispute Resolution
            (ODR) platform at{" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
              className="text-primary-500 hover:underline inline-flex items-center gap-1">
              ec.europa.eu/consumers/odr <ExternalLink className="h-3 w-3" />
            </a>.
          </p>
        </Section>

        <Section id="changes" title="14. Changes to Terms">
          <p>
            We reserve the right to modify these Terms of Use at any time. We will notify users
            of material changes by updating the "<strong>Last updated</strong>" date at the top
            of this page. For significant changes, we may also provide in-app notifications.
          </p>
          <p>
            Your continued use of the Service after changes are posted constitutes your acceptance
            of the revised Terms. If you do not agree to the new Terms, you must stop using the
            Service and may request account deletion.
          </p>
        </Section>

        <Section id="contact" title="15. Contact">
          <p>
            If you have any questions, concerns, or legal inquiries regarding these Terms of Use,
            please contact us:
          </p>
          <div className="flex items-center gap-3 p-4 bg-secondary-50 border border-secondary-100 rounded-xl mt-3">
            <Mail className="h-5 w-5 text-secondary-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-content-title text-sm">KingMenu Legal</p>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary-500 hover:text-primary-700 hover:underline text-sm">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <p className="text-sm text-content-muted mt-3">
            We aim to respond to all legal inquiries within <strong>30 days</strong>.
          </p>
        </Section>

        {/* Footer nav */}
        <div className="border-t border-neutral-200 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-content-muted">
          <span>© {new Date().getFullYear()} KingMenu. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-primary-500 hover:underline">Privacy Policy</Link>
            <Link to="/" className="text-primary-500 hover:underline">Back to App</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
