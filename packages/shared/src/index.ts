/** Shared constants and types for ExamEdge monorepo. */
export const APP_VERSION = "0.1.0" as const;

export type HealthStatus = {
  status: "ok";
  version: typeof APP_VERSION;
};
