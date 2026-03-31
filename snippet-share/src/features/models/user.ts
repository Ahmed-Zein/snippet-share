import AppStorage from "../common/storage";
import StorageKey from "../common/storageKey";

export default interface User {
  id: string;
  email: string;
  name: string;
}

export function loadUserData(): User {
  const userData = AppStorage.get(StorageKey.USER_DATA);
  if (userData) {
    return JSON.parse(userData) as User;
  }
  throw new Error("No user data found in storage");
}
