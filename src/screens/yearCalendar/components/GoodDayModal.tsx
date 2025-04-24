import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {fetchGoodDayNote} from '../../../firebase/firestore';

interface GoodDayModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string; // "YYYY-MM-DD"
  userId: string;
  onSubmit: (note: string, selectedDate: string) => void; // Optional callback after saving
}

const formatDateHeader = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-GB', options); // e.g., 20 April 2025
};

const GoodDayModal: React.FC<GoodDayModalProps> = ({
  visible,
  onClose,
  selectedDate,
  userId,
  onSubmit,
}) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null); // Create a ref

  useEffect(() => {
    const loadNote = async () => {
      if (visible && selectedDate) {
        setLoading(true);
        const existingNote = await fetchGoodDayNote(userId, selectedDate);
        if (existingNote) {
          setNote(existingNote);
        } else {
          setNote('');
        }
        setLoading(false);
      }
    };

    loadNote();
  }, [visible, selectedDate, userId]);

  const handleSubmit = async () => {
    console.log('handle submit');
    inputRef.current?.blur(); // Blur the input

    Keyboard.dismiss();
    setTimeout(() => {
      onClose();
      onSubmit(note.trim(), selectedDate);
      setNote('');
    }, 100);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            Why was {formatDateHeader(selectedDate)} great?
          </Text>
          <TextInput
            placeholder="What makes your day great..."
            value={note}
            onChangeText={setNote}
            ref={inputRef}
            multiline
            editable={!loading}
            style={styles.input}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoodDayModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancel: {
    marginRight: 10,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: '#999',
  },
  submit: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
