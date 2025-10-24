// src/pages/TermsOfUse.tsx
import React from "react";

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p className="mb-6">Last updated: October 2, 2025</p>

      <h2 className="text-xl font-semibold mt-6">1. Acceptance</h2>
      <p>
        By using our services, you agree to these Terms and confirm you are at
        least 13 years old (16 in the EU).
      </p>

      <h2 className="text-xl font-semibold mt-6">2. User Responsibilities</h2>
      <p>
        You agree to comply with laws, provide accurate information, avoid
        fraudulent or harmful activities, and keep your credentials secure.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Intellectual Property</h2>
      <p>
        All content and software belong to us or our licensors. You may not copy,
        distribute, or modify content without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Third-Party Services</h2>
      <p>
        Our service integrates providers like Google, Facebook, Supabase, and
        Netlify. We are not responsible for their availability, accuracy, or
        privacy practices.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Limitation of Liability</h2>
      <p>
        We are not liable for data loss, service interruptions, or indirect
        damages to the extent permitted by law.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these Terms or misuse
        the service.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Changes</h2>
      <p>
        We may update these Terms. Continued use after changes means you accept
        the updated Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6">8. Governing Law</h2>
      <p>
        These Terms are governed by the applicable laws of the jurisdiction where
        our service is operated.
      </p>

      <h2 className="text-xl font-semibold mt-6">9. Contact</h2>
      <p>
        If you have questions about these Terms, contact us at:{" "}
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
