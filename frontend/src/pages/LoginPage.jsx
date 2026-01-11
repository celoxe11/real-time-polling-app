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
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBrandGoogle, IconAlertCircle } from "@tabler/icons-react";
import { loginSchema } from "../utils/validation/authValidation";
import { translateFirebaseError } from "../utils/translateFirebaseError";

const LoginPage = () => {
  const [localLoading, setLocalLoading] = useState(false);

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
    setLocalLoading(true);

    try {
      dispatch(clearError());
      const result = await dispatch(loginWithGoogle());

      if (result.type === "auth/loginWithGoogle/fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      // Reset local loading immediately
      setLocalLoading(false);
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
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: "100vw",
        minHeight: "100vh",
      }}
    >
      <Container my={40} w={{ base: "100vw", sm: 400, lg: 500 }}>
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
              title="Registration Failed" // Judul yang lebih bersahabat
              color="red"
              variant="light"
              mb="md"
              onClose={() => dispatch(clearError())}
              withCloseButton
            >
              {translateFirebaseError(error)}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleEmailLogin)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
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
            loading={localLoading}
          >
            Sign In With Google
          </Button>

          <Group justify="space-between" mt="md">
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
