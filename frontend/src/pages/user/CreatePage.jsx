import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  ActionIcon,
  Select,
  NumberInput,
  Switch,
  Badge,
  Box,
  ThemeIcon,
  Divider,
  Alert,
  Transition,
} from "@mantine/core";
import {
  IconPlus,
  IconTrash,
  IconChartBar,
  IconClock,
  IconUsers,
  IconAlertCircle,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  pollSchema,
  optionsSchema,
  joiResolver,
} from "../../utils/validation/pollValidationSchemas";
import { createPoll } from "../../store/slices/pollSlice";

const CreatePage = () => {
  const [localLoading, setLocalLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [options, setOptions] = useState([
    { id: 1, value: "" },
    { id: 2, value: "" },
  ]);

  const categories = [
    { value: "technology", label: "🖥️ Technology" },
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "lifestyle", label: "🌟 Lifestyle" },
    { value: "work", label: "💼 Work" },
    { value: "education", label: "📚 Education" },
    { value: "sports", label: "⚽ Sports" },
    { value: "food", label: "🍕 Food & Drink" },
    { value: "other", label: "📌 Other" },
  ];

  const timeLimitUnits = [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
  ];

  // Initialize useForm with Joi validation
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      category: "",
      isPublic: true,
      hasTimeLimit: false,
      timeLimit: 24,
      timeLimitUnit: "hours",
    },
    validate: joiResolver(pollSchema),
  });

  const handleAddOption = () => {
    if (options.length >= 10) {
      notifications.show({
        title: "Maximum options reached",
        message: "You can add up to 10 options per poll",
        color: "orange",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setOptions([...options, { id: Date.now(), value: "" }]);
  };

  const handleRemoveOption = (id) => {
    if (options.length <= 2) {
      notifications.show({
        title: "Minimum options required",
        message: "A poll must have at least 2 options",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionChange = (id, value) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, value } : option,
      ),
    );
  };

  const validateOptions = () => {
    const { error } = optionsSchema.validate(options, { abortEarly: false });

    if (error) {
      return error.details[0].message;
    }

    return null;
  };

  const handleSubmit = form.onSubmit(async (values) => {
    // Validate options separately
    const optionsError = validateOptions();
    if (optionsError) {
      notifications.show({
        title: "Validation Error",
        message: optionsError,
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    try {
      setLocalLoading(true);

      // Format options to match backend model structure
      const formattedOptions = options
        .filter((opt) => opt.value.trim())
        .map((opt) => ({
          optionText: opt.value.trim(),
          votes: 0,
        }));

      const pollData = {
        ...values,
        options: formattedOptions,
      };

      console.log("Creating poll:", pollData);
      const result = await dispatch(createPoll(pollData));
      console.log("Result: ", result);

      // Check if the action was rejected
      if (result.type === "poll/createPoll/rejected") {
        throw new Error(result.payload || "Failed to create poll");
      }

      // Show success notification
      notifications.show({
        title: "Poll Created! 🎉",
        message: "Your poll has been created successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      // Wait a bit before navigating to show the notification
      setTimeout(() => {
        setLocalLoading(false);
        navigate("/my-polls");
      }, 2000);
    } catch (error) {
      setLocalLoading(false);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create poll",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  });

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Box mb="xl">
        <Group mb="md">
          <ThemeIcon
            size="xl"
            radius="md"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            <IconSparkles size={24} />
          </ThemeIcon>
          <div>
            <Title order={1}>Create New Poll</Title>
            <Text c="dimmed" size="sm">
              Share your question with the community
            </Text>
          </div>
        </Group>

        {/* Quick Tips */}
        <Alert
          variant="light"
          color="blue"
          icon={<IconAlertCircle size={16} />}
        >
          <Text size="sm" fw={500} mb={4}>
            Tips for creating engaging polls:
          </Text>
          <Text size="xs" c="dimmed">
            • Keep your question clear and concise • Provide balanced options •
            Choose the right category • Set an appropriate time limit
          </Text>
        </Alert>
      </Box>

      {/* Main Form */}
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Poll Title */}
            <TextInput
              label="Poll Title"
              placeholder="What's your question?"
              size="md"
              required
              {...form.getInputProps("title")}
              leftSection={<IconChartBar size={16} />}
              description={`${form.values.title.length}/200 characters`}
              maxLength={200}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Provide more context about your poll..."
              size="md"
              minRows={3}
              maxRows={6}
              {...form.getInputProps("description")}
              description="Help people understand what you're asking"
            />

            {/* Category */}
            <Select
              label="Category"
              placeholder="Select a category"
              size="md"
              required
              data={categories}
              {...form.getInputProps("category")}
              searchable
            />

            <Divider label="Poll Options" labelPosition="center" />

            {/* Options */}
            <div>
              <Group justify="space-between" mb="sm">
                <Text size="sm" fw={500}>
                  Options
                </Text>
                <Badge variant="light" color="blue">
                  {options.filter((opt) => opt.value.trim()).length} /{" "}
                  {options.length}
                </Badge>
              </Group>

              <Stack gap="sm">
                {options.map((option, index) => (
                  <Transition
                    key={option.id}
                    mounted={true}
                    transition="slide-left"
                    duration={300}
                    timingFunction="ease"
                  >
                    {(styles) => (
                      <Group style={styles} gap="xs" align="flex-start">
                        <TextInput
                          placeholder={`Option ${index + 1}`}
                          value={option.value}
                          onChange={(e) =>
                            handleOptionChange(option.id, e.target.value)
                          }
                          style={{ flex: 1 }}
                          size="md"
                          leftSection={
                            <Text size="xs" c="dimmed" fw={700}>
                              {index + 1}
                            </Text>
                          }
                        />
                        <ActionIcon
                          color="red"
                          variant="light"
                          size="lg"
                          onClick={() => handleRemoveOption(option.id)}
                          disabled={options.length <= 2}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    )}
                  </Transition>
                ))}
              </Stack>

              <Button
                leftSection={<IconPlus size={16} />}
                variant="light"
                fullWidth
                mt="md"
                onClick={handleAddOption}
                disabled={options.length >= 10}
              >
                Add Option
              </Button>
            </div>

            <Divider label="Settings" labelPosition="center" />

            {/* Settings */}
            <Stack gap="md">
              {/* Public/Private */}
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>
                    Public Poll
                  </Text>
                  <Text size="xs" c="dimmed">
                    Anyone can view and vote on this poll
                  </Text>
                </div>
                <Switch
                  {...form.getInputProps("isPublic", { type: "checkbox" })}
                  size="md"
                  onLabel={<IconUsers size={16} />}
                  offLabel={<IconUsers size={16} />}
                />
              </Group>

              {/* Time Limit */}
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>
                    Set Time Limit
                  </Text>
                  <Text size="xs" c="dimmed">
                    Poll will close automatically
                  </Text>
                </div>
                <Switch
                  {...form.getInputProps("hasTimeLimit", { type: "checkbox" })}
                  size="md"
                  onLabel={<IconClock size={16} />}
                  offLabel={<IconClock size={16} />}
                />
              </Group>

              {form.values.hasTimeLimit && (
                <Transition
                  mounted={form.values.hasTimeLimit}
                  transition="slide-down"
                  duration={300}
                >
                  {(styles) => (
                    <Group style={styles} grow>
                      <NumberInput
                        label="Duration"
                        placeholder="Enter duration"
                        min={1}
                        max={365}
                        {...form.getInputProps("timeLimit")}
                      />
                      <Select
                        label="Unit"
                        data={timeLimitUnits}
                        {...form.getInputProps("timeLimitUnit")}
                      />
                    </Group>
                  )}
                </Transition>
              )}
            </Stack>

            {/* Submit Buttons */}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="subtle"
                onClick={() => navigate("/")}
                disabled={localLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="md"
                loading={localLoading}
                leftSection={<IconCheck size={18} />}
                gradient={{ from: "blue", to: "cyan" }}
                variant="gradient"
              >
                Create Poll
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePage;
