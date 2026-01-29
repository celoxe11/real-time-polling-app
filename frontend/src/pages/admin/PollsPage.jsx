import {
  Container,
  Title,
  Text,
  Paper,
  Table,
  Group,
  Avatar,
  Badge,
  ActionIcon,
  Tooltip,
  TextInput,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconSearch,
  IconTrash,
  IconCircleCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPolls,
  removePoll,
  clearAdminStatus,
} from "../../store/slices/adminSlice";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const PollsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { polls, loading, error, success } = useSelector(
    (state) => state.admin,
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      notifications.show({
        title: "Success",
        message: success,
        color: "green",
        icon: <IconCircleCheck size={16} />,
      });
      dispatch(clearAdminStatus());
      dispatch(fetchPolls());
    }
    if (error) {
      notifications.show({
        title: "Error",
        message: error,
        color: "red",
      });
      dispatch(clearAdminStatus());
    }
  }, [success, error, dispatch]);

  const handleDeletePoll = (pollId, question) => {
    if (
      window.confirm(`Are you sure you want to delete poll: "${question}"?`)
    ) {
      dispatch(removePoll(pollId));
    }
  };

  const filteredPolls = polls.filter(
    (p) =>
      p.question?.toLowerCase().includes(search.toLowerCase()) ||
      p.createdBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.createdBy?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Poll Management</Title>
          <Text c="dimmed">Monitor and moderate user-created polls</Text>
        </div>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <TextInput
              placeholder="Search by question or creator..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>

          {loading && polls.length === 0 ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Question</Table.Th>
                    <Table.Th>Creator</Table.Th>
                    <Table.Th>Votes</Table.Th>
                    <Table.Th>Created At</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPolls.map((p) => (
                    <Table.Tr key={p._id}>
                      <Table.Td>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {p.question}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            src={p.createdBy?.photoURL}
                            radius="xl"
                            size="sm"
                          />
                          <div>
                            <Text size="sm" fw={500}>
                              {p.createdBy?.name || "Anonymous"}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {p.createdBy?.email}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color="blue" variant="light">
                          {p.options?.reduce(
                            (acc, opt) => acc + (opt.votes || 0),
                            0,
                          )}{" "}
                          votes
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={0} justify="flex-end">
                          <Tooltip label="View Poll">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => navigate(`/poll/${p._id}`)}
                            >
                              <IconExternalLink size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete Poll">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() =>
                                handleDeletePoll(p._id, p.question)
                              }
                            >
                              <IconTrash size={16} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {filteredPolls.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text align="center" py="md" c="dimmed">
                          No polls found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default PollsPage;
