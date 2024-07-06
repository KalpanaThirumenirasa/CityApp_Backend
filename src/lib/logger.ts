import pinoLogger, { Logger } from "pino";

let logger: Logger;
export const getLogger = () => {
  if (!logger) {
    const deploymentEnv = process.env.NEXT_PUBLIC_NODE_ENV || "development";
    logger = pinoLogger({
      level: deploymentEnv === "production" ? "info" : "debug",
    });
    console.log(process.env.NEXT_PUBLIC_NODE_ENV);
  }
  return logger;
};

export const getCorrelationId = (headers: Headers) => {
  let correlationId = headers.get("x-correlation-id");
  if (!correlationId) {
    correlationId = crypto.randomUUID();
  }
  return correlationId;
};