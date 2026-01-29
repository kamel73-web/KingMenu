// src/components/Auth/LoginForm.tsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { signInWithEmail, signUpWithEmail, supabase } from '../../lib/supabase';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const { dispatch } = useApp();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      let result;

      if (isLogin) {
        result = await signInWithEmail(formData.email, formData.password);
      } else {
        result = await signUpWithEmail(formData.email, formData.password, {
          full_name: formData.name,
        });
      }

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.data.user) {
        const user = {
          id: result.data.user.id,
          email: result.data.user.email || formData.email,
          name: result.data.user.user_metadata?.full_name || formData.name || 'User',
          location: '', // supprimé la localisation par défaut
          preferences: [],
          dislikedIngredients: [],
          ownedIngredients: [],
        };

        dispatch({ type: 'SET_USER', payload: user });
        toast.success(`${isLogin ? 'Connexion réussie' : 'Compte créé avec succès !'}`);
      }
    } catch (error) {
      console.error('Erreur authentification:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        redirectTo: window.location.origin,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Une erreur inattendue est survenue');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 text-gray-800 p-4">
      <div className="max-w-md w-full">
        {/* Sélecteur de langue */}
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>

        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl mb-4 relative bg-gradient-to-tr from-yellow-100 via-amber-100 to-yellow-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent mix-blend-overlay"></div>
            <div className="absolute inset-0 ring-1 ring-amber-300/30 rounded-2xl"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-12 h-12 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
            >
              <defs>
                <radialGradient id="goldContrast" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fff9c4" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </radialGradient>
              </defs>
              <path
                fill="url(#goldContrast)"
                d="M64 384h384l-32-224-96 96-64-128-64 128-96-96-32 224zm96 32h192v32H160v-32z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('auth.welcomeTitle') || 'Bienvenue sur King Menu!'}
          </h1>
          <p className="text-gray-600">
            {t('brand.tagline') || 'Planifiez. Cuisinez. Savourez.'}
          </p>
        </div>

        {/* Carte principale */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex mb-6 bg-gray-50 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 font-medium transition-all ${
                isLogin ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('auth.login') || 'Connexion'}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 font-medium transition-all ${
                !isLogin ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('auth.signUp') || 'Inscription'}
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.fullName') || 'Nom complet'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('auth.fullNamePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email') || 'Adresse email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password') || 'Mot de passe'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Bouton principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex justify-center"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : isLogin ? (
                t('auth.login') || 'Connexion'
              ) : (
                t('auth.createAccount') || 'Créer un compte'
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-gray-400 text-sm">
              {t('auth.orContinueWith') || 'ou continuer avec'}
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Bouton Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg font-medium transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#EA4335"
                d="M24 9.5c3.35 0 6.34 1.16 8.71 3.45l6.46-6.46C35.43 2.69 29.99 0 24 0 14.72 0 6.78 5.36 2.73 13.16l7.52 5.84C12.25 13.09 17.69 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.55c0-1.6-.14-3.13-.4-4.55H24v9.01h12.45c-.54 2.77-2.13 5.12-4.54 6.69l7.13 5.56c4.16-3.84 6.46-9.51 6.46-16.71z"
              />
              <path
                fill="#4A90E2"
                d="M9.08 28.31c-.55-1.63-.85-3.37-.85-5.16 0-1.79.3-3.52.85-5.15L1.56 12.16A23.9 23.9 0 0 0 0 23.15c0 3.81.88 7.41 2.43 10.64l6.65-5.48z"
              />
              <path
                fill="#FBBC05"
                d="M24 48c6.48 0 11.93-2.14 15.9-5.79l-7.13-5.56c-2.03 1.36-4.63 2.15-8.77 2.15-6.31 0-11.75-3.59-14.77-8.9l-7.52 5.84C6.78 42.64 14.72 48 24 48z"
              />
            </svg>
            <span className="text-gray-700 text-sm font-medium">Continuer avec Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
