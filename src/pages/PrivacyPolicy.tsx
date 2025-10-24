// src/pages/PrivacyPolicy.tsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-6">Last updated: October 2, 2025</p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <p>
        We may collect personal identifiers (name, email), usage data (IP address,
        browser type), and third-party authentication data (Google, Facebook).
      </p>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p>
        We use your data to provide and secure our services, authenticate users,
        personalize experience, and comply with legal obligations.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Data Sharing</h2>
      <p>
        We do not sell your personal data. We may share limited data with service
        providers (Supabase, Netlify, Google, Facebook) or as required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. GDPR Rights</h2>
      <p>
        EU users have rights to access, correct, delete, restrict, or transfer
        their data, and to file a complaint with a Data Protection Authority.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. CCPA Rights</h2>
      <p>
        California residents may request data access, deletion, and opt-out of
        data sale (we do not sell personal data). Contact us to exercise these
        rights.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Cookies</h2>
      <p>
        We use cookies for authentication, security, and analytics. You may
        disable cookies in your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Security</h2>
      <p>
        We apply technical and organizational measures to protect your data
        against unauthorized access or misuse.
      </p>

      <h2 className="text-xl font-semibold mt-6">8. Children’s Privacy</h2>
      <p>
        Our services are not intended for children under 13 (or under 16 in the
        EU). We do not knowingly collect personal data from children.
      </p>

      <h2 className="text-xl font-semibold mt-6">9. Contact</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at:{" "}
        <a
          href="mailto:allogusto@gmail.com"
          className="text-blue-600 underline"
        >
          allogusto@gmail.com
        </a>
      </p>
    </div>
  );
}
