import axios from 'axios';

import {Post} from '../../types';
import {URLS} from './url';

export const getPostsFromAPI = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>(URLS.POSTS);
  return response.data;
};
