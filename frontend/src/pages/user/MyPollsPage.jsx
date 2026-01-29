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
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { getMyPolls } from "../../store/slices/pollSlice";
import { deletePoll } from "../../store/slices/pollSlice";
import { useEffect } from "react";
import { MyPollCard } from "../../components/MyPollCard";

const MyPollsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myPolls, activePolls, closedPolls } = useSelector(
    (state) => state.poll,
  );

  useEffect(() => {
    dispatch(getMyPolls());
  }, [dispatch]);

  const handleCreatePoll = () => {
    navigate("/create-poll");
  };

  const handleViewPoll = (pollId) => {
    navigate(`/my-poll/${pollId}`);
  };

  const handleEditPoll = (pollId) => {
    navigate(`/poll/${pollId}/edit`);
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        await dispatch(deletePoll(pollId)).unwrap();
        notifications.show({
          title: "Poll Deleted",
          message: "The poll has been deleted successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
      } catch (error) {
        notifications.show({
          title: "Delete Failed",
          message: typeof error === "string" ? error : "Failed to delete poll",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      }
    }
  };

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
                  <MyPollCard
                    poll={poll}
                    handleDeletePoll={handleDeletePoll}
                    handleEditPoll={handleEditPoll}
                    handleViewPoll={handleViewPoll}
                  />
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
                  <MyPollCard
                    poll={poll}
                    handleDeletePoll={handleDeletePoll}
                    handleEditPoll={handleEditPoll}
                    handleViewPoll={handleViewPoll}
                  />
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
                  <MyPollCard
                    poll={poll}
                    handleDeletePoll={handleDeletePoll}
                    handleEditPoll={handleEditPoll}
                    handleViewPoll={handleViewPoll}
                  />
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
