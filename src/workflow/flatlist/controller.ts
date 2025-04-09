import {getPostsFromAPI} from './gateway';

import {Post} from '../../types';
import {getRandomColor} from '../../utils/ColorUtils';

export const getPosts = async (): Promise<{
  posts: Post[];
  success: boolean;
}> => {
  try {
    const postsFromApi = await getPostsFromAPI();
    const mappedPost = postsFromApi.map(post => ({
      ...post,
      backgroundColor: getRandomColor(),
      rating: 0,
    }));
    return {
      posts: mappedPost,
      success: true,
    };
  } catch (error) {
    console.log('error', error);
    return {
      posts: [],
      success: false,
    };
  }
};
