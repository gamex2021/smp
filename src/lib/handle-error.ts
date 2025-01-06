import { ConvexError } from "convex/values";
import * as z from "zod";
import { toast } from "sonner";

export const unknownError = "Something went wrong, try again.";

export function getErrorMessage(error: unknown) {
  if (error instanceof ConvexError) {
    return error.data as unknown as string;
  } else if (error instanceof z.ZodError) {
    return error.errors[0]?.message ?? unknownError;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  console.log(errorMessage);
  return toast.error(errorMessage);
}
