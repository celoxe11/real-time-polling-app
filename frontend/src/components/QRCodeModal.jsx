import {
  Modal,
  Stack,
  Text,
  Paper,
  Group,
  Button,
  CopyButton,
} from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import { IconDownload, IconCopy, IconCheck } from "@tabler/icons-react";

const QRCodeModal = ({
  qrModalOpened,
  setQrModalOpened,
  poll,
  downloadQRCode,
  shareUrl,
}) => {
  return (
    <Modal
      opened={qrModalOpened}
      onClose={() => setQrModalOpened(false)}
      title="Share Poll via QR Code"
      centered
      size="md"
    >
      <Stack align="center" gap="lg">
        <Text size="sm" c="dimmed" ta="center">
          Scan this QR code to join the poll
        </Text>

        <Paper p="xl" withBorder>
          <QRCodeSVG
            id="qr-code"
            value={shareUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </Paper>

        <Stack gap="xs" style={{ width: "100%" }}>
          <Text size="xs" c="dimmed" ta="center">
            Room Code:{" "}
            <Text component="span" fw={700} ff="monospace">
              {poll.roomCode}
            </Text>
          </Text>

          <Group grow>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={downloadQRCode}
            >
              Download QR
            </Button>
            <CopyButton value={shareUrl}>
              {({ copied, copy }) => (
                <Button
                  variant="light"
                  color={copied ? "teal" : "blue"}
                  leftSection={
                    copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                  }
                  onClick={copy}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default QRCodeModal;
