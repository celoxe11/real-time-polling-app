import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthListener } from "./hooks/useAuthListener";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import "./App.css";
import HomePage from "./pages/user/HomePage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProfilePage from "./pages/user/ProfilePage";
import MyPollsPage from "./pages/user/MyPollsPage";
import UserLayout from "./components/UserLayout";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Listen to Firebase auth state changes
  useAuthListener();

  // Redirect to appropriate home based on role
  const RoleBasedRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  };

  // Create router with routes
  const router = createBrowserRouter([
    {
      path: "/login",
      element: isAuthenticated ? <RoleBasedRedirect /> : <LoginPage />,
    },
    {
      path: "/register",
      element: isAuthenticated ? <RoleBasedRedirect /> : <RegisterPage />,
    },
    // User routes
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <UserLayout>
            <Outlet />
          </UserLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element:
            user?.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <HomePage />
            ),
        },
        {
          path: "my-polls",
          element: <MyPollsPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
      ],
    },
    // Admin routes
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <Outlet />
        </AdminRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        // Add more admin routes here
        // {
        //   path: "users",
        //   element: <UsersPage />,
        // },
        // {
        //   path: "polls",
        //   element: <PollsManagementPage />,
        // },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
