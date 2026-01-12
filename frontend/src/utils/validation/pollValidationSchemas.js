import Joi from "joi";

// Poll form validation schema
export const pollSchema = Joi.object({
  title: Joi.string().min(10).max(200).required().messages({
    "string.empty": "Poll title is required",
    "string.min": "Title must be at least 10 characters",
    "string.max": "Title must not exceed 200 characters",
    "any.required": "Poll title is required",
  }),
  description: Joi.string().allow("").max(1000).messages({
    "string.max": "Description must not exceed 1000 characters",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Please select a category",
    "any.required": "Please select a category",
  }),
  isPublic: Joi.boolean(),
  hasTimeLimit: Joi.boolean(),
  timeLimit: Joi.number()
    .min(1)
    .max(365)
    .when("hasTimeLimit", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "number.min": "Duration must be at least 1",
      "number.max": "Duration must not exceed 365",
    }),
  timeLimitUnit: Joi.string()
    .valid("hours", "days", "weeks")
    .when("hasTimeLimit", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
});

// Poll options validation schema
export const optionsSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.number().required(),
      value: Joi.string().trim().required(),
    })
  )
  .min(2)
  .custom((value, helpers) => {
    // Filter out empty options
    const filledOptions = value.filter((opt) => opt.value.trim());

    if (filledOptions.length < 2) {
      return helpers.error("array.min", {
        message: "At least 2 options are required",
      });
    }

    // Check for unique options (case-insensitive)
    const optionValues = filledOptions.map((opt) =>
      opt.value.trim().toLowerCase()
    );
    const uniqueValues = new Set(optionValues);

    if (uniqueValues.size !== optionValues.length) {
      return helpers.error("array.unique", {
        message: "Options must be unique",
      });
    }

    return value;
  })
  .messages({
    "array.min": "At least 2 options are required",
    "array.unique": "Options must be unique",
  });

// Joi resolver for Mantine form
export const joiResolver = (schema) => (values) => {
  const { error } = schema.validate(values, { abortEarly: false });

  if (!error) return {};

  const errors = {};
  error.details.forEach((detail) => {
    errors[detail.path[0]] = detail.message;
  });

  return errors;
};
