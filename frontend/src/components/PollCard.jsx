import {
  Title,
  Text,
  Button,
  Card,
  Group,
  Badge,
  Stack,
  Progress,
  Avatar,
} from "@mantine/core";
import {
  IconClock,
  IconFlame,
  IconUsers,
  IconCheck,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PollCard = ({ poll, showResults = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Check if current user is owner
  const creatorId = poll.createdBy?._id || poll.createdBy || poll.creator?.id;
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user?.id === creatorId) {
      setIsOwner(true);
    }
  }, [user, creatorId]);

  const handleViewPoll = (pollId) => {
    if (isOwner) {
      navigate(`/my-poll/${pollId}`);
    } else {
      navigate(`/poll/${pollId}`);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      onClick={() => handleViewPoll(poll.id)}
    >
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Badge color="blue" variant="light">
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

        {/* Title & Description */}
        <div>
          <Title order={4} lineClamp={2} mb="xs">
            {poll.title}
          </Title>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {poll.description}
          </Text>
        </div>

        {/* Creator */}
        <Group gap="xs">
          <Avatar
            src={poll.creator?.photoURL || poll.createdBy?.photoURL}
            size="sm"
            radius="xl"
          />
          <Text size="xs" c="dimmed">
            by {poll.creator?.name || poll.createdBy?.name || "Unknown"}
          </Text>
        </Group>

        {/* Results Preview (for trending polls) */}
        {showResults && poll.options && (
          <Stack gap="xs">
            {[...(poll.options || [])]
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 2)
              .map((option, idx) => {
                const percentage =
                  poll.totalVotes > 0
                    ? Math.round((option.votes / poll.totalVotes) * 100)
                    : 0;

                return (
                  <div key={idx}>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm">{option.label}</Text>
                      <Text size="sm" fw={500}>
                        {percentage}%
                      </Text>
                    </Group>
                    <Progress value={percentage} size="sm" />
                  </div>
                );
              })}
            {poll.options.length > 2 && (
              <Text size="xs" c="dimmed">
                +{poll.options.length - 2} more options
              </Text>
            )}
          </Stack>
        )}

        {/* Stats */}
        <Group justify="space-between">
          <Group gap="xs">
            <IconUsers size={16} stroke={1.5} />
            <Text size="sm" fw={500}>
              {poll.participants?.toLocaleString() ||
                poll.totalVotes?.toLocaleString()}{" "}
              participants
            </Text>
          </Group>
          <Group gap="xs">
            <IconClock size={16} stroke={1.5} />
            <Text size="xs" c="dimmed">
              {poll.timeLeft}
            </Text>
          </Group>
        </Group>

        {/* Action Button */}
        <Button
          fullWidth
          variant={poll.hasVoted ? "light" : "filled"}
          leftSection={poll.hasVoted ? <IconCheck size={16} /> : null}
          onClick={() => handleViewPoll(poll.id)}
        >
          {poll.hasVoted ? "View Results" : "Vote Now"}
        </Button>
      </Stack>
    </Card>
  );
};

export default PollCard;
