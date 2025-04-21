import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

type Props = {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onMonthPick: (date: Date) => void;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const years = Array.from(
  {length: 10},
  (_, i) => new Date().getFullYear() - 5 + i,
);

const MonthPickerModal: React.FC<Props> = ({
  visible,
  selectedDate,
  onClose,
  onMonthPick,
}) => {
  const [tempMonth, setTempMonth] = React.useState(selectedDate.getMonth());
  const [tempYear, setTempYear] = React.useState(selectedDate.getFullYear());

  const handleDone = () => {
    const pickedDate = new Date(tempYear, tempMonth, 1);
    onMonthPick(pickedDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Month</Text>

          <View style={styles.row}>
            <FlatList
              data={months}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    tempMonth === index && styles.selected,
                  ]}
                  onPress={() => setTempMonth(index)}>
                  <Text
                    style={[
                      styles.optionText,
                      tempMonth === index && {color: 'white'},
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.row}>
            <FlatList
              data={years}
              keyExtractor={item => item.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[styles.option, tempYear === item && styles.selected]}
                  onPress={() => setTempYear(item)}>
                  <Text
                    style={[
                      styles.optionText,
                      tempYear === item && {color: 'white'},
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export {MonthPickerModal};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: '#007bff',
  },
  optionText: {
    color: '#000',
  },
  doneButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
