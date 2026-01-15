import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  ThemeIcon,
  Box,
  rem,
} from "@mantine/core";
import { IconHash, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getPollByRoomCode } from "../../store/slices/pollSlice";

const EnterCodePage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinPoll = async (e) => {
    e.preventDefault();

    if (code.length < 8) {
      notifications.show({
        title: "Invalid Code",
        message: "Please enter an 8-digit room code",
        color: "orange",
      });
      return;
    }

    try {
      setLoading(true);
      const resultAction = await dispatch(getPollByRoomCode(code));

      if (getPollByRoomCode.fulfilled.match(resultAction)) {
        const poll = resultAction.payload;
        notifications.show({
          title: "Poll Found! 🎯",
          message: `Joining: ${poll.title}`,
          color: "green",
        });
        navigate(`/poll/${poll.id}`);
      } else {
        notifications.show({
          title: "Not Found",
          message:
            "No poll found with this room code. Please check and try again.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again later.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py={rem(80)}>
      <Stack align="center" gap="xl">
        {/* Brand/Header */}
        <Stack align="center" gap={0}>
          <Group gap="xs" mb="xs">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              <IconSparkles size={rem(24)} />
            </ThemeIcon>
            <Title
              order={1}
              style={{
                fontSize: rem(42),
                fontWeight: 900,
                letterSpacing: rem(-1),
                background: "linear-gradient(45deg, #228be6 0%, #15aabf 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pollr
            </Title>
          </Group>
          <Text c="dimmed" size="lg" ta="center">
            The instant way to share your voice
          </Text>
        </Stack>

        <Paper
          shadow="xl"
          p={rem(40)}
          radius="lg"
          withBorder
          style={{ width: "100%" }}
        >
          <form onSubmit={handleJoinPoll}>
            <Stack gap="lg">
              <Box>
                <Title order={3} mb="xs" ta="center">
                  Enter Room Code
                </Title>
                <Text size="sm" c="dimmed" ta="center" mb="xl">
                  Type the 8-digit code given by the poll creator
                </Text>
              </Box>

              <TextInput
                placeholder="E.g. 12345678"
                size="xl"
                radius="md"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={8}
                leftSection={<IconHash size={rem(20)} />}
                styles={{
                  input: {
                    textAlign: "center",
                    fontSize: rem(24),
                    fontWeight: 700,
                    letterSpacing: rem(4),
                    "&::placeholder": {
                      letterSpacing: "normal",
                      fontSize: rem(18),
                      fontWeight: 400,
                    },
                  },
                }}
              />

              <Button
                type="submit"
                size="xl"
                radius="md"
                fullWidth
                loading={loading}
                rightSection={<IconArrowRight size={16} />}
                gradient={{ from: "blue", to: "cyan" }}
                variant="gradient"
              >
                Join Poll
              </Button>

              <Text size="xs" c="dimmed" ta="center">
                Check your invitation or QR code to find the room code
              </Text>
            </Stack>
          </form>
        </Paper>

        <Button variant="subtle" color="gray" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
};

export default EnterCodePage;
