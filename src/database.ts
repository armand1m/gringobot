import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import pino from 'pino';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { Alpha2Code } from 'i18n-iso-countries';

interface DatabaseSchema {
  locationIndex: Partial<Record<Alpha2Code, number[]>>;
  autoDeleteMessages: Record<string, number>;
}

export interface DatabaseInstance {
  addMemberLocation: (
    userId: number,
    countryCode: Alpha2Code
  ) => Promise<void>;
  removeMemberFrom: (
    userId: number,
    countryCode: Alpha2Code
  ) => Promise<void>;
  getMembersAt: (countryCode: Alpha2Code) => number[];
  hasMemberRegistered: (
    userId: number,
    countryCode: Alpha2Code
  ) => boolean;
  getLocationIndex: () => DatabaseSchema['locationIndex'];
  findMember: (userId: number) => Promise<Alpha2Code[]>;
  addAutoDeleteMessage: (messageId: number) => Promise<void>;
  getAutoDeleteMessages: () => DatabaseSchema['autoDeleteMessages'];
  removeAutoDeleteMessage: (messageId: number) => Promise<void>;
}

const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
  autoDeleteMessages: {},
};

export const createDatabase = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
): Promise<DatabaseInstance> => {
  const chatDatabasePath = path.resolve(dataPath, `chat_${chatId}`);

  try {
    await fs.promises.access(chatDatabasePath);
  } catch (error) {
    logger.info(`Creating "${chatDatabasePath}" with "mkdir -p"`);
    await mkdirp(chatDatabasePath);
    logger.info(`Created ${chatDatabasePath}`);
  }

  const databaseFilePath = path.resolve(
    chatDatabasePath,
    'database.json'
  );

  const adapter = new FileAsync(databaseFilePath);
  const db = await low<low.AdapterAsync<DatabaseSchema>>(adapter);

  await db.defaults(emptyDatabase).write();

  const instance: DatabaseInstance = {
    getLocationIndex: () => {
      const collection = db.get('locationIndex').value();
      return collection;
    },
    removeMemberFrom: async (userId, countryCode) => {
      const collection = db.get('locationIndex').get(countryCode);
      await collection.pull(userId).write();
    },
    hasMemberRegistered: (userId, countryCode) => {
      const collection = db.get('locationIndex').get(countryCode);
      const members = collection.value() || [];
      return members.includes(userId);
    },
    addMemberLocation: async (userId, countryCode) => {
      const collection = db.get('locationIndex');
      const currentState = collection.value();

      if (currentState[countryCode] === undefined) {
        await collection
          .assign({
            ...currentState,
            [countryCode]: [userId],
          })
          .write();
      } else {
        await collection.get(countryCode).push(userId).write();
      }
    },
    getMembersAt: (code) => {
      const collection = db.get('locationIndex').get(code);
      const members = collection.value() || [];
      return members;
    },
    findMember: async (userId) => {
      return db
        .get('locationIndex')
        .pickBy((value) => value?.includes(userId))
        .keys()
        .value() as Alpha2Code[];
    },
    addAutoDeleteMessage: async (messageId: number) => {
      const messages = db.get('autoDeleteMessages');
      const currentState = messages.value();

      await messages
        .assign(currentState, { [messageId]: Date.now() })
        .write();
    },
    getAutoDeleteMessages: () => {
      return db.get('autoDeleteMessages').value();
    },
    removeAutoDeleteMessage: async (messageId: number) => {
      const messages = db.get('autoDeleteMessages');

      await messages.unset(messageId).write();
    },
  };

  return instance;
};
