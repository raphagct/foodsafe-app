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
 * Maps Supabase auth error messages to i18n translation keys.
 */
function getLoginErrorMessage(error: Error, lang: LanguageCode): string {
  const msg = (error.message ?? '').toLowerCase();
  if (msg.includes('email not confirmed')) return t('emailNotConfirmed', lang);
  if (msg.includes('invalid login credentials')) return t('loginError', lang);
  if (msg.includes('invalid email')) return t('emailInvalid', lang);
  return t('loginError', lang);
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const history = useHistory();
  const lang = getLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!email.trim() || !password) {
      setErrorMessage(t('allFieldsRequired', lang));
      setShowError(true);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrorMessage(getLoginErrorMessage(error, lang));
      setShowError(true);
    } else {
      history.replace('/tabs/home');
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
                {t('loginTitle', lang)}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
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
                {loading ? <IonSpinner name="crescent" /> : t('loginButton', lang)}
              </IonButton>
            </form>

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">ou</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <IonButton
              expand="block"
              onClick={async () => {
                setLoading(true);
                const { error } = await signInWithGoogle();
                setLoading(false);
                if (error) {
                  setErrorMessage(getLoginErrorMessage(error, lang));
                  setShowError(true);
                }
              }}
              disabled={loading}
              fill="outline"
              style={{
                '--border-radius': '14px',
                '--border-color': '#e2e8f0',
                '--color': '#334155',
                height: '52px',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'none',
              } as React.CSSProperties}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                <span>Continuer avec Google</span>
              </div>
            </IonButton>

            {/* Link to Register */}
            <div className="flex items-center justify-center gap-1 mt-6 text-sm">
              <span className="text-[var(--color-text-secondary)]">{t('noAccount', lang)}</span>
              <span
                className="text-[var(--color-primary)] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => history.push('/register')}
              >
                {t('registerButton', lang)}
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
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;
