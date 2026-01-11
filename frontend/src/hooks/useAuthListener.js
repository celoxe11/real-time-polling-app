import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setUser } from '../services/authSlice';

// Custom hook untuk listen Firebase auth state changes
export const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);
};
