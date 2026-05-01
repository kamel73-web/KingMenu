import React, { useState } from "react";
import { supabase } from "../lib/supabase";

type DeletionType = "partial" | "full" | null;

const DeleteAccount: React.FC = () => {
  const [deletionType, setDeletionType] = useState<DeletionType>(null);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partialItems, setPartialItems] = useState({
    mealPlan: false,
    shoppingList: false,
    favorites: false,
    ingredients: false,
    preferences: false,
  });

  const handleSubmit = async () => {
    if (!email || !deletionType) return;
    setLoading(true);
    await supabase.from("deletion_requests").insert({
      email,
      reason,
      deletion_type: deletionType,
      partial_items: deletionType === "partial" ? partialItems : null,
      requested_at: new Date().toISOString(),
      status: "pending",
    });
    setLoading(false);
    setSubmitted(true);
  };

  const togglePartial = (key: keyof typeof partialItems) => {
    setPartialItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasPartialSelection = Object.values(partialItems).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-16">
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
            <h1 className="text-2xl font-black text-white mb-2">🗑️ Gestion de mes données</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Vous pouvez choisir de supprimer uniquement certaines données ou votre compte complet.
              Toute suppression sera effectuée dans un délai de <strong className="text-white">30 jours</strong>.
            </p>

            {/* Choix du type de suppression */}
            <div className="space-y-3 mb-8">

              {/* Option 1 — Suppression partielle */}
              <button
                onClick={() => setDeletionType("partial")}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  deletionType === "partial"
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-white/10 bg-gray-800 hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">🧹</span>
                  <span className="font-bold text-white">Supprimer certaines données</span>
                </div>
                <p className="text-gray-400 text-sm pl-8">
                  Conservez votre compte mais supprimez des données spécifiques (planning, favoris, liste de courses…)
                </p>
              </button>

              {/* Sous-options suppression partielle */}
              {deletionType === "partial" && (
                <div className="ml-4 space-y-2 bg-gray-800/50 rounded-2xl p-4 border border-amber-500/20">
                  <p className="text-amber-400 text-sm font-semibold mb-3">Sélectionnez les données à supprimer :</p>
                  {[
                    { key: "mealPlan",      label: "📅 Planning de repas" },
                    { key: "shoppingList",  label: "🛒 Listes de courses sauvegardées" },
                    { key: "favorites",     label: "❤️ Plats favoris" },
                    { key: "ingredients",   label: "🥕 Mes ingrédients disponibles" },
                    { key: "preferences",   label: "⚙️ Préférences alimentaires" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={partialItems[key as keyof typeof partialItems]}
                        onChange={() => togglePartial(key as keyof typeof partialItems)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Option 2 — Suppression complète */}
              <button
                onClick={() => setDeletionType("full")}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  deletionType === "full"
                    ? "border-red-500 bg-red-500/10"
                    : "border-white/10 bg-gray-800 hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">💣</span>
                  <span className="font-bold text-white">Supprimer mon compte et toutes mes données</span>
                </div>
                <p className="text-gray-400 text-sm pl-8">
                  Suppression définitive et irréversible de votre compte, email, planning, favoris et toutes vos données personnelles.
                </p>
              </button>

              {/* Détail suppression complète */}
              {deletionType === "full" && (
                <div className="ml-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <p className="text-red-400 font-semibold text-sm mb-2">⚠️ Données supprimées définitivement :</p>
                  <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                    <li>Compte et adresse email</li>
                    <li>Préférences alimentaires</li>
                    <li>Planning de repas</li>
                    <li>Listes de courses</li>
                    <li>Plats favoris</li>
                    <li>Ingrédients disponibles</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-red-500/20">
                    <p className="text-amber-400 text-sm">ℹ️ Non supprimé : les recettes et plats (données publiques)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Formulaire */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Adresse email du compte *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Raison (optionnel)</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Dites-nous pourquoi..."
                  rows={3}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  !email ||
                  !deletionType ||
                  (deletionType === "partial" && !hasPartialSelection) ||
                  loading
                }
                className={`w-full font-bold py-3 rounded-xl transition-colors disabled:bg-gray-700 disabled:text-gray-500 ${
                  deletionType === "full"
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-gray-950"
                }`}
              >
                {loading ? "Envoi en cours..." : deletionType === "full"
                  ? "Demander la suppression complète"
                  : "Demander la suppression des données sélectionnées"}
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
              Votre demande a bien été enregistrée et sera traitée dans un délai de{" "}
              <strong className="text-white">30 jours</strong>.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Pour toute question :{" "}
              <a href="mailto:support@kingmenu.app" className="text-amber-400 underline">
                support@kingmenu.app
              </a>
            </p>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-xs mt-8">
        © {new Date().getFullYear()} KingMenu —{" "}
        <a href="/KingMenu/privacy-policy.html" className="underline hover:text-gray-400">
          Politique de confidentialité
        </a>
      </p>
    </div>
  );
};

export default DeleteAccount;
