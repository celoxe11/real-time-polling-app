export const translateFirebaseError = (errorMessage) => {
  if (!errorMessage) return null;

  // Extract error code from string (e.g., "auth/invalid-credential")
  const errorCode =
    errorMessage.match(/\((auth\/[^)]+)\)/)?.[1] || errorMessage;

  const errorMessages = {
    "auth/invalid-credential":
      "The email or password you entered is incorrect.",
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "The password you entered is incorrect.",
    "auth/invalid-email": "The email address format is invalid.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/too-many-requests":
      "Too many login attempts. Please try again later.",
    "auth/network-request-failed":
      "Network connection failed. Please check your internet connection.",
    "auth/popup-closed-by-user":
      "Google login was cancelled because the window was closed.",
    "Firebase: Error (auth/user-not-found).":
      "No account found with this email address.",
    "Firebase: Error (auth/too-many-requests).":
      "Too many login attempts. Please try again later.",
    "Firebase: Error (auth/network-request-failed).":
      "Network connection failed. Please check your internet connection.",
    "Firebase: Error (auth/popup-closed-by-user).":
      "Google login was cancelled because the window was closed.",
  };

  return (
    errorMessages[errorCode] || "A system error occurred. Please try again."
  );
};

export default translateFirebaseError;
