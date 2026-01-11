import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthListener } from "./hooks/useAuthListener";
import { logoutUser } from "./services/authSlice";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Listen to Firebase auth state changes
  useAuthListener();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />

          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>
                  <h1>Welcome, {user?.displayName || user?.email}!</h1>
                  <p>UID: {user?.uid}</p>
                  {user?.photoURL && <img src={user.photoURL} alt="Profile" />}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
