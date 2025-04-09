import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import {ListItem, RatingModal} from './components';
import {Post} from '../../types';
import {getPosts} from '../../workflow/flatlist';

const FlatListDemoScreen: React.FC = () => {
  const [post, setPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState('');

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleRate = (rating: number) => {
    if (selectedPostId === null) return;

    const updated = post.map(postItem =>
      postItem.id === selectedPostId ? {...postItem, rating} : postItem,
    );
    setPost(updated);
    setModalVisible(false);
    setSelectedPostId(null);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      const postResponse = await getPosts();
      if (postResponse.success) {
        setPost(postResponse.posts);
      } else {
        setError('Failed to load Posts');
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const renderItem = useCallback(
    ({item}: {item: Post}) => (
      <ListItem
        title={item.title}
        body={item.body}
        rating={item.rating || 0}
        backgroundColor={item?.backgroundColor}
        onPress={() => {
          setSelectedPostId(item.id);
          setModalVisible(true);
        }}
      />
    ),
    [],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.commentText}>Loading Comments</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errotText}>{error}!!</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.screenTitle}>FlatList Demo</Text>
      <FlatList
        data={post}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
      <RatingModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedPostId(null);
        }}
        onFinishRating={handleRate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  commentText: {
    marginBottom: 5,
    fontSize: 18,
  },
  errotText: {
    marginBottom: 5,
    fontSize: 18,
  },
  center: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {FlatListDemoScreen};
