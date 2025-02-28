import pino from "pino";

const istTimeFormatted = () => {
  return `,"time":"${new Intl.DateTimeFormat("en-IN", {
    timeZone: process.env.TZ,
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date())}"`;
};

const logger = pino(
  {
    level: "info",
    timestamp: () => istTimeFormatted(),
    transport: {
      targets: [
        {
          target: "pino-pretty", // Pretty print logs in console
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        },
        {
          target: "pino/file", // Write logs to file
          options: { destination: "./logs/hive.log", mkdir: true, ignore: "pid,hostname" }, // Auto-create folder
        },
      ],
    }
  }
);

export default logger;