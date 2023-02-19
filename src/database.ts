import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import pino from 'pino';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { Alpha2Code } from 'i18n-iso-countries';

interface DatabaseSchema {
  locationIndex: Partial<Record<Alpha2Code, number[]>>;
  remoteIndex: Record<number, RemoteEntry>;
  autoDeleteMessages: Record<string, number>;
}

export interface RemoteEntry {
  id: number;
  to: Alpha2Code;
  from: Alpha2Code;
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
  removeRemoteMember: (userId: number) => Promise<void>;
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
  addRemoteMember: (
    userId: number,
    fromCountryCode: Alpha2Code,
    toCountryCode: Alpha2Code
  ) => Promise<void>;
  hasRemoteMemberRegistered: (userId: number) => boolean;
  getRemoteMembersFrom: (
    countryCode: Alpha2Code
  ) => Partial<Record<number, RemoteEntry>>;
  getRemoteMembersTo: (
    countryCode: Alpha2Code
  ) => Partial<Record<number, RemoteEntry>>;
  getAllRemoteMembers: () => Partial<Record<number, RemoteEntry>>;
}

const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
  remoteIndex: {},
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
    removeRemoteMember: async (userId) => {
      const collection = db.get('remoteIndex');
      collection.unset(userId).write();
    },
    hasMemberRegistered: (userId, countryCode) => {
      const collection = db.get('locationIndex').get(countryCode);
      const members = collection.value() ?? [];
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
        return;
      }

      await collection.get(countryCode).push(userId).write();
    },
    addRemoteMember: async (
      userId,
      fromCountryCode,
      toCountryCode
    ) => {
      const collection = db.get('remoteIndex');
      const currentState = collection.value();

      if (currentState[userId] === undefined) {
        await collection
          .assign({
            ...currentState,
            [userId]: { from: fromCountryCode, to: toCountryCode },
          })
          .write();
      }
    },
    hasRemoteMemberRegistered: (userId) => {
      const collection = db.get('remoteIndex');
      const members = collection.value() ?? {};

      return Object.keys(members).includes(userId.toString());
    },
    getRemoteMembersFrom: (countryCode) => {
      const collection = db.get('remoteIndex');
      const members = collection.value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['from'] === countryCode;
        }
      );

      return Object.fromEntries(filteredMembers);
    },
    getRemoteMembersTo: (countryCode) => {
      const collection = db.get('remoteIndex');
      const members = collection.value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['to'] === countryCode;
        }
      );
      return Object.fromEntries(filteredMembers);
    },
    getAllRemoteMembers: () => {
      const collection = db.get('remoteIndex');
      const members = collection.value() ?? [];

      return members;
    },
    getMembersAt: (code) => {
      const collection = db.get('locationIndex').get(code);
      const members = collection.value() ?? [];
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
