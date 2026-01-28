import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginWithGoogle,
  loginWithEmail,
  clearError,
} from "../store/slices/authSlice";
import {
  Alert,
  Button,
  TextInput,
  Title,
  Stack,
  Divider,
  Text,
  Group,
  PasswordInput,
  Anchor,
  Box,
  Flex,
  ThemeIcon,
  rem,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBrandGoogle,
  IconAlertCircle,
  IconSparkles,
  IconArrowLeft,
  IconFingerprint,
  IconLock,
} from "@tabler/icons-react";
import { loginSchema } from "../utils/validation/authValidation";
import { translateFirebaseError } from "../utils/translateFirebaseError";

const LoginPage = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const { error } = loginSchema.validate(values, { abortEarly: false });
      if (!error) return {};
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    },
  });

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setLocalLoading(true);
    try {
      dispatch(clearError());
      const result = await dispatch(loginWithGoogle());
      if (result.type === "auth/loginWithGoogle/fulfilled") {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEmailLogin = async (values) => {
    try {
      dispatch(clearError());
      const result = await dispatch(
        loginWithEmail({ email: values.email, password: values.password }),
      );
      if (result.type === "auth/loginWithEmail/fulfilled") {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Box
      style={{ height: "100vh", overflow: "auto" }}
      className="main-container"
    >
      <Grid
        gutter={0}
        style={{ height: "100vh" }}
        styles={{ inner: { height: "100%" } }}
        className="main-grid"
      >
        {/* Left Side: Brand & Visuals */}
        <Grid.Col
          span={{ base: 0, md: 5, lg: 4 }}
          visibleFrom="md"
          className="main-left"
        >
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
                top: "10%",
                left: "-10%",
                width: "300px",
                height: "300px",
                background: "rgba(255,255,255,0.1)",
                filter: "blur(80px)",
                borderRadius: "50%",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: "10%",
                right: "-10%",
                width: "200px",
                height: "200px",
                background: "rgba(0,0,0,0.1)",
                filter: "blur(60px)",
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
                  Welcome <br /> Back to the <br /> Community.
                </Title>
                <Text
                  mt="xl"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: rem(18),
                    maxWidth: "300px",
                  }}
                >
                  Join thousands of others in making decisions that matter.
                </Text>
              </Box>
            </Stack>

            <Box>
              <Text size="sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                © 2026 POLLR Platform.
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
                  Sign In
                </Title>
                <Text c="dimmed" size="sm">
                  Enter your credentials to access your account
                </Text>
              </Stack>

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Authentication Failed"
                  color="red"
                  variant="light"
                  mb="xl"
                  onClose={() => dispatch(clearError())}
                  withCloseButton
                >
                  {translateFirebaseError(error)}
                </Alert>
              )}

              <form onSubmit={form.onSubmit(handleEmailLogin)}>
                <Stack gap="lg">
                  <TextInput
                    label="Email Address"
                    labelProps={{ style: { color: "white" } }}
                    placeholder="your@email.com"
                    size="md"
                    radius="md"
                    leftSection={<IconFingerprint size={18} stroke={1.5} />}
                    {...form.getInputProps("email")}
                  />

                  <Box>
                    <PasswordInput
                      label="Password"
                      labelProps={{ style: { color: "white" } }}
                      placeholder="Your secure password"
                      size="md"
                      radius="md"
                      leftSection={<IconLock size={18} stroke={1.5} />}
                      {...form.getInputProps("password")}
                    />
                    <Group justify="flex-end" mt={5}>
                      <Anchor
                        component={Link}
                        to="/forgot-password"
                        size="xs"
                        c="dimmed"
                      >
                        Forgot password?
                      </Anchor>
                    </Group>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    radius="md"
                    loading={loading}
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>

              <Divider
                label="Or continue with"
                labelPosition="center"
                my={30}
              />

              <Button
                variant="default"
                fullWidth
                size="md"
                radius="md"
                leftSection={<IconBrandGoogle size={20} />}
                onClick={handleGoogleLogin}
                loading={localLoading}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
              >
                Sign In With Google
              </Button>

              <Text ta="center" mt={40} size="sm" c="dimmed">
                Don't have an account yet?{" "}
                <Anchor fw={700} component={Link} to="/register">
                  Create account
                </Anchor>
              </Text>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default LoginPage;
