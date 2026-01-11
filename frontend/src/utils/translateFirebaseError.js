export const translateFirebaseError = (errorMessage) => {
  if (!errorMessage) return null;

  // Ekstrak kode error dari string (misal: "auth/invalid-credential")
  const errorCode =
    errorMessage.match(/\((auth\/[^)]+)\)/)?.[1] || errorMessage;

  const errorMessages = {
    "auth/invalid-credential": "Email atau password yang Anda masukkan salah.",
    "auth/user-not-found": "Akun dengan email ini tidak ditemukan.",
    "auth/wrong-password": "Password yang Anda masukkan salah.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/user-disabled": "Akun ini telah dinonaktifkan.",
    "auth/too-many-requests":
      "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
    "auth/network-request-failed":
      "Koneksi internet terputus. Periksa jaringan Anda.",
    "auth/popup-closed-by-user":
      "Login Google dibatalkan karena jendela ditutup.",
  };

  return (
    errorMessages[errorCode] || "Terjadi kesalahan sistem. Silakan coba lagi."
  );
};
export default translateFirebaseError;