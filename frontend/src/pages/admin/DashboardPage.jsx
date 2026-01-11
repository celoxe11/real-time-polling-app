import { Box, Container, Title, Text, Button, Group } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <Box>
      <Container size="xl" py="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={1}>Admin Dashboard</Title>
            <Text c="dimmed" size="sm">
              Welcome back, {user?.displayName || user?.email}
            </Text>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </Group>

        <Box mt="xl">
          <Title order={2} mb="md">
            Admin Panel
          </Title>
          <Text>
            This is the admin dashboard. You can manage polls, users, and view
            analytics here.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
