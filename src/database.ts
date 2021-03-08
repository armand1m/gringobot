import mkdirp from 'mkdirp';
import path from 'path';
import pino from 'pino';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { Country } from './countries';

interface DatabaseSchema {
  locationIndex: Partial<Record<Country, number[]>>;
}

export interface DatabaseInstance {
  addMemberLocation: (
    userId: number,
    country: Country
  ) => Promise<void>;
  removeMemberFrom: (
    userId: number,
    country: Country
  ) => Promise<void>;
  getMembersAt: (country: Country) => number[];
  hasMemberRegistered: (userId: number, country: Country) => boolean;
}

const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
};

export const createDatabase = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
): Promise<DatabaseInstance> => {
  const chatDatabasePath = path.resolve(dataPath, `chat_${chatId}`);

  /**
   * TODO: verify if directory already exists, and if so, avoid unnecessary command execution
   */
  logger.info(`Creating "${chatDatabasePath}" with "mkdir -p"`);
  await mkdirp(chatDatabasePath);
  logger.info(`Created ${chatDatabasePath}`);

  const databaseFilePath = path.resolve(
    chatDatabasePath,
    'database.json'
  );
  const adapter = new FileAsync(databaseFilePath);
  const db = await low<low.AdapterAsync<DatabaseSchema>>(adapter);

  await db.defaults(emptyDatabase).write();

  const instance: DatabaseInstance = {
    removeMemberFrom: async (userId: number, code: Country) => {
      const collection = db.get('locationIndex').get(code);
      await collection.pull(userId).write();
    },
    hasMemberRegistered: (userId: number, code: Country) => {
      const collection = db.get('locationIndex').get(code);
      const members = collection.value() || [];
      return members.includes(userId);
    },
    addMemberLocation: async (userId: number, code: Country) => {
      const collection = db.get('locationIndex');
      const currentState = collection.value();

      if (currentState[code] === undefined) {
        await collection
          .assign({
            ...currentState,
            [code]: [userId],
          })
          .write();
      } else {
        await collection.get(code).push(userId).write();
      }
    },
    getMembersAt: (code: Country) => {
      const collection = db.get('locationIndex').get(code);
      const members = collection.value() || [];
      return members;
    },
  };

  return instance;
};
