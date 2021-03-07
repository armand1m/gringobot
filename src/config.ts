require('dotenv').config();
import * as yup from 'yup';

const createRequiredErrMessage = (
  envVar: string,
  possibleValues?: string[]
) => {
  const initialMessage = `${envVar} environment variable is required.`;

  if (!possibleValues || possibleValues.length === 0) {
    return initialMessage;
  }

  return `${initialMessage} Use one of the possible values: ${possibleValues.join(
    ', '
  )}`;
};

const acceptedEnvironments = ['development', 'production'];

const ConfigSchema = yup.object({
  environment: yup
    .string()
    .oneOf(acceptedEnvironments)
    .required(
      createRequiredErrMessage('NODE_ENV', acceptedEnvironments)
    ),
  botToken: yup
    .string()
    .required(createRequiredErrMessage('BOT_TOKEN')),
  dataPath: yup
    .string()
    .required(createRequiredErrMessage('DATA_PATH')),
});

export const loadConfiguration = async () => {
  const unsafeConfig = {
    environment: process.env.NODE_ENV,
    botToken: process.env.BOT_TOKEN,
    dataPath: process.env.DATA_PATH,
  };

  const config = await ConfigSchema.validate(unsafeConfig);

  return config;
};

export type Config = yup.InferType<typeof ConfigSchema>;
