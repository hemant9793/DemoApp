import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ExpenseList,
  ExpenseInput,
  BudgetCard,
  MonthPickerModal,
} from './components';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {
  addExpenseToFirestore,
  setMonthlyBudget as setMonthlyBudgetOnFireStore,
  fetchMonthlyBudget,
  fetchMonthlyExpenses,
  createUserTable,
} from '../../firebase/firestore';

import {ExpenseItem, User} from '../../types';
import {extractNameFromSimpleId, generateSimpleIdFromName} from './helpers';
import {useToast} from '../../common/components/toast/ToastContext';

const ExpenseScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [userName, setUserName] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [spentAmount, setSpentAmount] = useState(0);

  const {showToast} = useToast();

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setShowNameInput(false);
      } else {
        setShowNameInput(true);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (currentUser?.id) {
        const monthYear = getMonthYearFormatted(selectedMonth);
        const fetchedExpenses = await fetchMonthlyExpenses(
          currentUser.id,
          monthYear,
        );
        console.log('loadInitialData -> fetchedExpenses', fetchedExpenses);
        setExpenses(fetchedExpenses);
        const budget = await fetchMonthlyBudget(currentUser.id, monthYear);
        console.log('loadInitialData -> budget', budget);
        setMonthlyBudget(budget);
      }
    };

    if (currentUser) {
      loadInitialData();
    }
  }, [currentUser, selectedMonth]);

  useEffect(() => {
    const calculateSpent = () => {
      const totalSpent = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      setSpentAmount(totalSpent);
    };
    calculateSpent();
  }, [expenses]);

  const getMonthYear = (newdate: Date) => {
    return newdate.toLocaleString('default', {month: 'long', year: 'numeric'});
  };

  const filterExpensesByMonth = (allExpenses: ExpenseItem[], month: Date) => {
    return allExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() === month.getMonth() &&
        expDate.getFullYear() === month.getFullYear()
      );
    });
  };

  const addExpense = async (type: string) => {
    if (!title || !amount || !currentUser?.id) return;
    console.log('addExpense -> selectedMonth', selectedMonth, date);
    if (selectedMonth && date) {
      // Ensure both selectedMonth and the existing date are available
      Keyboard.dismiss();
      const selectedMonthFromDate = selectedMonth.getMonth();
      const selectedYear = selectedMonth.getFullYear();
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();

      if (
        selectedMonthFromDate === currentMonth &&
        selectedYear === currentYear
      ) {
        // Proceed with further actions if the month and year are the same
        console.log(
          'Selected date is within the same month and year. Proceeding...',
        );
        const newExpense: ExpenseItem = {
          id: Date.now().toString(),
          userId: currentUser.id,
          title,
          category: type,
          amount: parseFloat(amount),
          date,
        };
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);
        await addExpenseToFirestore(currentUser.id, newExpense);
        setTitle('');
        setAmount('');
        showToast('Transaction saved!', 'success');
      } else {
        console.log(
          'Selected date is not within the same month and year. Ignoring.',
        );
        showToast(
          'Selected date is not within the same month and year',
          'error',
        );
      }
    }
  };

  const getMonthYearFormatted = (newDate: Date) => {
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  const handleSaveUser = async () => {
    if (userName) {
      const newUser: User = {
        id: generateSimpleIdFromName(userName),
        name: userName,
      };
      setCurrentUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setShowNameInput(false);

      await createUserTable(newUser);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  if (showNameInput) {
    return (
      <View style={styles.nameInputContainer}>
        <Text style={styles.nameInputLabel}>Enter Your Name to continue:</Text>
        <TextInput
          style={styles.nameInputField}
          value={userName}
          onChangeText={setUserName}
          placeholder="Your Name"
        />
        <Button title="Save Name" onPress={handleSaveUser} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.header}>Trackify</Text>
          <Text style={styles.headerName}>
            {`Welcome ${extractNameFromSimpleId(currentUser?.id)}`}
          </Text>
        </View>
        <Text
          style={[styles.headerName, {color: 'red', marginLeft: 100}]}
          onPress={async () => {
            await AsyncStorage.clear();
          }}>
          Clear data
        </Text>
        <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
          <Text style={styles.monthText}>{getMonthYear(selectedMonth)}</Text>
        </TouchableOpacity>
      </View>

      <BudgetCard
        expenses={expenses}
        monthlyBudget={monthlyBudget}
        spentAmount={spentAmount}
        selectedMonth={getMonthYear(selectedMonth)}
        setMonthlyBudget={(budget: number) => {
          const monthYear = getMonthYearFormatted(selectedMonth);
          setMonthlyBudgetOnFireStore(currentUser?.id, monthYear, budget);
        }}
      />

      <ExpenseInput
        title={title}
        setTitle={setTitle}
        amount={amount}
        setAmount={setAmount}
        date={date}
        setShowPicker={setShowPicker}
        showPicker={showPicker}
        onDateChange={onDateChange}
        addExpense={addExpense}
      />
      <Text style={styles.header}>{`${
        getMonthYear(selectedMonth)?.split(' ')?.[0]
      }'s Transactions`}</Text>
      <ExpenseList expenses={filterExpensesByMonth(expenses, selectedMonth)} />

      <MonthPickerModal
        visible={showMonthPicker}
        selectedDate={selectedMonth}
        onClose={() => setShowMonthPicker(false)}
        onMonthPick={(newDate: any) => setSelectedMonth(newDate)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  headerName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: 'black',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    color: '#007bff',
  },
  nameInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  nameInputLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  nameInputField: {
    width: '80%',
    padding: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ExpenseScreen;
