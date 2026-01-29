import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Card,
  Badge,
  rem,
  ThemeIcon,
  Box,
  SimpleGrid,
  Skeleton,
  Flex,
  Avatar,
  TextInput,
} from "@mantine/core";
import {
  IconSparkles,
  IconUsers,
  IconChartBar,
  IconDeviceMobile,
  IconArrowRight,
  IconChecks,
  IconRocket,
  IconHome,
} from "@tabler/icons-react";
import { useNavigate, Link } from "react-router-dom";
import { pollService } from "../services/pollService";
import PollCard from "../components/PollCard";
import { useSelector } from "react-redux";
import { useAuthListener } from "../hooks/useAuthListener";

const LandingPage = () => {
  const navigate = useNavigate();
  const [popularPolls, setPopularPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  useAuthListener();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await pollService.getPopularPolls();
        setPopularPolls(data.slice(0, 3)); // Only show top 3
      } catch (error) {
        console.error("Failed to fetch popular polls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const features = [
    {
      icon: IconUsers,
      title: "Real-time Interaction",
      description:
        "Watch results pour in live as your audience votes from any device.",
      color: "blue",
    },
    {
      icon: IconChecks,
      title: "Easy to Use",
      description:
        "Create complex polls in seconds with our intuitive interface.",
      color: "pink",
    },
    {
      icon: IconChartBar,
      title: "Advanced Analytics",
      description:
        "Deep dive into voting patterns with beautiful, interactive charts.",
      color: "violet",
    },
    {
      icon: IconDeviceMobile,
      title: "Mobile First",
      description:
        "Optimized for the best experience on smartphones and tablets.",
      color: "cyan",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        component="header"
        h={80}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Flex align="center" gap="xs">
              <ThemeIcon
                size="xl"
                radius="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                <IconSparkles size={rem(24)} />
              </ThemeIcon>
              <Text size="lg" fw={800} c="blue">
                POLLR
              </Text>
            </Flex>

            {!isAuthenticated ? (
              <Group visibleFrom="sm">
                <Button
                  variant="subtle"
                  color="gray"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                  component={Link}
                  to="/register"
                >
                  Get Started
                </Button>
              </Group>
            ) : (
              <Group visibleFrom="sm">
                <Button
                  variant="outline"
                  color="blue"
                  component={Link}
                  to="/home"
                  leftSection={<IconHome size={18} />}
                >
                  Dashboard
                </Button>
                <Group
                  gap="xs"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/profile")}
                >
                  <Avatar src={user?.photoURL} radius="xl" size="sm" />
                  <Text size="sm" fw={600} c="white">
                    {user?.displayName || "User"}
                  </Text>
                </Group>
              </Group>
            )}
          </Group>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        pt={120}
        pb={80}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <Container size="xl">
          <Grid align="center" gutter={60}>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="xl">
                <Badge
                  variant="dot"
                  size="lg"
                  color="blue"
                  styles={{ root: { borderWidth: 2 } }}
                >
                  Version 2.0 is out
                </Badge>
                <Title
                  order={1}
                  style={{
                    fontSize: rem(64),
                    lineHeight: 1.1,
                    fontWeight: 900,
                  }}
                >
                  Make Every <span className="hero-text-gradient">Voice</span>{" "}
                  Count in Real-Time
                </Title>
                <Text size="xl" c="dimmed" maw={600}>
                  Create, share, and analyze polls instantly. From casual
                  opinions to serious business decisions, POLLR makes group
                  feedback seamless.
                </Text>
                <Group gap="md">
                  <Button
                    size="xl"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                    rightSection={<IconArrowRight size={20} />}
                    component={Link}
                    to={isAuthenticated ? "/home" : "/register"}
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
                  </Button>
                  <Button
                    size="xl"
                    radius="md"
                    variant="outline"
                    color="blue"
                    leftSection={<IconRocket size={20} />}
                    onClick={() => {
                      const popularSection =
                        document.getElementById("popular-polls");
                      popularSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Explore Polls
                  </Button>
                </Group>
                <Group gap="lg" mt="xl">
                  <AvatarGroup users={["", "", "", ""]} />
                  <Text size="sm" c="dimmed">
                    Joined by{" "}
                    <span style={{ color: "grey", fontWeight: 600 }}>
                      10,000+
                    </span>{" "}
                    voters this week
                  </Text>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }} visibleFrom="md">
              <Box className="floating" style={{ position: "relative" }}>
                {/* Visual Representation of Polling */}
                <div
                  style={{
                    width: "100%",
                    height: "400px",
                    background: "var(--joy-gradient)",
                    borderRadius: "30px",
                    opacity: 0.15,
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    filter: "blur(40px)",
                  }}
                />
                <Card
                  className="glass-card"
                  p="xl"
                  shadow="xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  }}
                >
                  <Stack gap="lg">
                    <Group justify="space-between">
                      <Text fw={700} size="lg">
                        Live Results
                      </Text>
                      <Badge color="green" variant="light">
                        Active
                      </Badge>
                    </Group>
                    <PollPreviewOption
                      label="Next Project Topic"
                      percentage={65}
                      color="blue"
                    />
                    <PollPreviewOption
                      label="Team Building Location"
                      percentage={25}
                      color="pink"
                    />
                    <PollPreviewOption
                      label="Budget Allocation"
                      percentage={10}
                      color="violet"
                    />
                    <Group justify="center" mt="md">
                      <Text size="xs" c="dimmed">
                        Refresh in 2s...
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={80} style={{ background: "#0f172a" }}>
        <Container size="xl">
          <Stack align="center" mb={60} gap="xs">
            <Text c="blue" fw={700} tt="uppercase" lts={1}>
              The Experience
            </Text>
            <Title order={2} ta="center" size={rem(42)} fw={800} c="white">
              Everything you need for <br /> perfect feedback
            </Title>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card"
                p="xl"
                style={{ transition: "transform 0.3s ease", cursor: "default" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-10px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <ThemeIcon
                  size={50}
                  radius="md"
                  variant="light"
                  color={feature.color}
                  mb="xl"
                >
                  <feature.icon size={26} stroke={1.5} />
                </ThemeIcon>
                <Text fw={700} size="lg" mb="sm">
                  {feature.title}
                </Text>
                <Text size="sm" c="dimmed" lh={1.6}>
                  {feature.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Popular Polls Section */}
      <Box id="popular-polls" py={100} className="popular-polls-section">
        <Container size="xl">
          <Group justify="space-between" mb={50} align="flex-end">
            <Stack gap={5}>
              <Text c="blue" fw={700} tt="uppercase" lts={1}>
                Trending Now
              </Text>
              <Title order={2} size={rem(36)} fw={800}>
                Popular Community Polls
              </Title>
            </Stack>
            <Button
              variant="light"
              color="blue"
              rightSection={<IconArrowRight size={16} />}
              component={Link}
              to="/register"
            >
              View All Polls
            </Button>
          </Group>

          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} h={300} radius="md" />
              ))}
            </SimpleGrid>
          ) : popularPolls.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {popularPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} showResults={true} />
              ))}
            </SimpleGrid>
          ) : (
            <Box ta="center" py={50}>
              <Text c="dimmed">
                No popular polls found. Create the first one!
              </Text>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={100}>
        <Container size="md">
          <Card
            radius="xl"
            p={60}
            className="glass-card"
            style={{
              background: "var(--joy-gradient)",
              border: "none",
              textAlign: "center",
            }}
          >
            <Stack align="center" gap="xl">
              <Title order={2} size={rem(48)} style={{ color: "white" }}>
                Ready to start polling?
              </Title>
              <Text
                size="xl"
                maw={600}
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Join thousands of users who are already using POLLR to make
                better decisions together.
              </Text>
              <Button
                size="xl"
                radius="md"
                bg="white"
                c="blue"
                component={Link}
                to={isAuthenticated ? "/home" : "/register"}
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        py={50}
        mt={100}
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
      >
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Flex align="center" gap="xs" mb="md">
                <ThemeIcon
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  <IconSparkles size={16} />
                </ThemeIcon>
                <Text size="lg" fw={800} c="blue">
                  POLLR
                </Text>
              </Flex>
              <Text size="sm" c="dimmed" maw={300}>
                The world's most intuitive real-time polling platform for teams
                and communities.
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 4 }}>
              <Text fw={700} mb="lg">
                Product
              </Text>
              <Stack gap="xs">
                <Text size="sm" c="dimmed" component={Link} to="#">
                  Features
                </Text>
                <Text size="sm" c="dimmed" component={Link} to="#">
                  Pricing
                </Text>
                <Text size="sm" c="dimmed" component={Link} to="#">
                  Security
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 4 }}>
              <Text fw={700} mb="lg">
                Resources
              </Text>
              <Stack gap="xs">
                <Text size="sm" c="dimmed" component={Link} to="#">
                  Documentation
                </Text>
                <Text size="sm" c="dimmed" component={Link} to="#">
                  Help Center
                </Text>
                <Text size="sm" c="dimmed" component={Link} to="#">
                  API
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
          <Box
            mt={60}
            pt={20}
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
          >
            <Text size="xs" c="dimmed" ta="center">
              © {new Date().getFullYear()} POLLR Platform. All rights reserved.
              Built with passion for better decisions.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// Helper components
const PollPreviewOption = ({ label, percentage, color }) => (
  <Box>
    <Group justify="space-between" mb={5}>
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Text size="sm" fw={700}>
        {percentage}%
      </Text>
    </Group>
    <Box
      h={8}
      style={{
        background: "rgba(255,255,255,0.1)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <Box
        h="100%"
        w={`${percentage}%`}
        style={{
          background: `var(--mantine-color-${color}-filled)`,
          borderRadius: 4,
        }}
      />
    </Box>
  </Box>
);

const AvatarGroup = ({ users }) => {
  return (
    <Avatar.Group spacing="sm">
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
        radius="xl"
      />
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
        radius="xl"
      />
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png"
        radius="xl"
      />
      <Avatar radius="xl">+12k</Avatar>
    </Avatar.Group>
  );
};

export default LandingPage;
