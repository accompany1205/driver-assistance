import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { firebaseApp } from '../lib/firebase';
import type { User } from '../types/user';

const auth = getAuth(firebaseApp);

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends State {
  platform: 'Firebase';
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

enum ActionType {
  AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED'
}

type AuthStateChangedAction = {
  type: ActionType.AUTH_STATE_CHANGED;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type Action = AuthStateChangedAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const reducer = (state: State, action: Action): State => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
};

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'Firebase',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      // Here you should extract the complete user profile to make it available in your entire app.
      // The auth state only provides basic information.
      dispatch({
        type: ActionType.AUTH_STATE_CHANGED,
        payload: {
          isAuthenticated: true,
          user: {
            id: user.uid,
            avatar: user.photoURL || undefined,
            email: user.email || 'anika.visser@devias.io',
            name: 'Anika Visser',
            plan: 'Premium'
          }
        }
      });
    } else {
      dispatch({
        type: ActionType.AUTH_STATE_CHANGED,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }), [dispatch]);

  const _signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  };

  const _createUserWithEmailAndPassword = async (email: string,
    password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Firebase',
        createUserWithEmailAndPassword: _createUserWithEmailAndPassword,
        signInWithEmailAndPassword: _signInWithEmailAndPassword,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
