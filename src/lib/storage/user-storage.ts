import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'taskflow-user-storage',
});

// Storage keys
const CURRENT_USER_KEY = 'current_user';
const USERS_KEY = 'users';

// User type
export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

// User storage functions
export const userStorage = {
  // Current user management
  getCurrentUser: (): User | null => {
    const userJson = storage.getString(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  setCurrentUser: (user: User): void => {
    storage.set(CURRENT_USER_KEY, JSON.stringify(user));
  },

  clearCurrentUser: (): void => {
    storage.delete(CURRENT_USER_KEY);
  },

  // User registration and management
  getUsers: (): User[] => {
    const usersJson = storage.getString(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  saveUsers: (users: User[]): void => {
    storage.set(USERS_KEY, JSON.stringify(users));
  },

  addUser: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = userStorage.getUsers();
    const newUser: User = {
      ...userData,
      id: generateUserId(),
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    userStorage.saveUsers(users);
    return newUser;
  },

  findUserByEmail: (email: string): User | null => {
    const users = userStorage.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Demo login - check if user exists
  authenticateUser: (email: string, password: string): User | null => {
    // In demo mode, just check if user exists
    // In real app, you would verify password hash
    return userStorage.findUserByEmail(email);
  },

  // Clear all user data
  clearAll: (): void => {
    storage.delete(CURRENT_USER_KEY);
    storage.delete(USERS_KEY);
  },
};

// Utility function to generate unique user IDs
function generateUserId(): string {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2)}`;
}
