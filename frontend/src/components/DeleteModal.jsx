import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";

const DeleteModal = ({
  deleteModalOpened,
  setDeleteModalOpened,
  poll,
  confirmDelete,
}) => {
  return (
    <Modal
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      title={
        <Group gap="sm">
          <ThemeIcon color="red" size="lg" radius="md">
            <IconAlertCircle size={20} />
          </ThemeIcon>
          <Text fw={600} size="lg">
            Delete Poll?
          </Text>
        </Group>
      }
      centered
      size="md"
    >
      <Stack gap="lg">
        <Alert color="red" variant="light" icon={<IconTrash size={16} />}>
          <Text size="sm" fw={500}>
            This action cannot be undone!
          </Text>
        </Alert>

        <Text size="sm" c="dimmed">
          Are you sure you want to delete{" "}
          <Text component="span" fw={600} c="dark">
            "{poll?.title}"
          </Text>
          ? All votes and data will be permanently removed.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            color="gray"
            onClick={() => setDeleteModalOpened(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={confirmDelete}
          >
            Delete Poll
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteModal;
