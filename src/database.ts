import mkdirp from 'mkdirp';
import path from 'path';
import pino from 'pino';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Country } from './countries';

interface DatabaseSchema {
  locationIndex: Partial<Record<Country, number[]>>;
}

export interface DatabaseInstance {
  addMemberLocation: (userId: number, country: Country) => void;
  removeMemberFrom: (userId: number, country: Country) => void;
  getMembersAt: (country: Country) => number[];
  hasMemberRegistered: (userId: number, country: Country) => boolean;
}

const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
};

const databaseInstances: Partial<
  Record<number, DatabaseInstance>
> = {};

export const createDatabase = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
): Promise<DatabaseInstance> => {
  const cachedInstance = databaseInstances[chatId];
  if (cachedInstance !== undefined) {
    return cachedInstance;
  }

  const chatDatabasePath = path.resolve(dataPath, String(chatId));

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
  const adapter = new FileSync(databaseFilePath);
  const db = low<low.AdapterSync<DatabaseSchema>>(adapter);

  db.defaults(emptyDatabase).write();

  const instance: DatabaseInstance = {
    removeMemberFrom: (userId: number, code: Country) => {
      const collection = db.get('locationIndex').get(code);
      collection.pull(userId).write();
    },
    hasMemberRegistered: (userId: number, code: Country) => {
      const collection = db.get('locationIndex').get(code);
      return collection.value().includes(userId);
    },
    addMemberLocation: (userId: number, code: Country) => {
      const collection = db.get('locationIndex').get(code);
      collection.push(userId).write();
    },
    getMembersAt: (code: Country) => {
      const collection = db.get('locationIndex').get(code);
      const members = collection.value() || [];
      return members;
    },
  };

  databaseInstances[chatId] = instance;

  return instance;
};
