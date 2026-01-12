import { useState } from "react";
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
} from "@mantine/core";
import {
  IconSearch,
  IconTrendingUp,
  IconClock,
  IconFlame,
  IconChartBar,
  IconPlus,
} from "@tabler/icons-react";
import PollCard from "../../components/PollCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");

  // Dummy data - public polls that users can participate in
  const trendingPolls = [
    {
      id: 1,
      title: "What's the best programming language in 2026?",
      description:
        "Help us determine the most popular programming language this year",
      creator: {
        name: "Tech Community",
        avatar: null,
      },
      totalVotes: 2456,
      participants: 1823,
      trending: true,
      category: "Technology",
      timeLeft: "2 days left",
      options: [
        { label: "JavaScript", votes: 856, percentage: 35 },
        { label: "Python", votes: 734, percentage: 30 },
        { label: "TypeScript", votes: 490, percentage: 20 },
        { label: "Rust", votes: 376, percentage: 15 },
      ],
      hasVoted: false,
    },
    {
      id: 2,
      title: "Best remote work setup?",
      description: "Share your ideal work-from-home environment",
      creator: {
        name: "Remote Workers Hub",
        avatar: null,
      },
      totalVotes: 1234,
      participants: 892,
      trending: true,
      category: "Lifestyle",
      timeLeft: "5 days left",
      options: [
        { label: "Home Office", votes: 617, percentage: 50 },
        { label: "Coffee Shop", votes: 247, percentage: 20 },
        { label: "Co-working Space", votes: 247, percentage: 20 },
        { label: "Hybrid", votes: 123, percentage: 10 },
      ],
      hasVoted: false,
    },
    {
      id: 3,
      title: "Favorite streaming platform?",
      description: "Which streaming service do you use the most?",
      creator: {
        name: "Entertainment Poll",
        avatar: null,
      },
      totalVotes: 3421,
      participants: 2156,
      trending: true,
      category: "Entertainment",
      timeLeft: "1 day left",
      options: [
        { label: "Netflix", votes: 1368, percentage: 40 },
        { label: "Disney+", votes: 1026, percentage: 30 },
        { label: "Prime Video", votes: 684, percentage: 20 },
        { label: "Others", votes: 343, percentage: 10 },
      ],
      hasVoted: true,
    },
  ];

  const recentPolls = [
    {
      id: 4,
      title: "Best time for team meetings?",
      description: "Help us decide the optimal meeting time",
      creator: { name: "Workplace Insights", avatar: null },
      totalVotes: 456,
      participants: 234,
      category: "Work",
      timeLeft: "3 days left",
      hasVoted: false,
    },
    {
      id: 5,
      title: "Preferred learning method?",
      description: "How do you like to learn new skills?",
      creator: { name: "Education Hub", avatar: null },
      totalVotes: 789,
      participants: 456,
      category: "Education",
      timeLeft: "1 week left",
      hasVoted: false,
    },
  ];

  // Quick stats for the user
  const userStats = [
    { icon: IconChartBar, label: "Polls Voted", value: "23", color: "blue" },
    { icon: IconTrendingUp, label: "This Week", value: "5", color: "green" },
    { icon: IconFlame, label: "Streak", value: "7 days", color: "orange" },
  ];

  const handleCreatePoll = () => {
    navigate("/create-poll");
  };

  return (
    <Container size="xl">
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
            leftSection={<IconPlus size={18} />}
            onClick={handleCreatePoll}
            size="md"
          >
            Create Poll
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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Tabs for Different Poll Categories */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="lg">
          <Tabs.Tab value="trending" leftSection={<IconTrendingUp size={16} />}>
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
          <Grid>
            {trendingPolls.map((poll) => (
              <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                <PollCard poll={poll} showResults={true} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        {/* Recent Polls */}
        <Tabs.Panel value="recent">
          <Grid>
            {recentPolls.map((poll) => (
              <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                <PollCard poll={poll} showResults={false} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        {/* Popular Polls */}
        <Tabs.Panel value="popular">
          <Grid>
            {trendingPolls.slice(0, 2).map((poll) => (
              <Grid.Col key={poll.id} span={{ base: 12, md: 6, lg: 4 }}>
                <PollCard poll={poll} showResults={true} />
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default HomePage;
