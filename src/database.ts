import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import lodash from 'lodash';
import mkdirp from 'mkdirp';
import { Alpha2Code } from 'i18n-iso-countries';
import { AvailableLocales } from './middlewares/createTranslateMiddleware/translate.js';

export interface DatabaseSchema {
  locationIndex: Partial<Record<Alpha2Code, number[]>>;
  remoteIndex: Record<number, RemoteEntry>;
  autoDeleteMessages: Record<string, number>;
  language: AvailableLocales;
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
  getGroupLanguage: () => Promise<AvailableLocales>;
  setGroupLanguage: (locale: AvailableLocales) => Promise<void>;
}

const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
  remoteIndex: {},
  autoDeleteMessages: {},
  language: 'en',
};

const getChatDatabasePath = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
) => {
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

  return databaseFilePath;
};

export const createDatabase = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
) => {
  const databasePath = await getChatDatabasePath(
    chatId,
    dataPath,
    logger
  );

  return createDatabaseInstance(databasePath);
};

export const createDatabaseInstance = async (
  databaseFilePath: string
): Promise<DatabaseInstance> => {
  const { Low } = await import('lowdb');

  class LowWithLodash<T> extends Low<T> {
    chain: lodash.ExpChain<this['data']> = lodash
      .chain(this)
      .get('data');
  }

  const { JSONFile } = await import('lowdb/node');

  const db = new LowWithLodash<DatabaseSchema>(
    new JSONFile(databaseFilePath)
  );

  await db.read();
  db.data ||= emptyDatabase;
  db.write();

  const instance: DatabaseInstance = {
    getLocationIndex: () => {
      const collection = db.chain.get('locationIndex').value();
      return collection;
    },
    removeMemberFrom: async (userId, countryCode) => {
      db.chain.get('locationIndex').get(countryCode).pull(userId);
      return db.write();
    },
    removeRemoteMember: async (userId) => {
      db.chain.get('remoteIndex').unset(userId);
      return db.write();
    },
    hasMemberRegistered: (userId, countryCode) => {
      const collection = db.chain
        .get('locationIndex')
        .get(countryCode);
      const members = collection.value() ?? [];
      return members.includes(userId);
    },
    addMemberLocation: async (userId, countryCode) => {
      const collection = db.chain.get('locationIndex');
      const currentState = collection.value();

      if (currentState[countryCode] === undefined) {
        collection.assign({
          ...currentState,
          [countryCode]: [userId],
        });
      } else {
        collection.get(countryCode).push(userId);
      }

      return db.write();
    },
    addRemoteMember: async (
      userId,
      fromCountryCode,
      toCountryCode
    ) => {
      const collection = db.chain.get('remoteIndex');
      const currentState = collection.value();

      if (currentState[userId] === undefined) {
        collection.assign({
          ...currentState,
          [userId]: { from: fromCountryCode, to: toCountryCode },
        });

        return db.write();
      }
    },
    hasRemoteMemberRegistered: (userId) => {
      const collection = db.chain.get('remoteIndex');
      const members = collection.value() ?? {};

      return Object.keys(members).includes(userId.toString());
    },
    getRemoteMembersFrom: (countryCode) => {
      const collection = db.chain.get('remoteIndex');
      const members = collection.value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['from'] === countryCode;
        }
      );

      return Object.fromEntries(filteredMembers);
    },
    getRemoteMembersTo: (countryCode) => {
      const collection = db.chain.get('remoteIndex');
      const members = collection.value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['to'] === countryCode;
        }
      );
      return Object.fromEntries(filteredMembers);
    },
    getAllRemoteMembers: () => {
      const collection = db.chain.get('remoteIndex');
      const members = collection.value() ?? [];

      return members;
    },
    getMembersAt: (code) => {
      const collection = db.chain.get('locationIndex').get(code);
      const members = collection.value() ?? [];
      return members;
    },
    findMember: async (userId) => {
      return db.chain
        .get('locationIndex')
        .pickBy((value) => value?.includes(userId))
        .keys()
        .value() as Alpha2Code[];
    },
    addAutoDeleteMessage: async (messageId: number) => {
      const messages = db.chain.get('autoDeleteMessages');
      const currentState = messages.value();

      messages.assign(currentState, { [messageId]: Date.now() });

      return db.write();
    },
    getAutoDeleteMessages: () => {
      return db.chain.get('autoDeleteMessages').value();
    },
    removeAutoDeleteMessage: async (messageId: number) => {
      const messages = db.chain.get('autoDeleteMessages');
      messages.unset(messageId);
      return db.write();
    },
    getGroupLanguage: async () => {
      return (db.chain.get('language').value() ??
        'en') as AvailableLocales;
    },
    setGroupLanguage: async (language) => {
      db.chain.set('language', language);
      return db.write();
    },
  };

  return instance;
};
