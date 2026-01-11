import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Title,
  Text,
  Button,
  Card,
  Group,
  Badge,
  Stack,
  Grid,
  ActionIcon,
  Menu,
  Container,
  Tabs,
} from "@mantine/core";
import {
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconChartBar,
} from "@tabler/icons-react";

const MyPollsPage = () => {
  const navigate = useNavigate();

  // Dummy data - nanti akan diganti dengan data dari API
  const [myPolls, setMyPolls] = useState([
    {
      id: 1,
      title: "What's your favorite programming language?",
      description: "Vote for your most preferred programming language",
      totalVotes: 156,
      status: "active",
      createdAt: "2026-01-10",
    },
    {
      id: 2,
      title: "Best time for team meetings?",
      description: "Help us decide the best time for weekly team sync",
      totalVotes: 42,
      status: "active",
      createdAt: "2026-01-09",
    },
  ]);

  const handleCreatePoll = () => {
    navigate("/create-poll");
  };

  const handleViewPoll = (pollId) => {
    navigate(`/polls/${pollId}`);
  };

  const handleEditPoll = (pollId) => {
    navigate(`/polls/${pollId}/edit`);
  };

  const handleDeletePoll = (pollId) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      setMyPolls(myPolls.filter((poll) => poll.id !== pollId));
    }
  };

  const activePolls = myPolls.filter((poll) => poll.status === "active");
  const closedPolls = myPolls.filter((poll) => poll.status === "closed");

  const PollCard = ({ poll }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Group justify="space-between" mb="md">
        <Badge
          color={poll.status === "active" ? "green" : "gray"}
          variant="light"
        >
          {poll.status}
        </Badge>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              onClick={() => handleViewPoll(poll.id)}
            >
              View Results
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => handleEditPoll(poll.id)}
            >
              Edit
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => handleDeletePoll(poll.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Title order={4} lineClamp={2} mb="xs">
        {poll.title}
      </Title>
      <Text size="sm" c="dimmed" lineClamp={2} mb="md">
        {poll.description}
      </Text>

      <Group justify="space-between" mt="auto">
        <Group gap="xs">
          <IconUsers size={16} stroke={1.5} />
          <Text size="sm" fw={500}>
            {poll.totalVotes} votes
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {new Date(poll.createdAt).toLocaleDateString()}
        </Text>
      </Group>

      <Button
        fullWidth
        mt="md"
        variant="light"
        onClick={() => handleViewPoll(poll.id)}
      >
        View Details
      </Button>
    </Card>
  );

  const EmptyState = ({ message }) => (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Stack align="center" gap="md" py="xl">
        <IconChartBar size={48} stroke={1.5} color="gray" />
        <div style={{ textAlign: "center" }}>
          <Text size="lg" fw={500} mb="xs">
            {message}
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Create a new poll to get started
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={handleCreatePoll}
          >
            Create Poll
          </Button>
        </div>
      </Stack>
    </Card>
  );

  return (
    <Container size="xl">
      <Box mb="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1} mb="xs">
              My Polls
            </Title>
            <Text c="dimmed" size="sm">
              Manage all your created polls
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={handleCreatePoll}
            size="md"
          >
            Create New Poll
          </Button>
        </Group>
      </Box>

      <Tabs defaultValue="active">
        <Tabs.List mb="lg">
          <Tabs.Tab value="active">Active ({activePolls.length})</Tabs.Tab>
          <Tabs.Tab value="closed">Closed ({closedPolls.length})</Tabs.Tab>
          <Tabs.Tab value="all">All ({myPolls.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="active">
          {activePolls.length === 0 ? (
            <EmptyState message="No active polls" />
          ) : (
            <Grid>
              {activePolls.map((poll) => (
                <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <PollCard poll={poll} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="closed">
          {closedPolls.length === 0 ? (
            <EmptyState message="No closed polls" />
          ) : (
            <Grid>
              {closedPolls.map((poll) => (
                <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <PollCard poll={poll} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="all">
          {myPolls.length === 0 ? (
            <EmptyState message="No polls yet" />
          ) : (
            <Grid>
              {myPolls.map((poll) => (
                <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <PollCard poll={poll} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default MyPollsPage;
