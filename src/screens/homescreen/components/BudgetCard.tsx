import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {ExpenseItem} from '../../../types';

interface BudgetCardProps {
  expenses: ExpenseItem[];
  monthlyBudget: number | null;
  spentAmount: number;
  selectedMonth: string;
  setMonthlyBudget: (budget: number) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  expenses,
  monthlyBudget,
  selectedMonth,
  setMonthlyBudget,
}) => {
  const [initialBudget, setInitialBudget] = useState(monthlyBudget);
  const [budgetSet, setBudgetSet] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setInitialBudget(monthlyBudget);
    if (monthlyBudget) {
      console.log('monthlyBudget', monthlyBudget);
      setEditing(false);
      setBudgetSet(true);
    } else {
      setEditing(true);
    }
  }, [monthlyBudget]);

  const getMonthlySpent = (): number => {
    return expenses
      .filter(exp => exp.category === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getMonthlyIncome = (): number => {
    return expenses
      .filter(
        exp => exp.category === 'income', // Filter for 'income' category
      )
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleSetBudget = () => {
    if (!initialBudget) return;
    setMonthlyBudget(initialBudget);
    setBudgetSet(true);
    setEditing(false);
  };

  const monthlySpent = getMonthlySpent();
  const monthlyIncome = getMonthlyIncome();
  const budgetLeft =
    parseFloat(initialBudget || '0') - monthlySpent + monthlyIncome;

  if (!budgetSet || editing) {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter monthly budget"
          value={initialBudget}
          onChangeText={setInitialBudget}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSetBudget} style={styles.setButton}>
          <Text style={styles.setButtonText}>Set</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setEditing(true)}
      activeOpacity={0.8}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.cardText}>Budget</Text>
        <Text style={styles.budgetAmount}>₹ {initialBudget}</Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.cardText}>Remaining</Text>
        <Text style={styles.budgetAmount}>₹ {budgetLeft.toFixed(1)}</Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.cardText}>Spent</Text>
        <Text style={styles.spentAmount}>₹ {monthlySpent.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  setButton: {
    flex: 0.5,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  setButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    marginBottom: 16,
  },
  cardText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
  },
});

export {BudgetCard};
