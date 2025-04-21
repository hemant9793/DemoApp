import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {ExpenseItem} from '../../../types';

interface ExpenseListProps {
  expenses: ExpenseItem[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({expenses}) => {
  return (
    <FlatList
      data={expenses}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({item}) => (
        <View
          style={[
            styles.card,
            item.category === 'expense'
              ? styles.expenseCard
              : styles.incomeCard,
          ]}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text
              style={[
                styles.amount,
                item.category === 'expense'
                  ? styles.expenseAmount
                  : styles.incomeAmount,
              ]}>
              {item.category === 'expense' ? '-' : '+'}₹{item.amount.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleString()}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 5,
    borderWidth: 1,
  },
  expenseCard: {
    backgroundColor: '#fef0f0', // Light red
    borderColor: '#fecaca',
  },
  incomeCard: {
    backgroundColor: '#f0fdf4', // Light green
    borderColor: '#d1fae5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center', // Vertically center title and amount
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    color: '#222',
    flex: 1, // Allow title to take up available space
    marginRight: 10, // Add some margin to separate from amount
  },
  amount: {
    fontWeight: '600',
    fontSize: 17,
  },
  expenseAmount: {
    color: '#dc2626', // Stronger red
  },
  incomeAmount: {
    color: '#16a34a', // Stronger green
  },
  date: {
    color: '#6b7280',
    fontSize: 13,
  },
});

export {ExpenseList};
