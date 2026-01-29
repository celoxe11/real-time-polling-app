import { Group, Modal, Stack, TextInput, Button } from "@mantine/core";

const ChangeProfileModal = ({
  opened,
  close,
  form,
  handleUpdateProfile,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Edit Profile"
      centered
    >
      <form onSubmit={form.onSubmit(handleUpdateProfile)}>
        <Stack gap="md">
          <TextInput
            label="Display Name"
            placeholder="Enter your name"
            {...form.getInputProps("displayName")}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ChangeProfileModal;
