import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/authService";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Verify dan simpan user ke backend setelah login
    const saveUserToBackend = async () => {
      try {
        const response = await authService.verifyUser();
        console.log("User saved to backend:", response);
      } catch (error) {
        console.error("Error saving user:", error);
      }
    };

    if (user) {
      saveUserToBackend();
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    if (window.confirm("Yakin ingin menghapus akun?")) {
      try {
        await authService.deleteAccount();
        alert("Akun berhasil dihapus");
        // Logout
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Gagal menghapus akun");
      }
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user?.displayName}</p>
      <p>Email: {user?.email}</p>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default ProfilePage;
