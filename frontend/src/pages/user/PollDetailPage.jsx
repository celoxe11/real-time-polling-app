import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Progress,
  Badge,
  Avatar,
  ThemeIcon,
  Divider,
  Card,
  Box,
  ActionIcon,
  Tooltip,
  Radio,
  Textarea,
  Alert,
  RingProgress,
  SimpleGrid,
  Transition,
  CopyButton,
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconChartBar,
  IconShare,
  IconCheck,
  IconAlertCircle,
  IconArrowLeft,
  IconFlame,
  IconMessage,
  IconSend,
  IconCopy,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconTrophy,
  IconTrendingUp,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const PollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Dummy poll data - replace with actual API call
  const [pollData, setPollData] = useState({
    id: 1,
    title: "What's the best programming language in 2026?",
    description:
      "Help us determine the most popular programming language this year. This poll will help developers understand current trends in the tech industry.",
    creator: {
      name: "Tech Community",
      avatar: null,
      id: "user123",
    },
    category: "Technology",
    isPublic: true,
    createdAt: "2026-01-10T10:00:00Z",
    expiresAt: "2026-01-14T10:00:00Z",
    totalVotes: 2456,
    participants: 1823,
    trending: true,
    options: [
      { id: 1, label: "JavaScript", votes: 856, percentage: 35 },
      { id: 2, label: "Python", votes: 734, percentage: 30 },
      { id: 3, label: "TypeScript", votes: 490, percentage: 20 },
      { id: 4, label: "Rust", votes: 376, percentage: 15 },
    ],
  });

  useEffect(() => {
    // TODO: Fetch poll data from API
    // Simulate checking if user has voted
    const userHasVoted = false; // Replace with actual check
    setHasVoted(userHasVoted);
    setShowResults(userHasVoted);

    // Dummy comments
    setComments([
      {
        id: 1,
        user: { name: "John Doe", avatar: null },
        text: "Great poll! I think Python is the future.",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        user: { name: "Jane Smith", avatar: null },
        text: "TypeScript has been gaining a lot of traction lately.",
        timestamp: "5 hours ago",
      },
    ]);
  }, [id]);

  const calculateTimeLeft = () => {
    const now = new Date();
    const expiry = new Date(pollData.expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Less than 1 hour left";
  };

  const handleVote = async () => {
    if (!selectedOption) {
      notifications.show({
        title: "No option selected",
        message: "Please select an option before voting",
        color: "orange",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit vote
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      const updatedOptions = pollData.options.map((opt) =>
        opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
      );

      const totalVotes = updatedOptions.reduce(
        (sum, opt) => sum + opt.votes,
        0
      );
      const optionsWithPercentage = updatedOptions.map((opt) => ({
        ...opt,
        percentage: Math.round((opt.votes / totalVotes) * 100),
      }));

      setPollData({
        ...pollData,
        options: optionsWithPercentage,
        totalVotes: totalVotes,
        participants: pollData.participants + 1,
      });

      setHasVoted(true);
      setShowResults(true);

      notifications.show({
        title: "Vote Submitted! 🎉",
        message: "Thank you for participating in this poll",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to submit vote",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: { name: user?.name || "Anonymous", avatar: null },
      text: comment,
      timestamp: "Just now",
    };

    setComments([newComment, ...comments]);
    setComment("");

    notifications.show({
      title: "Comment Added",
      message: "Your comment has been posted",
      color: "blue",
      icon: <IconCheck size={16} />,
    });
  };

  const shareUrl = `${window.location.origin}/polls/${id}`;

  const handleShare = (platform) => {
    const text = `Check out this poll: ${pollData.title}`;
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(
          text + " " + shareUrl
        )}`;
        break;
    }

    if (url) window.open(url, "_blank");
  };

  const topOption = pollData.options.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return (
    <Container size="lg" py="xl">
      {/* Back Button */}
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/")}
        mb="lg"
      >
        Back to Polls
      </Button>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {/* Main Content */}
        <Box style={{ gridColumn: "span 2" }}>
          <Paper shadow="md" p="xl" radius="lg" withBorder>
            {/* Header */}
            <Stack gap="md" mb="xl">
              <Group justify="space-between">
                <Badge color="blue" variant="light" size="lg">
                  {pollData.category}
                </Badge>
                {pollData.trending && (
                  <Badge
                    color="red"
                    variant="filled"
                    leftSection={<IconFlame size={12} />}
                  >
                    Trending
                  </Badge>
                )}
              </Group>

              <Title order={1}>{pollData.title}</Title>

              <Text c="dimmed" size="sm">
                {pollData.description}
              </Text>

              {/* Creator Info */}
              <Group gap="xs">
                <Avatar size="sm" radius="xl" />
                <div>
                  <Text size="sm" fw={500}>
                    {pollData.creator.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(pollData.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </Group>

              <Divider />

              {/* Stats */}
              <SimpleGrid cols={3}>
                <div>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="blue">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed">
                        Participants
                      </Text>
                      <Text size="lg" fw={700}>
                        {pollData.participants.toLocaleString()}
                      </Text>
                    </div>
                  </Group>
                </div>
                <div>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="green">
                      <IconChartBar size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed">
                        Total Votes
                      </Text>
                      <Text size="lg" fw={700}>
                        {pollData.totalVotes.toLocaleString()}
                      </Text>
                    </div>
                  </Group>
                </div>
                <div>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="orange">
                      <IconClock size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed">
                        Time Left
                      </Text>
                      <Text size="lg" fw={700}>
                        {calculateTimeLeft()}
                      </Text>
                    </div>
                  </Group>
                </div>
              </SimpleGrid>
            </Stack>

            <Divider mb="xl" />

            {/* Voting Section */}
            {!hasVoted ? (
              <Stack gap="md">
                <Title order={3}>Cast Your Vote</Title>
                <Radio.Group
                  value={selectedOption}
                  onChange={setSelectedOption}
                >
                  <Stack gap="sm">
                    {pollData.options.map((option) => (
                      <Paper
                        key={option.id}
                        p="md"
                        withBorder
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s",
                          backgroundColor:
                            selectedOption === option.id
                              ? "var(--mantine-color-blue-0)"
                              : "transparent",
                          borderColor:
                            selectedOption === option.id
                              ? "var(--mantine-color-blue-6)"
                              : undefined,
                        }}
                        onClick={() => setSelectedOption(option.id)}
                      >
                        <Radio
                          value={option.id}
                          label={option.label}
                          size="md"
                          styles={{ label: { cursor: "pointer" } }}
                        />
                      </Paper>
                    ))}
                  </Stack>
                </Radio.Group>

                <Button
                  size="lg"
                  fullWidth
                  onClick={handleVote}
                  loading={isSubmitting}
                  leftSection={<IconCheck size={18} />}
                  gradient={{ from: "blue", to: "cyan" }}
                  variant="gradient"
                  mt="md"
                >
                  Submit Vote
                </Button>
              </Stack>
            ) : (
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>Results</Title>
                  <Badge
                    color="green"
                    variant="light"
                    leftSection={<IconCheck size={12} />}
                  >
                    You voted
                  </Badge>
                </Group>

                <Stack gap="lg">
                  {pollData.options
                    .sort((a, b) => b.votes - a.votes)
                    .map((option, index) => (
                      <Transition
                        key={option.id}
                        mounted={showResults}
                        transition="slide-up"
                        duration={300 + index * 100}
                        timingFunction="ease"
                      >
                        {(styles) => (
                          <Paper p="md" withBorder style={styles}>
                            <Group justify="space-between" mb="xs">
                              <Group gap="xs">
                                {index === 0 && (
                                  <ThemeIcon
                                    color="yellow"
                                    variant="light"
                                    size="sm"
                                  >
                                    <IconTrophy size={14} />
                                  </ThemeIcon>
                                )}
                                <Text fw={500}>{option.label}</Text>
                              </Group>
                              <Group gap="md">
                                <Text size="sm" c="dimmed">
                                  {option.votes.toLocaleString()} votes
                                </Text>
                                <Text size="lg" fw={700} c="blue">
                                  {option.percentage}%
                                </Text>
                              </Group>
                            </Group>
                            <Progress
                              value={option.percentage}
                              size="lg"
                              radius="md"
                              animated
                              color={index === 0 ? "blue" : "gray"}
                            />
                          </Paper>
                        )}
                      </Transition>
                    ))}
                </Stack>
              </Stack>
            )}

            {/* Comments Section */}
            <Divider my="xl" />

            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3}>
                  <Group gap="xs">
                    <IconMessage size={24} />
                    <span>Comments ({comments.length})</span>
                  </Group>
                </Title>
              </Group>

              {/* Add Comment */}
              <Paper p="md" withBorder>
                <Stack gap="sm">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    minRows={2}
                    maxRows={4}
                  />
                  <Group justify="flex-end">
                    <Button
                      leftSection={<IconSend size={16} />}
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                    >
                      Post Comment
                    </Button>
                  </Group>
                </Stack>
              </Paper>

              {/* Comments List */}
              <Stack gap="sm">
                {comments.map((c) => (
                  <Paper key={c.id} p="md" withBorder>
                    <Group gap="xs" mb="xs">
                      <Avatar size="sm" radius="xl" />
                      <div>
                        <Text size="sm" fw={500}>
                          {c.user.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {c.timestamp}
                        </Text>
                      </div>
                    </Group>
                    <Text size="sm">{c.text}</Text>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Stack gap="md">
          {/* Leading Option */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md" align="center">
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: "yellow", to: "orange" }}
              >
                <IconTrophy size={32} />
              </ThemeIcon>
              <div style={{ textAlign: "center" }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Leading Option
                </Text>
                <Title order={3} mt={4}>
                  {topOption.label}
                </Title>
                <RingProgress
                  sections={[{ value: topOption.percentage, color: "blue" }]}
                  label={
                    <Text c="blue" fw={700} ta="center" size="xl">
                      {topOption.percentage}%
                    </Text>
                  }
                  size={120}
                  thickness={12}
                  mt="md"
                />
              </div>
            </Stack>
          </Card>

          {/* Share Poll */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <IconShare size={20} />
                <Text fw={500}>Share this poll</Text>
              </Group>

              <Stack gap="xs">
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconBrandTwitter size={16} />}
                  onClick={() => handleShare("twitter")}
                  fullWidth
                >
                  Twitter
                </Button>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconBrandFacebook size={16} />}
                  onClick={() => handleShare("facebook")}
                  fullWidth
                >
                  Facebook
                </Button>
                <Button
                  variant="light"
                  color="green"
                  leftSection={<IconBrandWhatsapp size={16} />}
                  onClick={() => handleShare("whatsapp")}
                  fullWidth
                >
                  WhatsApp
                </Button>
              </Stack>

              <Divider />

              <CopyButton value={shareUrl}>
                {({ copied, copy }) => (
                  <Button
                    variant="light"
                    color={copied ? "teal" : "gray"}
                    leftSection={
                      copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                    }
                    onClick={copy}
                    fullWidth
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                )}
              </CopyButton>
            </Stack>
          </Card>

          {/* Poll Info */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Text fw={500} size="sm">
                Poll Information
              </Text>
              <Divider />
              <div>
                <Text size="xs" c="dimmed">
                  Status
                </Text>
                <Badge color="green" variant="light" mt={4}>
                  Active
                </Badge>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Visibility
                </Text>
                <Text size="sm" fw={500} mt={4}>
                  {pollData.isPublic ? "Public" : "Private"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Created
                </Text>
                <Text size="sm" fw={500} mt={4}>
                  {new Date(pollData.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Expires
                </Text>
                <Text size="sm" fw={500} mt={4}>
                  {new Date(pollData.expiresAt).toLocaleDateString()}
                </Text>
              </div>
            </Stack>
          </Card>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default PollDetailPage;
