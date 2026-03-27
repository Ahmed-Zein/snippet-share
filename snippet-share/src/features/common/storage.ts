import type { StorageKey } from "./storageKey";

class AppStorage {
  static set(key: StorageKey, value: string) {
    localStorage.setItem(key, value);
  }

  static get(key: StorageKey): string | null {
    return localStorage.getItem(key);
  }

  static remove(key: StorageKey) {
    localStorage.removeItem(key);
  }
  static clear() {
    localStorage.clear();
  }
}

export default AppStorage;
