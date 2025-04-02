import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../config/firebase.config';

const auth = getAuth(firebaseApp);

export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getToken = async () => {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};
