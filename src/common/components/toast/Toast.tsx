import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

const getBackgroundColor = (type: string) => {
  switch (type) {
    case 'success':
      return '#4ade80'; // Green
    case 'error':
      return '#f87171'; // Red
    case 'info':
    default:
      return '#60a5fa'; // Blue
  }
};

const Toast: React.FC<ToastProps> = ({message, type = 'info'}) => {
  return (
    <View style={[styles.toast, {backgroundColor: getBackgroundColor(type)}]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 10,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Toast;
