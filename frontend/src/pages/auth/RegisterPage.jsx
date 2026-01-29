import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerWithEmail, clearError } from "../../store/slices/authSlice";
import {
  Alert,
  Button,
  TextInput,
  Title,
  Stack,
  Text,
  PasswordInput,
  Anchor,
  Box,
  Grid,
  rem,
  Flex,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconSparkles,
  IconUserPlus,
  IconMail,
  IconLock,
  IconArrowLeft,
} from "@tabler/icons-react";
import { registerSchema } from "../../utils/validation/authValidation";
import { translateFirebaseError } from "../../utils/translateFirebaseError";

const RegisterPage = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const { error } = registerSchema.validate(values, { abortEarly: false });
      if (!error) return {};
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleRegister = async (values) => {
    try {
      dispatch(clearError());
      const result = await dispatch(
        registerWithEmail({
          email: values.email,
          password: values.password,
          displayName: values.name,
        }),
      );
      if (result.type === "auth/registerWithEmail/fulfilled") {
        const loggedInUser = result.payload;
        if (loggedInUser?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Box style={{ height: "100vh", overflow: "auto" }}>
      <Grid
        gutter={0}
        style={{ height: "100vh" }}
        styles={{ inner: { height: "100%" } }}
      >
        {/* Left Side: Brand & Visuals */}
        <Grid.Col span={{ base: 0, md: 5, lg: 4 }} visibleFrom="md">
          <Box
            style={{
              height: "100%",
              background: "var(--joy-gradient)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: rem(60),
            }}
          >
            {/* Abstract Blobs */}
            <Box
              style={{
                position: "absolute",
                top: "20%",
                right: "-5%",
                width: "250px",
                height: "250px",
                background: "rgba(255,255,255,0.15)",
                filter: "blur(70px)",
                borderRadius: "50%",
              }}
            />

            <Stack>
              <Flex align="center" gap="xs">
                <ThemeIcon size="xl" radius="md" variant="white" c="blue">
                  <IconSparkles size={rem(24)} />
                </ThemeIcon>
                <Text
                  size="xl"
                  fw={800}
                  style={{ color: "white", letterSpacing: rem(1) }}
                >
                  POLLR
                </Text>
              </Flex>

              <Box mt={80}>
                <Title
                  order={1}
                  style={{
                    color: "white",
                    fontSize: rem(48),
                    lineHeight: 1.1,
                    fontWeight: 900,
                  }}
                >
                  Join the <br /> Future of <br /> Feedback.
                </Title>
                <Text
                  mt="xl"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: rem(18),
                    maxWidth: "300px",
                  }}
                >
                  Create your account and start capturing real-time insights
                  today.
                </Text>
              </Box>
            </Stack>

            <Box>
              <Text size="sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Professional polling simplified.
              </Text>
            </Box>
          </Box>
        </Grid.Col>

        {/* Right Side: Form */}
        <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
          <Box
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: rem(40),
              background: "#0f172a",
            }}
          >
            {/* Mobile Logo */}
            <Flex hiddenFrom="md" justify="center" mb={40}>
              <Flex align="center" gap="xs">
                <ThemeIcon
                  size="lg"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  <IconSparkles size={18} />
                </ThemeIcon>
                <Text size="lg" fw={800} c="blue">
                  POLLR
                </Text>
              </Flex>
            </Flex>

            <Box style={{ maxWidth: rem(450), width: "100%", margin: "auto" }}>
              <Stack mb={40}>
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<IconArrowLeft size={16} />}
                  component={Link}
                  to="/"
                  style={{ width: "fit-content", padding: 0 }}
                >
                  Back to Home
                </Button>
                <Title fw={900} style={{ fontSize: rem(32), color: "white" }}>
                  Join POLLR
                </Title>
                <Text c="dimmed" size="sm">
                  Create your free account and start polling
                </Text>
              </Stack>

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Registration Failed"
                  color="red"
                  variant="light"
                  mb="xl"
                  onClose={() => dispatch(clearError())}
                  withCloseButton
                  styles={{
                    message: { color: "white" },
                  }}
                >
                  {translateFirebaseError(error)}
                </Alert>
              )}

              <form onSubmit={form.onSubmit(handleRegister)}>
                <Stack gap="lg">
                  <TextInput
                    label="Full Name"
                    labelProps={{ style: { color: "white" } }}
                    placeholder="Enter your full name"
                    size="md"
                    radius="md"
                    leftSection={<IconUserPlus size={18} stroke={1.5} />}
                    {...form.getInputProps("name")}
                  />

                  <TextInput
                    label="Email Address"
                    labelProps={{ style: { color: "white" } }}
                    placeholder="your@email.com"
                    size="md"
                    radius="md"
                    leftSection={<IconMail size={18} stroke={1.5} />}
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    label="Password"
                    labelProps={{ style: { color: "white" } }}
                    placeholder="Create a secure password"
                    size="md"
                    radius="md"
                    leftSection={<IconLock size={18} stroke={1.5} />}
                    {...form.getInputProps("password")}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    labelProps={{ style: { color: "white" } }}
                    placeholder="Repeat your password"
                    size="md"
                    radius="md"
                    leftSection={<IconLock size={18} stroke={1.5} />}
                    {...form.getInputProps("confirmPassword")}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    radius="md"
                    loading={loading}
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                    mt="md"
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>

              <Text ta="center" mt={40} size="sm" c="dimmed">
                Already have an account?{" "}
                <Anchor fw={700} component={Link} to="/login">
                  Sign In
                </Anchor>
              </Text>

              <Box mt={40}>
                <Divider label="Security" labelPosition="center" mb="lg" />
                <Text size="xs" c="dimmed" ta="center">
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy. Your data is encrypted and secure.
                </Text>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default RegisterPage;
