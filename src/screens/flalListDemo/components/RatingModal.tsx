import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Rating} from 'react-native-ratings';

import {RatingModalProps} from '../../../types';

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onFinishRating,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Rate this Post</Text>
          <Rating
            startingValue={0}
            imageSize={30}
            onFinishRating={onFinishRating}
            style={{paddingVertical: 10}}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    margin: 32,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    marginTop: 20,
    color: 'blue',
  },
});

export {RatingModal};
