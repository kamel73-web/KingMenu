import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

const DeleteAccount: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRTL = i18n.language === "ar";

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    // Envoie une demande de suppression dans Supabase
    await supabase.from("deletion_requests").insert({
      email,
      reason,
      requested_at: new Date().toISOString(),
      status: "pending",
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 py-16"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-lg w-full bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src="https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/logo%20KM.jpg"
            alt="KingMenu"
            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'contain', background: 'white', border: '2px solid #f59e0b' }}
          />
          <span className="font-black text-2xl text-white" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
            KingMenu
          </span>
        </div>

        {!submitted ? (
          <>
            <h1 className="text-2xl font-black text-white mb-2">
              🗑️ Suppression de compte
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Vous pouvez demander la suppression de votre compte et de toutes vos données personnelles associées (profil, préférences, planning de repas, listes de courses). La suppression sera effectuée dans un délai de <strong className="text-white">30 jours</strong>.
            </p>

            {/* Données supprimées */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
              <p className="text-red-400 font-semibold text-sm mb-2">⚠️ Données qui seront supprimées :</p>
              <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                <li>Votre compte et adresse email</li>
                <li>Vos préférences alimentaires</li>
                <li>Votre planning de repas</li>
                <li>Vos listes de courses sauvegardées</li>
                <li>Vos plats favoris</li>
                <li>Vos ingrédients disponibles</li>
              </ul>
            </div>

            {/* Données conservées */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6">
              <p className="text-amber-400 font-semibold text-sm mb-2">ℹ️ Données conservées :</p>
              <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                <li>Les recettes et plats (données publiques non personnelles)</li>
              </ul>
            </div>

            {/* Formulaire */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Adresse email du compte *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Raison (optionnel)
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Dites-nous pourquoi vous souhaitez supprimer votre compte..."
                  rows={3}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!email || loading}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? "Envoi en cours..." : "Demander la suppression de mon compte"}
              </button>
              <p className="text-gray-600 text-xs text-center">
                Vous recevrez une confirmation par email dans les 24h.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-white mb-3">Demande reçue</h2>
            <p className="text-gray-400 leading-relaxed">
              Votre demande de suppression a bien été enregistrée. Votre compte et toutes vos données seront supprimés dans un délai de <strong className="text-white">30 jours</strong>.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Pour toute question : <a href="mailto:support@kingmenu.app" className="text-amber-400 underline">support@kingmenu.app</a>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-xs mt-8">
        © {new Date().getFullYear()} KingMenu — <a href="/KingMenu/privacy-policy.html" className="underline hover:text-gray-400">Politique de confidentialité</a>
      </p>
    </div>
  );
};

export default DeleteAccount;
