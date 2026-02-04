import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signInWithEmail, signUpWithEmail, supabase } from "../../lib/supabase";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import toast from "react-hot-toast";
import { Capacitor } from '@capacitor/core';

export default function LoginForm() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsLoading(true);
    try {
      const result = isLogin
        ? await signInWithEmail(formData.email, formData.password)
        : await signUpWithEmail(formData.email, formData.password, {
            full_name: formData.name,
          });
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      toast.success(isLogin ? "Connexion réussie" : "Compte créé avec succès");
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    try {
      const isNative = Capacitor.isNativePlatform();
      const redirectTo = isNative
        ? 'com.kingmenu.app://'           // ← MODIFIEZ ICI avec votre vrai scheme (capacitor.config.ts → appId)
        : window.location.origin + '/welcome';

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Erreur OAuth:", err);
      toast.error(t('auth.socialError') || 'Erreur lors de la connexion sociale');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 bg-gray-50 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 ${isLogin ? "bg-orange-500 text-white" : "text-gray-600"}`}
            >
              {t("auth.login") || "Connexion"}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 ${!isLogin ? "bg-orange-500 text-white" : "text-gray-600"}`}
            >
              {t("auth.signUp") || "Inscription"}
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Nom complet"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg"
              />
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text" // ← changé en text pour éviter l'autofill password sur certains navigateurs mobiles
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg"
            >
              {isLoading ? "..." : isLogin ? "Connexion" : "Créer un compte"}
            </button>
          </form>
          <div className="my-6 text-center text-gray-400">
            {t("auth.orContinueWith") || "ou continuer avec"}
          </div>
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full border py-2 rounded-lg"
          >
            Continuer avec Google
          </button>
        </div>
      </div>
    </div>
  );
}
