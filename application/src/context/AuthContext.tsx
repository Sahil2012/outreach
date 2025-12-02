import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isOnboarded: boolean;
  checkOnboardingStatus: () => Promise<void>;
  signIn: () => void;
  signUp: () => void;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const { getToken, isLoaded: isAuthLoaded } = useClerkAuth();

  // In a real app, this would be fetched from the backend
  // For now, we'll assume true if they have a "completedProfile" metadata or similar
  // Or we can mock it. Let's mock it to false initially for new users logic if we could detect it,
  // but for this task, let's use a simple state or check user metadata.
  // actually, let's just use a state that we can toggle for testing, or check a user attribute.
  // The user said "use profile service". I'll add a placeholder function.
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isProfileStatusLoaded, setIsProfileStatusLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setIsOnboarded(false);
      setIsProfileStatusLoaded(true);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      // TODO: Replace with actual API call
      // const token = await getToken();
      // const response = await axios.get('http://localhost:3000/profile/status', { headers: { Authorization: `Bearer ${token}` } });
      // setIsOnboarded(response.data.isOnboarded);

      // Mock logic: Check if user has First & Last name as a proxy for "Basic Info"
      // and maybe some metadata for "Professional Info". 
      // For now, let's assume if they have a name, they are partially onboarded, 
      // but let's stick to the plan of a specific flag.
      // Let's mock it to TRUE for now to not break existing flow until we implement the backend,
      // OR check a specific publicMetadata field if we were using Clerk metadata.

      // For the purpose of this task, I will mock it to FALSE if the user is missing name, 
      // otherwise TRUE, to simulate the flow.
      // actually, the user wants the flow: Signup -> Complete Profile.
      // So new users won't have a name potentially? Clerk signup usually asks for it?
      // Let's check if `user.unsafeMetadata.onboardingComplete` is true.

      if (user?.unsafeMetadata?.onboardingComplete) {
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error("Failed to check onboarding status", error);
      setIsOnboarded(false);
    } finally {
      setIsProfileStatusLoaded(true);
    }
  };

  const loading = !isUserLoaded || !isAuthLoaded || !isProfileStatusLoaded;

  const signIn = () => openSignIn();
  const signUp = () => openSignUp();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOnboarded,
        checkOnboardingStatus,
        signIn,
        signUp,
        signOut: async () => await signOut(),
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
