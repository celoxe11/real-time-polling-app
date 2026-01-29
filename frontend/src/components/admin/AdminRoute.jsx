import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Center, Loader } from "@mantine/core";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading)
    return (
      <Center>
        <Loader type="dots" size="xl" />
      </Center>
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    // Redirect non-admin users to landing page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
