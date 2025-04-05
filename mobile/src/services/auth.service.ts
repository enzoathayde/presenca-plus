import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { firebaseApp } from '../config/firebase.config';
import { User }  from '../interfaces/User'
import { registerUser } from './user.registration.service';


const auth = getAuth(firebaseApp);

export const userRegistration = async (user: User ): Promise<any> => {

  try {
    const response = await registerUser(user)

    if(response.status === 201) {
      const { email, password } = user;

      signUp(email,password);
    }
    
    return response
  } catch (error) {

    return error
  }
}

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
