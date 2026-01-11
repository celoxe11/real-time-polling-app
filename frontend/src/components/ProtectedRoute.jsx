import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Center, Loader } from "@mantine/core";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Center>
        <Loader type="dots" size="xl" />
      </Center>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
