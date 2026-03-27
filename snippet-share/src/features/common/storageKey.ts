const StorageKey = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

export default StorageKey;
