import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Title,
  Text,
  Button,
  Group,
  Grid,
  Container,
  Tabs,
  TextInput,
  ThemeIcon,
  Paper,
  SimpleGrid,
  Alert,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconSearch,
  IconTrendingUp,
  IconClock,
  IconFlame,
  IconChartBar,
  IconPlus,
  IconAlertCircle,
  IconMoodEmpty,
  IconQrcode,
} from "@tabler/icons-react";
import PollCard from "../../components/PollCard";
import { useDispatch } from "react-redux";
import {
  getPopularPolls,
  getRecentPolls,
  getTrendingPolls,
  searchPolls,
  getPollByRoomCode,
} from "../../store/slices/pollSlice";
import { notifications } from "@mantine/notifications";
import { IconArrowRight } from "@tabler/icons-react";
import { getUserStats } from "../../store/slices/userSlice";
import { getVoterIdentity } from "../../utils/voterIdentity";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [userStats, setUserStats] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const { trending, recent, popular, polls } = useSelector(
    (state) => state.poll,
  );

  const { totalVotedPolls, weeklyVotedPolls, votingStreak } = useSelector(
    (state) => state.user,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStats = async () => {
      const identity = await getVoterIdentity();
      dispatch(getUserStats(identity));
      dispatch(getRecentPolls(identity.voterToken));
    };

    fetchStats();
    dispatch(getTrendingPolls());
    dispatch(getPopularPolls());

    setUserStats([
      {
        icon: IconChartBar,
        label: "Polls Voted",
        value: totalVotedPolls,
        color: "blue",
      },
      {
        icon: IconTrendingUp,
        label: "This Week",
        value: weeklyVotedPolls,
        color: "green",
      },
      {
        icon: IconFlame,
        label: "Streak",
        value: votingStreak + " days",
        color: "orange",
      },
    ]);
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      dispatch(searchPolls(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleCreatePoll = () => {
    navigate("/create-poll");
  };

  const handleSearchPoll = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNavigateEnterCode = async (e) => {
    e.preventDefault();
    navigate("/enter-code");
  };

  const handleJoinByRoomCode = async (e) => {
    e.preventDefault();
    if (!joinRoomCode || joinRoomCode.length < 8) {
      notifications.show({
        title: "Invalid Room Code",
        message: "Please enter a valid 8-digit room code",
        color: "red",
      });
      return;
    }

    try {
      setJoining(true);
      const resultAction = await dispatch(getPollByRoomCode(joinRoomCode));
      if (getPollByRoomCode.fulfilled.match(resultAction)) {
        const poll = resultAction.payload;
        navigate(`/poll/${poll._id}`);
      } else {
        notifications.show({
          title: "Poll Not Found",
          message: "No poll found with this room code",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <Container size="xl">
      {user && !user.emailVerified && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Email Not Verified"
          color="orange"
          variant="light"
          mb="xl"
        >
          <Group justify="space-between">
            <Text size="sm">
              Please verify your email address to access all features.
            </Text>
            <Button
              size="compact-xs"
              variant="subtle"
              onClick={() => navigate("/profile")}
            >
              Verify Now
            </Button>
          </Group>
        </Alert>
      )}

      {/* Hero Section */}
      <Box mb="xl">
        <Group justify="space-between" align="flex-start" mb="md">
          <div>
            <Title order={1} mb="xs">
              Discover Polls
            </Title>
            <Text c="dimmed" size="sm">
              Participate in trending polls and share your opinion
            </Text>
          </div>
          <Button
            leftSection={<IconQrcode size={18} />}
            onClick={handleNavigateEnterCode}
            size="md"
          >
            Enter Code
          </Button>
        </Group>

        {/* Quick Stats */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
          {userStats.map((stat) => (
            <Paper key={stat.label} p="md" radius="md" withBorder>
              <Group>
                <ThemeIcon
                  size="lg"
                  radius="md"
                  variant="light"
                  color={stat.color}
                >
                  <stat.icon size={20} stroke={1.5} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.label}
                  </Text>
                  <Text size="lg" fw={700}>
                    {stat.value}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Search Bar */}
        <TextInput
          placeholder="Search polls..."
          leftSection={<IconSearch size={16} />}
          size="md"
          value={searchQuery}
          onChange={handleSearchPoll}
        />
      </Box>

      {searchQuery === "" ? (
        <>
          {/* Tabs for Different Poll Categories */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List mb="lg">
              <Tabs.Tab
                value="trending"
                leftSection={<IconTrendingUp size={16} />}
              >
                Trending
              </Tabs.Tab>
              <Tabs.Tab value="recent" leftSection={<IconClock size={16} />}>
                Recent
              </Tabs.Tab>
              <Tabs.Tab value="popular" leftSection={<IconFlame size={16} />}>
                Popular
              </Tabs.Tab>
            </Tabs.List>

            {/* Trending Polls */}
            <Tabs.Panel value="trending">
              {trending.length === 0 ? (
                <Paper p="xl" radius="md" withBorder>
                  <Stack align="center" gap="md">
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      variant="light"
                      color="blue"
                    >
                      <IconTrendingUp size={32} />
                    </ThemeIcon>
                    <div style={{ textAlign: "center" }}>
                      <Text size="lg" fw={500} mb="xs">
                        No Trending Polls Yet
                      </Text>
                      <Text size="sm" c="dimmed" mb="md">
                        Be the first to create a poll and start the
                        conversation!
                      </Text>
                      <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleCreatePoll}
                      >
                        Create Your First Poll
                      </Button>
                    </div>
                  </Stack>
                </Paper>
              ) : (
                <Grid>
                  {trending.map((poll) => (
                    <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                      <PollCard poll={poll} showResults={true} />
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </Tabs.Panel>

            {/* Recent Polls */}
            <Tabs.Panel value="recent">
              {recent.length === 0 ? (
                <Paper p="xl" radius="md" withBorder>
                  <Stack align="center" gap="md">
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      variant="light"
                      color="green"
                    >
                      <IconClock size={32} />
                    </ThemeIcon>
                    <div style={{ textAlign: "center", maxWidth: 400 }}>
                      <Text size="lg" fw={500} mb="xs">
                        Start Your First Vote!
                      </Text>
                      <Text size="sm" c="dimmed" mb="xl">
                        You haven't participated in any polls yet. Enter a room
                        code below or explore trending polls to get started.
                      </Text>

                      <form onSubmit={handleJoinByRoomCode}>
                        <Group gap="xs">
                          <TextInput
                            placeholder="Enter Room Code (e.g. 12345678)"
                            value={joinRoomCode}
                            onChange={(e) => setJoinRoomCode(e.target.value)}
                            maxLength={8}
                            style={{ flex: 1 }}
                            size="md"
                          />
                          <Button
                            type="submit"
                            loading={joining}
                            variant="filled"
                            color="green"
                            size="md"
                            rightSection={<IconArrowRight size={16} />}
                          >
                            Join
                          </Button>
                        </Group>
                      </form>

                      <Divider
                        label="OR"
                        labelPosition="center"
                        my="xl"
                        variant="dashed"
                      />

                      <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleCreatePoll}
                        variant="light"
                        color="green"
                        fullWidth
                      >
                        Create Your Own Poll
                      </Button>
                    </div>
                  </Stack>
                </Paper>
              ) : (
                <Grid>
                  {recent.map((poll) => (
                    <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                      <PollCard poll={poll} showResults={false} />
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </Tabs.Panel>

            {/* Popular Polls */}
            <Tabs.Panel value="popular">
              {popular.length === 0 ? (
                <Paper p="xl" radius="md" withBorder>
                  <Stack align="center" gap="md">
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      variant="light"
                      color="orange"
                    >
                      <IconFlame size={32} />
                    </ThemeIcon>
                    <div style={{ textAlign: "center" }}>
                      <Text size="lg" fw={500} mb="xs">
                        No Popular Polls Yet
                      </Text>
                      <Text size="sm" c="dimmed" mb="md">
                        Popular polls will appear here based on vote count.
                      </Text>
                      <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleCreatePoll}
                        variant="light"
                        color="orange"
                      >
                        Create a Poll
                      </Button>
                    </div>
                  </Stack>
                </Paper>
              ) : (
                <Grid>
                  {popular.map((poll) => (
                    <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                      <PollCard poll={poll} showResults={true} />
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </Tabs.Panel>
          </Tabs>
        </>
      ) : (
        <>
          {polls.length === 0 ? (
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                  <IconMoodEmpty size={32} />
                </ThemeIcon>
                <div style={{ textAlign: "center" }}>
                  <Text size="lg" fw={500} mb="xs">
                    No Polls Found
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    We couldn't find any polls matching "{searchQuery}". Try a
                    different search term.
                  </Text>
                  <Button variant="light" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              </Stack>
            </Paper>
          ) : (
            <Grid>
              {polls.map((poll) => (
                <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <PollCard poll={poll} showResults={true} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage;
