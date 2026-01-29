import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearError,
  clearSuccess,
} from "../../store/slices/authSlice";
import {
  Alert,
  Button,
  TextInput,
  Title,
  Stack,
  Text,
  Anchor,
  Box,
  Flex,
  ThemeIcon,
  rem,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertCircle,
  IconSparkles,
  IconArrowLeft,
  IconFingerprint,
  IconCheck,
} from "@tabler/icons-react";
import { forgotPasswordSchema } from "../../utils/validation/authValidation";
import { translateFirebaseError } from "../../utils/translateFirebaseError";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.auth);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const { error } = forgotPasswordSchema.validate(values, {
        abortEarly: false,
      });
      if (!error) return {};
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return errors;
    },
  });

  useEffect(() => {
    // Clear state on mount and unmount
    dispatch(clearError());
    dispatch(clearSuccess());
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = async (values) => {
    dispatch(resetPassword(values.email));
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
                  Regain <br /> Access to your <br /> Account.
                </Title>
                <Text
                  mt="xl"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: rem(18),
                    maxWidth: "300px",
                  }}
                >
                  We'll help you get back to making decisions that matter.
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
                  to="/login"
                  style={{ width: "fit-content", padding: 0 }}
                >
                  Back to Login
                </Button>
                <Title fw={900} style={{ fontSize: rem(32), color: "white" }}>
                  Forgot Password
                </Title>
                <Text c="dimmed" size="sm">
                  Enter your email address and we'll send you a link to reset
                  your password
                </Text>
              </Stack>

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error"
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

              {success && (
                <Alert
                  icon={<IconCheck size={16} />}
                  title="Success"
                  color="teal"
                  variant="light"
                  mb="xl"
                  onClose={() => dispatch(clearSuccess())}
                  withCloseButton
                  styles={{
                    message: { color: "white" },
                  }}
                >
                  {success}
                </Alert>
              )}

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="lg">
                  <TextInput
                    label="Email Address"
                    labelProps={{ style: { color: "white" } }}
                    placeholder="your@email.com"
                    size="md"
                    radius="md"
                    leftSection={<IconFingerprint size={18} stroke={1.5} />}
                    {...form.getInputProps("email")}
                    disabled={!!success}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    radius="md"
                    loading={loading}
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                    disabled={!!success}
                  >
                    Send Reset Link
                  </Button>
                </Stack>
              </form>

              <Text ta="center" mt={40} size="sm" c="dimmed">
                Remember your password?{" "}
                <Anchor fw={700} component={Link} to="/login">
                  Sign In
                </Anchor>
              </Text>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
