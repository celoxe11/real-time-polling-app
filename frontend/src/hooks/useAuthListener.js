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
          // Reload user to get latest info (like emailVerified status)
          await user.reload();
          const refreshedUser = auth.currentUser;

          // Fetch additional user data from backend
          const backendUser = await authService.verifyUser();
          
          // User is signed in
          dispatch(
            setUser({
              id: backendUser.user.id,
              uid: refreshedUser.uid,
              email: refreshedUser.email,
              emailVerified:
                backendUser.user.emailVerified || refreshedUser.emailVerified,
              displayName: backendUser.user.name || refreshedUser.displayName,
              photoURL: backendUser.user.photoURL || refreshedUser.photoURL,
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
              emailVerified: user.emailVerified,
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
