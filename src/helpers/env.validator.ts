const mandatoryEnvVars = ["PORT", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_STORAGE"];

export const validateEnvironmentVariables = (): void => {
  let hasMissingEnvVar = false;

  for (const envVar of mandatoryEnvVars) {
    if (process.env[envVar] === undefined) {
      console.error(`Missing environment variable: ${envVar}`);
      hasMissingEnvVar = true;
    }
  }

  if (hasMissingEnvVar) throw new Error("Missing mandatory environment variables");
};
