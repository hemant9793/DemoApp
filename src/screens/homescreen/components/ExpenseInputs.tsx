import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {formatDate} from '../helpers';

interface ExpenseInputProps {
  title: string;
  setTitle: (text: string) => void;
  amount: string;
  setAmount: (text: string) => void;
  date: Date;
  setShowPicker: (val: boolean) => void;
  showPicker: boolean;
  onDateChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  addExpense: (type: 'expense' | 'income') => void; // Modified addExpense
}

const ExpenseInput: React.FC<ExpenseInputProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setShowPicker,
  showPicker,
  onDateChange,
  addExpense,
}) => {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    'expense',
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Title"
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Amount"
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeChip,
              transactionType === 'expense' && styles.activeChip,
            ]}
            onPress={() => setTransactionType('expense')}>
            <Text
              style={[
                styles.typeText,
                transactionType === 'expense' && styles.activeTypeText,
              ]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeChip,
              transactionType === 'income' && styles.activeChip,
            ]}
            onPress={() => setTransactionType('income')}>
            <Text
              style={[
                styles.typeText,
                transactionType === 'income' && styles.activeTypeText,
              ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addExpense(transactionType)}>
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date" // Changed to 'date' only
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 5,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  titleInput: {
    flex: 1.6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    marginRight: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  typeRow: {
    flexDirection: 'column',
  },
  typeChip: {
    flex: 1,
    marginLeft: 10,
    marginVertical: 1,
    padding: 2,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  activeChip: {
    backgroundColor: '#007bff', // Green for active
    borderColor: '#007bff',
  },
  typeText: {
    fontSize: 8,
    color: '#555',
    fontWeight: '500',
  },
  activeTypeText: {
    color: '#fff',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export {ExpenseInput};
