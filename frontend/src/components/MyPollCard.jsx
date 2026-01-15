import {
  IconDots,
  IconEdit,
  IconEye,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { Card, Group, Menu, Badge, Title, Text, Button } from "@mantine/core";
import { ActionIcon } from "@mantine/core";

export const MyPollCard = ({
  poll,
  handleViewPoll,
  handleEditPoll,
  handleDeletePoll,
}) => (
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
