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
  ThemeIcon,
  Divider,
  Card,
  SimpleGrid,
  CopyButton,
  ActionIcon,
  Tooltip,
  Box,
  RingProgress,
  Alert,
  Modal,
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconChartBar,
  IconEdit,
  IconQrcode,
  IconCopy,
  IconCheck,
  IconShare,
  IconTrophy,
  IconAlertCircle,
  IconArrowLeft,
  IconDownload,
  IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getPollById, deletePoll } from "../../store/slices/pollSlice";
import DeleteModal from "../../components/DeleteModal";
import QRCodeModal from "../../components/QRCodeModal";

const MyPollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { poll, loading } = useSelector((state) => state.poll);

  const [qrModalOpened, setQrModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  useEffect(() => {
    dispatch(getPollById(id));
  }, [dispatch, id]);

  const calculateTimeLeft = () => {
    if (!poll?.hasTimeLimit || !poll?.endTime) return "No time limit";

    const now = new Date();
    const expiry = new Date(poll.endTime);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Less than 1 hour left";
  };

  const handleEdit = () => {
    navigate(`/poll/${id}/edit`);
  };

  const handleDelete = () => {
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletePoll(id));
      notifications.show({
        title: "Poll Deleted",
        message: "Your poll has been deleted successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setDeleteModalOpened(false);
      navigate("/my-polls");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete poll",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      setDeleteModalOpened(false);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `poll-${poll?.roomCode}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareUrl = `${window.location.origin}/join/${poll?.roomCode}`;

  const totalVotes =
    poll?.options?.reduce((sum, opt) => sum + opt.votes, 0) || 0;
  const topOption = poll?.options?.reduce(
    (prev, current) => (prev.votes > current.votes ? prev : current),
    poll?.options?.[0]
  );

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!poll) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Poll not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      {/* Back Button */}
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/my-polls")}
        mb="lg"
      >
        Back to My Polls
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
                <Group gap="xs">
                  <Tooltip label="Edit Poll">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="lg"
                      onClick={handleEdit}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete Poll">
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="lg"
                      onClick={handleDelete}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              <Title order={1}>{poll.title}</Title>

              <Text c="dimmed" size="sm">
                {poll.description}
              </Text>

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
                        Total Votes
                      </Text>
                      <Text size="lg" fw={700}>
                        {totalVotes.toLocaleString()}
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
                        Options
                      </Text>
                      <Text size="lg" fw={700}>
                        {poll.options?.length || 0}
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

            {/* Results Section */}
            <Stack gap="md">
              <Title order={3}>Live Results</Title>

              <Stack gap="lg">
                {[...(poll.options || [])]
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, index) => {
                    const percentage =
                      totalVotes > 0
                        ? Math.round((option.votes / totalVotes) * 100)
                        : 0;

                    return (
                      <Paper key={option._id} p="md" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Group gap="xs">
                            {index === 0 && totalVotes > 0 && (
                              <ThemeIcon
                                color="yellow"
                                variant="light"
                                size="sm"
                              >
                                <IconTrophy size={14} />
                              </ThemeIcon>
                            )}
                            <Text fw={500}>{option.optionText}</Text>
                          </Group>
                          <Group gap="md">
                            <Text size="sm" c="dimmed">
                              {option.votes.toLocaleString()} votes
                            </Text>
                            <Text size="lg" fw={700} c="blue">
                              {percentage}%
                            </Text>
                          </Group>
                        </Group>
                        <Progress
                          value={percentage}
                          size="lg"
                          radius="md"
                          animated
                          color={index === 0 ? "blue" : "gray"}
                        />
                      </Paper>
                    );
                  })}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Stack gap="md">
          {/* Leading Option */}
          {totalVotes > 0 && (
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
                          totalVotes > 0
                            ? Math.round((topOption?.votes / totalVotes) * 100)
                            : 0,
                        color: "blue",
                      },
                    ]}
                    label={
                      <Text c="blue" fw={700} ta="center" size="xl">
                        {totalVotes > 0
                          ? Math.round((topOption?.votes / totalVotes) * 100)
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
                <Text fw={500}>Share Poll</Text>
              </Group>

              {/* Room Code */}
              <div>
                <Text size="xs" c="dimmed" mb={4}>
                  Room Code
                </Text>
                <Group gap="xs">
                  <Paper
                    p="sm"
                    withBorder
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <Text size="xl" fw={700} ff="monospace">
                      {poll.roomCode}
                    </Text>
                  </Paper>
                  <CopyButton value={poll.roomCode}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied!" : "Copy code"}>
                        <ActionIcon
                          color={copied ? "teal" : "blue"}
                          variant="light"
                          size="lg"
                          onClick={copy}
                        >
                          {copied ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconCopy size={18} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              </div>

              <Divider />

              {/* QR Code Button */}
              <Button
                variant="light"
                leftSection={<IconQrcode size={18} />}
                onClick={() => setQrModalOpened(true)}
                fullWidth
              >
                Show QR Code
              </Button>

              {/* Copy Link */}
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
                    {copied ? "Link Copied!" : "Copy Poll Link"}
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
                <Badge
                  color={calculateTimeLeft() === "Expired" ? "red" : "green"}
                  variant="light"
                  mt={4}
                >
                  {calculateTimeLeft() === "Expired" ? "Closed" : "Active"}
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
              {poll.hasTimeLimit && (
                <div>
                  <Text size="xs" c="dimmed">
                    Expires
                  </Text>
                  <Text size="sm" fw={500} mt={4}>
                    {new Date(poll.endTime).toLocaleDateString()}
                  </Text>
                </div>
              )}
            </Stack>
          </Card>
        </Stack>
      </SimpleGrid>

      {/* QR Code Modal */}
      <QRCodeModal
        qrModalOpened={qrModalOpened}
        setQrModalOpened={setQrModalOpened}
        poll={poll}
        downloadQRCode={downloadQRCode}
        shareUrl={shareUrl}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        deleteModalOpened={deleteModalOpened}
        setDeleteModalOpened={setDeleteModalOpened}
        poll={poll}
        confirmDelete={confirmDelete}
      />
    </Container>
  );
};

export default MyPollDetailPage;
