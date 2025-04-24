import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Modal} from 'react-native';

const Loader = ({text, visible}: {text?: string; visible: boolean}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#007bff" />
          {<Text style={styles.loaderText}>{text || 'Trackify'}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export {Loader};
