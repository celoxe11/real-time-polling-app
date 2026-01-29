import {
  Container,
  Title,
  Text,
  Paper,
  Table,
  Group,
  Avatar,
  Badge,
  ActionIcon,
  Tooltip,
  TextInput,
  Button,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconSearch,
  IconTrash,
  IconUserCheck,
  IconUserExclamation,
  IconRefresh,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  removeUser,
  cleanUpUsers,
  clearAdminStatus,
} from "../../store/slices/adminSlice";
import { notifications } from "@mantine/notifications";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector(
    (state) => state.admin,
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      notifications.show({
        title: "Success",
        message: success,
        color: "green",
        icon: <IconCircleCheck size={16} />,
      });
      dispatch(clearAdminStatus());
      dispatch(fetchUsers());
    }
    if (error) {
      notifications.show({
        title: "Error",
        message: error,
        color: "red",
      });
      dispatch(clearAdminStatus());
    }
  }, [success, error, dispatch]);

  const handleDeleteUser = (userId, email) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      dispatch(removeUser(userId));
    }
  };

  const handleCleanUp = () => {
    if (
      window.confirm(
        "Are you sure you want to clean up unverified users older than 14 days?",
      )
    ) {
      dispatch(cleanUpUsers());
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={1}>User Management</Title>
            <Text c="dimmed">Manage and monitor application users</Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={handleCleanUp}
            loading={loading}
          >
            Clean Up Unverified Users
          </Button>
        </Group>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <TextInput
              placeholder="Search by name or email..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>

          {loading && users.length === 0 ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Created At</Table.Th>
                    <Table.Th>Last Login</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredUsers.map((u) => (
                    <Table.Tr key={u._id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar src={u.photoURL} radius="xl" size="sm" />
                          <div>
                            <Text size="sm" fw={500}>
                              {u.name || "Anonymous"}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {u.email}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={u.role === "admin" ? "purple" : "blue"}
                          variant="light"
                        >
                          {u.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {u.lastSignInTime
                            ? new Date(u.lastSignInTime).toLocaleString()
                            : "Never"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={0} justify="flex-end">
                          <Tooltip label="Delete User">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => handleDeleteUser(u._id, u.email)}
                              disabled={u.role === "admin"}
                            >
                              <IconTrash size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text align="center" py="md" c="dimmed">
                          No users found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default UsersPage;
