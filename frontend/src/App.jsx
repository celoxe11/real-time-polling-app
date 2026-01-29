import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthListener } from "./hooks/useAuthListener";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/user/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import "./App.css";
import HomePage from "./pages/user/HomePage";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import PollsPage from "./pages/admin/PollsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ProfilePage from "./pages/user/ProfilePage";
import MyPollsPage from "./pages/user/MyPollsPage";
import UserLayout from "./components/user/UserLayout";
import CreatePage from "./pages/user/CreatePage";
import PollDetailPage from "./pages/user/PollDetailPage";
import MyPollDetailPage from "./pages/user/MyPollDetailPage";
import EditPage from "./pages/user/EditPage";
import EnterCodePage from "./pages/user/EnterCodePage";
import LandingPage from "./pages/LandingPage";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Listen to Firebase auth state changes
  useAuthListener();

  // Redirect to appropriate home based on role
  const RoleBasedRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/home" replace />;
  };

  // Wrapper for user routes to handle layout and protection
  const UserRoutesWrapper = () => (
    <ProtectedRoute>
      <UserLayout>
        <Outlet />
      </UserLayout>
    </ProtectedRoute>
  );

  const AdminRoutesWrapper = () => (
    <AdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminRoute>
  );

  // Create router with routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: isAuthenticated ? <RoleBasedRedirect /> : <LoginPage />,
    },
    {
      path: "/register",
      element: isAuthenticated ? <RoleBasedRedirect /> : <RegisterPage />,
    },
    {
      path: "/forgot-password",
      element: isAuthenticated ? <RoleBasedRedirect /> : <ForgotPassword />,
    },
    // User routes (top-level)
    {
      path: "/",
      element: <UserRoutesWrapper />,
      children: [
        {
          path: "home",
          element: <HomePage />,
        },
        {
          path: "my-polls",
          element: <MyPollsPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
        {
          path: "enter-code",
          element: <EnterCodePage />,
        },
        {
          path: "create-poll",
          element: <CreatePage />,
        },
        {
          path: "poll/:id",
          element: <PollDetailPage />,
        },
        {
          path: "my-poll/:id",
          element: <MyPollDetailPage />,
        },
        {
          path: "poll/:id/edit",
          element: <EditPage />,
        },
      ],
    },
    // Admin routes
    {
      path: "/admin",
      element: <AdminRoutesWrapper />,
      children: [
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "polls",
          element: <PollsPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
