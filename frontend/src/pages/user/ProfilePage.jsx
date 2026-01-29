import { useState, useRef } from "react";
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
import {
  logoutUser,
  editProfile,
  updateEmailAddress,
  sendVerificationEmail,
} from "../../store/slices/authSlice";
import { useEffect } from "react";
import { getProfileStats } from "../../store/slices/userSlice";
import ChangeProfileModal from "../../components/ChangeProfileModal";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { storage } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [stats, setStats] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
      // Update display name if changed
      if (values.displayName !== user.displayName) {
        await dispatch(editProfile({ name: values.displayName })).unwrap();
        notifications.show({
          title: "Profile Updated",
          message: "Your display name has been updated successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
      }

      // Update email if changed
      if (values.email !== user.email) {
        await dispatch(updateEmailAddress(values.email)).unwrap();
        notifications.show({
          title: "Verification Email Sent",
          message:
            "A verification email has been sent to your new address. Please verify it to complete the update.",
          color: "blue",
          icon: <IconCheck size={16} />,
        });
      }

      closeEdit();
    } catch (error) {
      console.error("Error updating profile:", error);
      notifications.show({
        title: "Update Failed",
        message: error || "Failed to update profile",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      await dispatch(sendVerificationEmail()).unwrap();
      notifications.show({
        title: "Verification Sent",
        message: "A new verification email has been sent to your inbox.",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error || "Failed to send verification email",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
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
    // TODO: implement avatar change, perlu FIREBASE STORAGE
    notifications.show({
      title: "Feature Not Available",
      message: "Avatar change feature is not available yet",
      color: "orange",
      icon: <IconAlertCircle size={16} />,
    });
    // fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      notifications.show({
        title: "Invalid file type",
        message: "Please select an image file",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      notifications.show({
        title: "File too large",
        message: "Image must be less than 2MB",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
          notifications.show({
            title: "Upload Failed",
            message: "Failed to upload image to storage",
            color: "red",
            icon: <IconAlertCircle size={16} />,
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await dispatch(editProfile({ photoURL: downloadURL })).unwrap();

            setUploading(false);
            notifications.show({
              title: "Avatar Updated",
              message: "Your profile picture has been updated successfully",
              color: "green",
              icon: <IconCheck size={16} />,
            });
          } catch (updateError) {
            console.error(
              "Error updating profile with new photoURL:",
              updateError,
            );
            setUploading(false);
            notifications.show({
              title: "Update Failed",
              message:
                updateError.message || "Failed to update profile picture URL",
              color: "red",
              icon: <IconAlertCircle size={16} />,
            });
          }
        },
      );
    } catch (error) {
      console.error("Error updating avatar:", error);
      setUploading(false);
      notifications.show({
        title: "Update Failed",
        message: error.message || "Failed to update avatar",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
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
                  <Group gap="xs">
                    {user?.emailVerified ? (
                      <Badge color="green" variant="light">
                        Verified
                      </Badge>
                    ) : (
                      <>
                        <Badge color="red" variant="light">
                          Not Verified
                        </Badge>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          onClick={handleResendVerification}
                        >
                          Resend
                        </Button>
                      </>
                    )}
                  </Group>
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

      {/* Change Profile Modal */}
      <ChangeProfileModal
        opened={editOpened}
        close={closeEdit}
        form={form}
        handleUpdateProfile={handleUpdateProfile}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        opened={deleteOpened}
        close={closeDelete}
        handleDeleteAccount={handleDeleteAccount}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </Container>
  );
};

export default ProfilePage;
