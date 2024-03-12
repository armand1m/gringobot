import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import lodash from 'lodash';
import mkdirp from 'mkdirp';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Alpha2Code } from 'i18n-iso-countries';
import { AvailableLocales } from './middlewares/createTranslateMiddleware/translate.js';
import { User, Message } from 'telegraf/types';
import { CaptchaObj } from 'svg-captcha';

export interface WaitCaptchaEntry {
  user: User;
  text: string;
  timestamp: number;
  message: Message.PhotoMessage;
}

export interface DatabaseSchema {
  locationIndex: Partial<Record<Alpha2Code, number[]>>;
  remoteIndex: Record<number, RemoteEntry>;
  autoDeleteMessages: Record<string, number>;
  language: AvailableLocales;
  captcha?: {
    enabled: boolean;
    kickedUsers: Record<number, User>;
    waitingUsers: Record<number, WaitCaptchaEntry>;
  };
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
  getAllRemoteMembers: () => Partial<Record<number, RemoteEntry>>;
  getGroupLanguage: () => Promise<AvailableLocales>;
  setGroupLanguage: (locale: AvailableLocales) => Promise<void>;
  enableCaptcha: () => Promise<void>;
  disableCaptcha: () => Promise<void>;
  getCaptcha: () => Promise<DatabaseSchema['captcha']>;
  isCaptchaEnabled: () => Promise<boolean>;
  addUserToCaptchaWaitlist: (
    user: User,
    captchaData: CaptchaObj,
    captchaMessage: Message.PhotoMessage
  ) => Promise<void>;
  addUserToCaptchaKicklist: (user: User) => Promise<void>;
  removeUserFromCaptchaWaitlist: (user: User) => Promise<void>;
  isUserInCaptchaWaitlist: (user: User) => Promise<boolean>;
  getUserCaptcha: (user: User) => Promise<WaitCaptchaEntry>;
}

export const emptyDatabase: DatabaseSchema = {
  locationIndex: {},
  remoteIndex: {},
  autoDeleteMessages: {},
  language: 'en',
  captcha: {
    enabled: false,
    kickedUsers: {},
    waitingUsers: {},
  },
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

export class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash
    .chain(this)
    .get('data');
}

export const createDatabase = async (
  chatId: number,
  dataPath: string,
  logger: pino.Logger
) => {
  const databaseFilePath = await getChatDatabasePath(
    chatId,
    dataPath,
    logger
  );

  const adapter = new JSONFile<DatabaseSchema>(databaseFilePath);
  const db = new LowWithLodash(adapter, emptyDatabase);
  await db.read();

  return createDatabaseMethods(db);
};

export const createDatabaseMethods = async (
  db: LowWithLodash<DatabaseSchema>
): Promise<DatabaseInstance> => {
  const instance: DatabaseInstance = {
    getLocationIndex: () => {
      return db.chain.get('locationIndex').value();
    },
    removeMemberFrom: async (userId, countryCode) => {
      db.chain
        .get('locationIndex')
        .get(countryCode)
        .pull(userId)
        .value();
      return db.write();
    },
    removeRemoteMember: async (userId) => {
      db.chain.get('remoteIndex').unset(userId).value();
      return db.write();
    },
    hasMemberRegistered: (userId, countryCode) => {
      const members =
        db.chain.get('locationIndex').get(countryCode).value() ?? [];

      return members.includes(userId);
    },
    addMemberLocation: async (userId, countryCode) => {
      const collection = db.chain.get('locationIndex');
      const currentState = collection.value();

      if (currentState[countryCode] === undefined) {
        collection
          .assign({
            ...currentState,
            [countryCode]: [userId],
          })
          .value();
      } else {
        collection.get(countryCode).push(userId).value();
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
        collection
          .assign({
            ...currentState,
            [userId]: { from: fromCountryCode, to: toCountryCode },
          })
          .value();

        return db.write();
      }
    },
    hasRemoteMemberRegistered: (userId) => {
      const members = db.chain.get('remoteIndex').value() ?? [];

      return Object.keys(members).includes(userId.toString());
    },
    getRemoteMembersFrom: (countryCode) => {
      const members = db.chain.get('remoteIndex').value() ?? [];

      const filteredMembers = Object.entries(members).filter(
        ([_key, value]) => {
          return value['from'] === countryCode;
        }
      );

      return Object.fromEntries(filteredMembers);
    },
    getAllRemoteMembers: () => {
      return db.chain.get('remoteIndex').value() ?? [];
    },
    getMembersAt: (code) => {
      return db.chain.get('locationIndex').get(code).value() ?? [];
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

      messages
        .assign(currentState, { [messageId]: Date.now() })
        .value();

      return db.write();
    },
    getAutoDeleteMessages: () => {
      return db.chain.get('autoDeleteMessages').value();
    },
    removeAutoDeleteMessage: async (messageId: number) => {
      db.chain.get('autoDeleteMessages').unset(messageId).value();
      return db.write();
    },
    getGroupLanguage: async () => {
      return (db.chain.get('language').value() ??
        'en') as AvailableLocales;
    },
    setGroupLanguage: async (language) => {
      db.chain.set('language', language).value();
      return db.write();
    },
    disableCaptcha: async () => {
      const captcha = db.chain.get('captcha').value();

      db.chain
        .set('captcha', {
          enabled: false,
          kickedUsers: {
            ...(captcha?.kickedUsers ?? {}),
          },
          waitingUsers: {
            ...(captcha?.waitingUsers ?? {}),
          },
        })
        .value();

      return db.write();
    },
    enableCaptcha: async () => {
      const captcha = db.chain.get('captcha').value();

      db.chain
        .set('captcha', {
          enabled: true,
          kickedUsers: {
            ...(captcha?.kickedUsers ?? {}),
          },
          waitingUsers: {
            ...(captcha?.waitingUsers ?? {}),
          },
        })
        .value();

      return db.write();
    },
    getCaptcha: async () => {
      return db.chain.get('captcha').value();
    },
    isCaptchaEnabled: async () => {
      return db.chain.get('captcha.enabled').value() ?? false;
    },
    addUserToCaptchaWaitlist: async (
      user,
      captchaData,
      captchaMessage
    ) => {
      const captcha = db.chain.get('captcha');
      const currentState = captcha.value();

      const entry: WaitCaptchaEntry = {
        user,
        text: captchaData.text,
        timestamp: Date.now(),
        message: captchaMessage,
      };

      captcha
        .assign(currentState, {
          waitingUsers: {
            ...(currentState?.waitingUsers ?? {}),
            [user.id]: entry,
          },
        })
        .value();

      return db.write();
    },
    addUserToCaptchaKicklist: async (user) => {
      const captcha = db.chain.get('captcha');
      const currentState = captcha.value();

      const waitingUsers = currentState?.waitingUsers ?? {};

      captcha
        .assign(currentState, {
          kickedUsers: {
            ...(currentState?.kickedUsers ?? {}),
            [user.id]: user,
          },
          waitingUsers,
        })
        .value();

      return db.write();
    },
    removeUserFromCaptchaWaitlist: async (user) => {
      db.chain.get('captcha.waitingUsers').unset(user.id).value();
      return db.write();
    },
    isUserInCaptchaWaitlist: async (user) => {
      const captcha = db.chain.get('captcha').value();
      return captcha?.waitingUsers?.[user.id] !== undefined;
    },
    getUserCaptcha: async (user) => {
      const captcha = db.chain.get('captcha').value();
      return captcha?.waitingUsers?.[user.id];
    },
  };

  return instance;
};
