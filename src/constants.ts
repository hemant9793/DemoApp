import {User} from './types';

interface AppSingleton {
  user: User | null;
}
export const AppSingleton: AppSingleton = {
  user: null,
};
