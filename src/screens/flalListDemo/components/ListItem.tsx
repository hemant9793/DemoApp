import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Rating} from 'react-native-ratings';

import {ListItemProps} from '../../../types';

const ListItem: React.FC<ListItemProps> = ({
  title,
  body,
  rating,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, {backgroundColor}]}>
        <Text style={styles.title}>{title}</Text>
        <Text>{body}</Text>
        {rating > 0 && (
          <Rating
            readonly
            startingValue={rating}
            imageSize={20}
            tintColor={backgroundColor}
            style={styles.rating}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  rating: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
});

export {ListItem};
