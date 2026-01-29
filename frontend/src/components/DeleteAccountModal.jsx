import { Button, Group, Modal, Stack, Text } from "@mantine/core";

const DeleteAccountModal = ({
  opened,
  close,
  handleDeleteAccount,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Delete Account"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          Are you sure you want to delete your account? This action cannot be
          undone and all your data will be permanently deleted.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteAccountModal;
