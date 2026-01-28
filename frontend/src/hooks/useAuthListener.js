import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { setUser } from "../store/slices/authSlice";
import { authService } from "../services/authService";

// Custom hook untuk listen Firebase auth state changes
export const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch additional user data from backend (including MongoDB id and role)
          const backendUser = await authService.verifyUser();

          // User is signed in
          dispatch(
            setUser({
              id: backendUser.user.id,
              uid: user.uid,
              email: user.email,
              displayName: backendUser.user.name || user.displayName,
              photoURL: backendUser.user.photoURL || user.photoURL,
              role: backendUser.user.role,
            }),
          );
        } catch (error) {
          console.error("Error fetching backend user data:", error);
          // Fallback to basic firebase data if backend fails
          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            }),
          );
        }
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);
};
