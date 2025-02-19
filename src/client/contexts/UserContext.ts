import { createContext } from 'react';

export interface UserType {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  tasks_complete?: number;
  events_attended?: number;
  location?: string;
  avatar_id?: number;
  avatar_shirt?: string;
  avatar_pants?: string;
  current_task_id?: number;
}

type UserContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
  getUser: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: { id: 0 },
  setUser: () => {},
  getUser: () => {},
});
