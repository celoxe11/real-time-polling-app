import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { socket, connectSocket, disconnectSocket } from "../../config/socket";
import { getPollById } from "../../store/slices/pollSlice";
import { pollService } from "../../services/pollService";
import { getVoterIdentity } from "../../utils/voterIdentity";

const PollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { poll, loading } = useSelector((state) => state.poll); // ambil poll dari redux store
  const [voterIdentity, setVoterIdentity] = useState(null); // identitas user yang voting, terutama utk user anonymous
  const [hasVoted, setHasVoted] = useState(false); // apakah user sudah vote di poll ini
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(true);

  console.log("Poll: ", poll);

  // use effect untuk fetch poll by id
  useEffect(() => {
    // fetch poll detail dari backend
    dispatch(getPollById(id));

    // initialize voter identity dan check apakah sudah vote
    const initializeVoter = async () => {
      try {
        // Get voter identity (token + fingerprint)
        const identity = await getVoterIdentity();
        setVoterIdentity(identity);
        console.log("Voter Identity:", identity);

        // Check if user has already voted
        try {
          const voteStatus = await pollService.checkHasVoted(
            id,
            identity.voterToken,
            identity.fingerprint
          );

          if (voteStatus.hasVoted) {
            setHasVoted(true);
            console.log("✅ User has already voted at:", voteStatus.votedAt);
          } else {
            console.log("✅ User has not voted yet");
          }
        } catch (error) {
          console.error("Error checking vote status:", error);
        }
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initializeVoter();

    // Connect ke Socket.IO server
    connectSocket();

    // JOIN ROOM poll ini
    socket.emit("join_poll", id);
    console.log(`Joined room: ${id}`);

    // Cleanup saat component unmount (user leave page)
    return () => {
      socket.off("vote_update"); // Remove listener
      disconnectSocket();
    };
  }, [id]);

  // use effect saat user vote
  useEffect(() => {
    const handleVoteUpdate = (voteData) => {
      console.log("Received vote update:", voteData);
      // Update poll data di sini berdasarkan voteData
    };
    socket.on("vote_update", handleVoteUpdate);
    return () => {
      socket.off("vote_update", handleVoteUpdate);
    };
  }, []);

  const calculateTimeLeft = () => {
    const now = new Date();
    const expiry = new Date(poll.expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Less than 1 hour left";
  };

  const totalVotes =
    poll?.options?.reduce((sum, opt) => sum + opt.votes, 0) || 0;

  const topOption = poll?.options?.reduce(
    (prev, current) => (prev.votes > current.votes ? prev : current),
    poll?.options?.[0]
  );

  const handleVote = async (optionId) => {};

  const shareUrl = `${window.location.origin}/polls/${id}`;

  const handleShare = (platform) => {
    const text = `Check out this poll: ${poll.title}`;
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

  // Loading state
  if (loading || !poll) {
    return (
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="lg" withBorder>
          <Stack align="center" gap="md">
            <Text>Loading poll...</Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

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
                  {poll.category}
                </Badge>
                {poll.trending && (
                  <Badge
                    color="red"
                    variant="filled"
                    leftSection={<IconFlame size={12} />}
                  >
                    Trending
                  </Badge>
                )}
              </Group>

              <Title order={1}>{poll.title}</Title>

              <Text c="dimmed" size="sm">
                {poll.description}
              </Text>

              {/* Creator Info */}
              <Group gap="xs">
                <Avatar size="sm" radius="xl" />
                <div>
                  <Text size="sm" fw={500}>
                    {poll.createdBy.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </Group>

              <Divider />

              {/* Stats */}
              <SimpleGrid cols={3}>
                {/* <div>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="blue">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed">
                        Participants
                      </Text>
                      <Text size="lg" fw={700}>
                        {poll.participants.toLocaleString()}
                      </Text>
                    </div>
                  </Group>
                </div> */}
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
                        {poll.totalVotes.toLocaleString()}
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
                    {poll.options.map((option) => (
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
                          label={option.optionText}
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
                  {poll.options
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
          </Paper>
        </Box>

        {/* Sidebar */}
        <Stack gap="md">
          {/* Leading Option */}
          {poll.totalVotes > 0 && (
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
                    {topOption?.optionText}
                  </Title>
                  <RingProgress
                    sections={[
                      {
                        value:
                          poll.totalVotes > 0
                            ? Math.round(
                                (topOption?.votes / poll.totalVotes) * 100
                              )
                            : 0,
                        color: "blue",
                      },
                    ]}
                    label={
                      <Text c="blue" fw={700} ta="center" size="xl">
                        {poll.totalVotes > 0
                          ? Math.round(
                              (topOption?.votes / poll.totalVotes) * 100
                            )
                          : 0}
                        %
                      </Text>
                    }
                    size={120}
                    thickness={12}
                    mt="md"
                  />
                </div>
              </Stack>
            </Card>
          )}

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
                  {poll.isPublic ? "Public" : "Private"}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Created
                </Text>
                <Text size="sm" fw={500} mt={4}>
                  {new Date(poll.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Expires
                </Text>
                <Text size="sm" fw={500} mt={4}>
                  {new Date(poll.expiresAt).toLocaleDateString()}
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
