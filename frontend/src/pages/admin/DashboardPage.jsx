import {
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Group,
  SimpleGrid,
  ThemeIcon,
  Stack,
  Badge,
  Button,
  Divider,
} from "@mantine/core";
import {
  IconUsers,
  IconChartBar,
  IconCheck,
  IconAlertCircle,
  IconTrendingUp,
  IconClock,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      diff: 14,
      icon: IconUsers,
      color: "blue",
    },
    {
      title: "Total Polls",
      value: "456",
      diff: -2,
      icon: IconChartBar,
      color: "teal",
    },
    {
      title: "Total Votes",
      value: "12,789",
      diff: 28,
      icon: IconTrendingUp,
      color: "indigo",
    },
    {
      title: "Active Polls",
      value: "89",
      diff: 5,
      icon: IconCheck,
      color: "green",
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Admin Dashboard</Title>
          <Text c="dimmed">Overall system performance and statistics</Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {stats.map((stat) => (
            <Paper key={stat.title} p="md" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
                <ThemeIcon
                  color={stat.color}
                  variant="light"
                  size={38}
                  radius="md"
                >
                  <stat.icon size="1.5rem" stroke={1.5} />
                </ThemeIcon>
              </Group>
              <Group gap="xs" mt="sm">
                <Badge
                  color={stat.diff > 0 ? "teal" : "red"}
                  variant="light"
                  size="sm"
                >
                  {stat.diff > 0 ? "+" : ""}
                  {stat.diff}%
                </Badge>
                <Text size="xs" c="dimmed">
                  Compared to last month
                </Text>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper p="xl" radius="md" withBorder h="100%">
              <Title order={3} mb="xl">
                System Overview
              </Title>
              <Text c="dimmed" mb="xl">
                This area will eventually contain charts and more detailed
                analytics.
              </Text>

              <Divider mb="xl" />

              <Stack gap="md">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="blue" variant="light">
                      <IconClock size="1.2rem" />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>Last System Cleanup</Text>
                      <Text size="xs" c="dimmed">
                        Cleaned up unverified users older than 14 days
                      </Text>
                    </div>
                  </Group>
                  <Text size="sm" fw={600}>
                    2 hours ago
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="green" variant="light">
                      <IconCheck size="1.2rem" />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>System Status</Text>
                      <Text size="xs" c="dimmed">
                        All services are running normally
                      </Text>
                    </div>
                  </Group>
                  <Badge color="green">Healthy</Badge>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="xl" radius="md" withBorder>
              <Title order={3} mb="md">
                Quick Actions
              </Title>
              <Stack gap="sm">
                <Button fullWidth variant="light">
                  Download All Logs
                </Button>
                <Button fullWidth variant="light" color="orange">
                  Scan for Spam Polls
                </Button>
                <Button
                  fullWidth
                  variant="filled"
                  color="red"
                  leftSection={<IconAlertCircle size="1rem" />}
                >
                  Emergency Lockdown
                </Button>
              </Stack>
            </Paper>

            <Paper p="xl" radius="md" withBorder mt="lg">
              <Title order={3} mb="md">
                Admin Support
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                Need help with the admin panel? Contact the technical team.
              </Text>
              <Button fullWidth variant="outline">
                Contact Technical Support
              </Button>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
