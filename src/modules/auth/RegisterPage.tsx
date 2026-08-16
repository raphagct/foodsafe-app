import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { t, getLanguage, type LanguageCode } from '../../utils/i18n';
import LanguageButton from '../../components/LanguageButton';

/**
 * Maps Supabase signup error messages to i18n translation keys.
 */
function getRegisterErrorMessage(error: Error, lang: LanguageCode): string {
  const msg = (error.message ?? '').toLowerCase();
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return t('userAlreadyExists', lang);
  }
  if (msg.includes('password') && (msg.includes('least') || msg.includes('short') || msg.includes('characters'))) {
    return t('passwordTooShort', lang);
  }
  if (msg.includes('valid') && msg.includes('email')) {
    return t('emailInvalid', lang);
  }
  // Fallback: show the actual Supabase message for unknown errors
  return error.message || t('registerError', lang);
}

/**
 * Basic email format validation.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signUp } = useAuth();
  const history = useHistory();
  const lang = getLanguage();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Client-side validation ---
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMessage(t('allFieldsRequired', lang));
      setShowError(true);
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErrorMessage(t('emailInvalid', lang));
      setShowError(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t('passwordTooShort', lang));
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('passwordMismatch', lang));
      setShowError(true);
      return;
    }

    // --- Supabase signup ---
    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrorMessage(getRegisterErrorMessage(error, lang));
      setShowError(true);
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        history.replace('/login');
      }, 2500);
    }
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 30%, #ffffff 100%)' } as React.CSSProperties}
      >
        <div className="flex flex-col items-center justify-center min-h-full p-6 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-15 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(21,153,71,0.06)_0%,transparent_70%)] pointer-events-none z-0" />
          <div className="absolute -bottom-20 -left-15 w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(21,153,71,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

          {/* Language Selector */}
          <div className="absolute right-6 z-20" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}>
            <LanguageButton />
          </div>

          {/* Card */}
          <div className="w-full max-w-[420px] bg-white/85 backdrop-blur-[20px] rounded-3xl px-7 pt-10 pb-8 shadow-[0_8px_32px_rgba(21,153,71,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(21,153,71,0.1)] relative z-10 animate-auth-slide-up">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="text-4xl font-extrabold tracking-tight leading-none">
                <span className="text-[var(--color-text)]">{t('appNameFood', lang)}</span>
                <span className="text-[var(--color-primary)]">{t('appNameSafe', lang)}</span>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-2 font-normal">
                {t('registerTitle', lang)}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister}>
              <div className="mb-5">
                <IonInput
                  type="email"
                  placeholder={t('email', lang)}
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                  fill="outline"
                  mode="md"
                  style={{
                    '--border-radius': '14px',
                    '--highlight-color-focused': 'var(--color-primary)',
                    '--placeholder-color': 'var(--color-text-secondary)',
                    minHeight: '52px',
                    fontSize: '15px',
                  } as React.CSSProperties}
                />
              </div>

              <div className="mb-5">
                <IonInput
                  type="password"
                  placeholder={t('password', lang)}
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                  fill="outline"
                  mode="md"
                  style={{
                    '--border-radius': '14px',
                    '--highlight-color-focused': 'var(--color-primary)',
                    '--placeholder-color': 'var(--color-text-secondary)',
                    minHeight: '52px',
                    fontSize: '15px',
                  } as React.CSSProperties}
                />
              </div>

              <div className="mb-5">
                <IonInput
                  type="password"
                  placeholder={t('confirmPassword', lang)}
                  value={confirmPassword}
                  onIonInput={(e) => setConfirmPassword(e.detail.value ?? '')}
                  fill="outline"
                  mode="md"
                  style={{
                    '--border-radius': '14px',
                    '--highlight-color-focused': 'var(--color-primary)',
                    '--placeholder-color': 'var(--color-text-secondary)',
                    minHeight: '52px',
                    fontSize: '15px',
                  } as React.CSSProperties}
                />
              </div>

              <IonButton
                expand="block"
                type="submit"
                disabled={loading}
                style={{
                  '--background': 'var(--color-primary)',
                  '--background-hover': '#128a3e',
                  '--background-activated': '#0f7a36',
                  '--border-radius': '14px',
                  '--box-shadow': '0 4px 14px rgba(21, 153, 71, 0.3)',
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textTransform: 'none',
                  marginTop: '8px',
                } as React.CSSProperties}
              >
                {loading ? <IonSpinner name="crescent" /> : t('registerButton', lang)}
              </IonButton>
            </form>

            {/* Link to Login */}
            <div className="flex items-center justify-center gap-1 mt-6 text-sm">
              <span className="text-[var(--color-text-secondary)]">{t('hasAccount', lang)}</span>
              <span
                className="text-[var(--color-primary)] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => history.push('/login')}
              >
                {t('loginButton', lang)}
              </span>
            </div>
          </div>
        </div>

        <IonToast
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          message={errorMessage}
          duration={4000}
          position="top"
          color="danger"
        />

        <IonToast
          isOpen={showSuccess}
          onDidDismiss={() => setShowSuccess(false)}
          message={t('registerSuccess', lang)}
          duration={3000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
}

export default RegisterPage;
