/**
 * Shared result shape for admin form/server actions. Actions return this
 * (instead of throwing) so the UI can show a clear message and per-field
 * errors via useActionState. Plain module — safe to import from both client
 * components and "use server" files.
 */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const idleState: FormState = { status: "idle" };
