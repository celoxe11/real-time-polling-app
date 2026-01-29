import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Switch,
  Group,
  Divider,
  Button,
  TextInput,
  NumberInput,
  Select,
  Grid,
} from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

const SettingsPage = () => {
  const [siteName, setSiteName] = useState("Pollr");
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(true);
  const [maxOptionsPerPoll, setMaxOptionsPerPoll] = useState(10);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    notifications.show({
      title: "Settings Saved",
      message: "System configuration has been updated successfully",
      color: "green",
      icon: <IconShieldCheck size={16} />,
    });
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>System Settings</Title>
          <Text c="dimmed">
            Configure global application parameters and moderation rules
          </Text>
        </div>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="lg">
              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md">
                  General Configuration
                </Title>
                <Stack gap="md">
                  <TextInput
                    label="Site Name"
                    description="The main title of the application"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />
                  <Select
                    label="Default Theme"
                    description="User's initial theme preference"
                    data={["System", "Dark", "Light"]}
                    defaultValue="System"
                  />
                </Stack>
              </Paper>

              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md">
                  Security & Access
                </Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Allow New Registrations</Text>
                      <Text size="xs" c="dimmed">
                        Enable or disable user account creation
                      </Text>
                    </div>
                    <Switch
                      checked={allowRegistration}
                      onChange={(e) =>
                        setAllowRegistration(e.currentTarget.checked)
                      }
                    />
                  </Group>

                  <Divider />

                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Require Email Verification</Text>
                      <Text size="xs" c="dimmed">
                        Users must verify email before creating polls
                      </Text>
                    </div>
                    <Switch
                      checked={requireEmailVerification}
                      onChange={(e) =>
                        setRequireEmailVerification(e.currentTarget.checked)
                      }
                    />
                  </Group>
                </Stack>
              </Paper>

              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md">
                  Polling Rules
                </Title>
                <Stack gap="md">
                  <NumberInput
                    label="Max Options per Poll"
                    description="Limit the number of choices a user can add"
                    value={maxOptionsPerPoll}
                    onChange={setMaxOptionsPerPoll}
                    max={20}
                    min={2}
                  />
                  <Select
                    label="Spam Protection Level"
                    description="Aggressiveness of the automated moderation"
                    data={["None", "Low", "Medium", "High"]}
                    defaultValue="Medium"
                  />
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md" c="red">
                  Maintenance Zone
                </Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Maintenance Mode</Text>
                      <Text size="xs" c="dimmed">
                        Block all non-admin access
                      </Text>
                    </div>
                    <Switch
                      color="red"
                      checked={maintenanceMode}
                      onChange={(e) =>
                        setMaintenanceMode(e.currentTarget.checked)
                      }
                    />
                  </Group>
                  <Button variant="light" color="red" fullWidth>
                    Flush Application Cache
                  </Button>
                </Stack>
              </Paper>

              <Paper p="xl" radius="md" withBorder>
                <Title order={3} mb="md">
                  Save Changes
                </Title>
                <Text size="sm" c="dimmed" mb="xl">
                  Applying these changes will affect all users instantly.
                </Text>
                <Button fullWidth size="md" onClick={handleSave}>
                  Save All Settings
                </Button>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default SettingsPage;
