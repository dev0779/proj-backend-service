export const formatValidationErrors = (zodError) => {
  return zodError.errors.map((e) => ({
    field: e.path?.[0],
    message: e.message,
  }));
};

export const successResponse = ({ message, data  }) => ({
  success: true,
  message,
  data,
  errors: [],
});

export const errorResponse = ({ message, errors = [], data = null }) => ({
  success: false,
  message,
  errors,
  data,
});
