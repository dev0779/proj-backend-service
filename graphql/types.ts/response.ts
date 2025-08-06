export type FieldError = { field: string; message: string };
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  errors?: FieldError[];
};