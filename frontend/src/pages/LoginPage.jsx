import { useEffect } from "react";
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
  Container,
  TextInput,
  Title,
  Paper,
  Stack,
  Divider,
  Text,
  Group,
  PasswordInput,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBrandGoogle, IconAlertCircle } from "@tabler/icons-react";

const LoginPage = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    try {
      dispatch(clearError());
      const result = await dispatch(loginWithGoogle());

      if (result.type === "auth/loginWithGoogle/fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleEmailLogin = async (values) => {
    try {
      dispatch(clearError());

      const result = await dispatch(
        loginWithEmail({ email: values.email, password: values.password })
      );

      if (result.type === "auth/loginWithEmail/fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            mb="md"
            onClose={() => dispatch(clearError())}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleEmailLogin)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Button
          variant="default"
          fullWidth
          leftSection={<IconBrandGoogle size={16} />}
          onClick={handleGoogleLogin}
          loading={loading}
        >
          Google
        </Button>

        <Group justify="space-between" mt="md">
          <Anchor component={Link} to="/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
      </Paper>
    </Container>
  );
};

export default LoginPage;
