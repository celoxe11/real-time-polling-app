import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Card,
  Avatar,
  Text,
  Title,
  Button,
  Group,
  Stack,
  Badge,
  Divider,
  TextInput,
  Modal,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Box,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconChartBar,
  IconUsers,
  IconTrophy,
  IconCamera,
} from "@tabler/icons-react";
import { authService } from "../../services/authService";
import { logoutUser } from "../../store/slices/authSlice";
import { useEffect } from "react";
import { getProfileStats } from "../../store/slices/userSlice";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [stats, setStats] = useState([]);

  const { totalCreatedPolls, totalVotesReceived, activePolls } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    dispatch(getProfileStats());
    setStats([
      {
        icon: IconChartBar,
        label: "Polls Created",
        value: totalCreatedPolls.toString(),
        color: "blue",
      },
      {
        icon: IconUsers,
        label: "Total Votes",
        value: totalVotesReceived,
        color: "green",
      },
      {
        icon: IconTrophy,
        label: "Active Polls",
        value: activePolls,
        color: "orange",
      },
    ]);
  }, []);

  const form = useForm({
    initialValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const handleUpdateProfile = async (values) => {
    try {
      // TODO: Call API to update profile
      console.log("Update profile:", values);
      closeEdit();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      await dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  const handleChangeAvatar = () => {
    // TODO: Implement avatar upload
    console.log("Change avatar");
  };

  return (
    <Container size="lg">
      <Title order={1} mb="xl">
        Profile Settings
      </Title>

      <Grid gutter="lg">
        {/* Left Column - Profile Info */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" gap="md">
              <Box pos="relative">
                <Avatar
                  src={user?.photoURL}
                  alt={user?.displayName}
                  size={120}
                  radius={120}
                />
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="lg"
                  radius="xl"
                  pos="absolute"
                  bottom={0}
                  right={0}
                  onClick={handleChangeAvatar}
                >
                  <IconCamera size={18} />
                </ActionIcon>
              </Box>

              <div style={{ textAlign: "center" }}>
                <Title order={3}>{user?.displayName || "User"}</Title>
                <Text size="sm" c="dimmed">
                  {user?.email}
                </Text>
                <Badge color="blue" variant="light" mt="xs">
                  {user?.role || "user"}
                </Badge>
              </div>

              <Divider w="100%" />

              <Stack gap="xs" w="100%">
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm" c="dimmed">
                    Email
                  </Text>
                </Group>
                <Text size="sm" fw={500}>
                  {user?.email}
                </Text>

                <Group gap="xs" mt="md">
                  <IconCalendar size={16} />
                  <Text size="sm" c="dimmed">
                    Member Since
                  </Text>
                </Group>
                <Text size="sm" fw={500}>
                  January 2026
                </Text>
              </Stack>

              <Button
                fullWidth
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={openEdit}
                mt="md"
              >
                Edit Profile
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right Column - Stats & Settings */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* Statistics */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Statistics
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                {stats.map((stat) => (
                  <Paper key={stat.label} p="md" radius="md" withBorder>
                    <Group>
                      <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="light"
                        color={stat.color}
                      >
                        <stat.icon size={24} stroke={1.5} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                          {stat.label}
                        </Text>
                        <Text size="xl" fw={700}>
                          {stat.value}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            </Card>

            {/* Account Information */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Account Information
              </Title>
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Display Name
                    </Text>
                    <Text size="sm" c="dimmed">
                      {user?.displayName || "Not set"}
                    </Text>
                  </div>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Email Address
                    </Text>
                    <Text size="sm" c="dimmed">
                      {user?.email}
                    </Text>
                  </div>
                  <Badge color="green" variant="light">
                    Verified
                  </Badge>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Account Type
                    </Text>
                    <Text size="sm" c="dimmed">
                      {user?.role === "admin"
                        ? "Administrator"
                        : "Standard User"}
                    </Text>
                  </div>
                  <Badge color={user?.role === "admin" ? "purple" : "blue"}>
                    {user?.role || "user"}
                  </Badge>
                </Group>
              </Stack>
            </Card>

            {/* Danger Zone */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md" c="red">
                Danger Zone
              </Title>
              <Stack gap="md">
                <Text size="sm" c="dimmed">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </Text>
                <Button
                  color="red"
                  variant="light"
                  leftSection={<IconTrash size={16} />}
                  onClick={openDelete}
                >
                  Delete Account
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Edit Profile Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Profile"
        centered
      >
        <form onSubmit={form.onSubmit(handleUpdateProfile)}>
          <Stack gap="md">
            <TextInput
              label="Display Name"
              placeholder="Enter your name"
              {...form.getInputProps("displayName")}
            />
            <TextInput
              label="Email"
              placeholder="your@email.com"
              disabled
              {...form.getInputProps("email")}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeEdit}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Account"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently deleted.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeDelete}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
