// src/components/Auth/LoginForm.tsx
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signInWithEmail, signUpWithEmail, supabase } from "../../lib/supabase";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import toast from "react-hot-toast";
import { Capacitor } from "@capacitor/core";

export default function LoginForm() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  /* =========================
     EMAIL / PASSWORD
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      const msg = t("auth.fillAllFields");
      setError(msg);
      toast.error(msg);
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
        setError(result.error.message);
        toast.error(result.error.message);
        return;
      }

      toast.success(
        isLogin ? t("auth.loginSuccess") : t("auth.signUpSuccess")
      );
    } catch (err: any) {
      const msg = err?.message || t("auth.unknownError");
      setError(msg);
      toast.error(msg);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     GOOGLE OAUTH — VERSION CORRECTE
  ========================= */
  const handleSocialLogin = async (provider: "google") => {
    try {
      setError(null);
      setIsLoading(true);

      const isNative = Capacitor.isNativePlatform();
      let redirectTo: string;

      if (isNative) {
        // Mobile (Capacitor)
        redirectTo = "app.kingmenu://";
      } else {
        // ✅ IMPORTANT : route hash valide pour HashRouter
        redirectTo =
          window.location.origin + "/KingMenu/#/login";
      }

      console.log("[OAuth Debug] redirectTo:", redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setError(error.message);
        toast.error(t("auth.googleError", { message: error.message }));
        console.error("OAuth error:", error);
      }

      // ⚠️ PAS de setSession manuel ici
      // Supabase gère le hash automatiquement
      // AppContext captera la session au reload

    } catch (err: any) {
      const msg = err?.message || t("auth.googleConnectionError");
      setError(msg);
      toast.error(msg);
      console.error("OAuth fatal error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Switch */}
          <div className="flex mb-6 bg-gray-50 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-medium ${
                isLogin ? "bg-orange-500 text-white" : "text-gray-600"
              }`}
            >
              {t("auth.login")}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-medium ${
                !isLogin ? "bg-orange-500 text-white" : "text-gray-600"
              }`}
            >
              {t("auth.signUp")}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder={t("auth.fullName")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            )}

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder={t("auth.email")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.password")}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-medium ${
                isLoading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isLoading
                ? t("auth.loading")
                : isLogin
                ? t("auth.login")
                : t("auth.signUp")}
            </button>
          </form>

          <div className="my-6 text-center text-gray-500">
            {t("auth.orContinueWith")}
          </div>

          <button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            className="w-full border border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            {t("auth.continueWithGoogle")}
          </button>
        </div>
      </div>
    </div>
  );
}
