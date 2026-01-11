import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerWithEmail, clearError } from "../store/slices/authSlice";
import {
  Alert,
  Button,
  Container,
  TextInput,
  Title,
  Paper,
  Stack,
  Text,
  PasswordInput,
  Anchor,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { registerSchema } from "../utils/validation/authValidation";
import { translateFirebaseError } from "../utils/translateFirebaseError";

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

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (values) => {
    try {
      dispatch(clearError());

      const result = await dispatch(
        registerWithEmail({
          email: values.email,
          password: values.password,
          displayName: values.name,
        })
      );

      if (result.type === "auth/registerWithEmail/fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          Create an Account
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?{" "}
          <Anchor size="sm" component={Link} to="/login">
            Sign in
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

          <form onSubmit={form.onSubmit(handleRegister)}>
            <Stack>
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                {...form.getInputProps("name")}
              />

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

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                {...form.getInputProps("confirmPassword")}
              />

              <Button type="submit" fullWidth loading={loading} mt="md">
                Create Account
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
