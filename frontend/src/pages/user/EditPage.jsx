import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ThemeIcon,
  Divider,
  Transition,
  Loader,
  Alert,
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
  IconArrowLeft,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  pollSchema,
  optionsSchema,
  joiResolver,
} from "../../utils/validation/pollValidationSchemas";
import { getPollById, updatePoll } from "../../store/slices/pollSlice";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { poll, loading } = useSelector((state) => state.poll);

  const [localLoading, setLocalLoading] = useState(false);
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

  // Load poll data
  useEffect(() => {
    dispatch(getPollById(id));
  }, [dispatch, id]);

  // Pre-fill form when poll data is loaded
  useEffect(() => {
    if (poll && poll._id === id) {
      form.setValues({
        title: poll.title || "",
        description: poll.description || "",
        category: poll.category || "",
        isPublic: poll.isPublic ?? true,
        hasTimeLimit: poll.hasTimeLimit ?? false,
        timeLimit: poll.timeLimit || 24,
        timeLimitUnit: poll.timeLimitUnit || "hours",
      });

      // Set options
      if (poll.options && poll.options.length > 0) {
        setOptions(
          poll.options.map((opt, index) => ({
            id: index + 1,
            value: opt.optionText || "",
          })),
        );
      }
    }
  }, [poll, id]);

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

      console.log("Updating poll:", pollData);
      const result = await dispatch(updatePoll({ id, pollData }));
      console.log("Result: ", result);

      // Check if the action was rejected
      if (result.type === "poll/updatePoll/rejected") {
        throw new Error(result.payload || "Failed to update poll");
      }

      // Show success notification
      notifications.show({
        title: "Poll Updated! ✅",
        message: "Your poll has been updated successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      // Wait a bit before navigating to show the notification
      setTimeout(() => {
        setLocalLoading(false);
        navigate(`/my-poll/${id}`);
      }, 2000);
    } catch (error) {
      setLocalLoading(false);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update poll",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  });

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" gap="md" py="xl">
          <Loader size="lg" />
          <Text c="dimmed">Loading poll data...</Text>
        </Stack>
      </Container>
    );
  }

  if (!poll || poll._id !== id) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Poll not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      {/* Back Button */}
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate(`/my-poll/${id}`)}
        mb="lg"
      >
        Back to Poll Details
      </Button>

      <Paper shadow="lg" p="xl" radius="lg" withBorder>
        {/* Header */}
        <Group gap="sm" mb="xl">
          <ThemeIcon
            size="xl"
            radius="md"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            <IconSparkles size={24} />
          </ThemeIcon>
          <div>
            <Title order={2}>Edit Poll</Title>
            <Text size="sm" c="dimmed">
              Update your poll details and settings
            </Text>
          </div>
        </Group>

        <Divider mb="xl" />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Poll Title */}
            <div>
              <TextInput
                label="Poll Title"
                placeholder="What would you like to ask?"
                size="md"
                leftSection={<IconChartBar size={18} />}
                {...form.getInputProps("title")}
                maxLength={200}
              />
              <Group justify="space-between" mt={4}>
                <Text size="xs" c="dimmed">
                  Make it clear and engaging
                </Text>
                <Text size="xs" c="dimmed">
                  {form.values.title.length}/200
                </Text>
              </Group>
            </div>

            {/* Description */}
            <Textarea
              label="Description (Optional)"
              placeholder="Add more context to your poll..."
              size="md"
              minRows={3}
              maxRows={6}
              {...form.getInputProps("description")}
              maxLength={1000}
            />

            {/* Category */}
            <Select
              label="Category"
              placeholder="Select a category"
              data={categories}
              size="md"
              {...form.getInputProps("category")}
            />

            <Divider />

            {/* Poll Options */}
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

            <Divider />

            {/* Settings */}
            <Stack gap="md">
              <Text size="sm" fw={500}>
                Settings
              </Text>

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
                onClick={() => navigate(`/my-poll/${id}`)}
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
                Update Poll
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditPage;
