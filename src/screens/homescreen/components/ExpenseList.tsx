import React from 'react';
import {View, Text, SectionList, StyleSheet} from 'react-native';
import {ExpenseItem} from '../../../types';

interface ExpenseListProps {
  expenses: ExpenseItem[];
}

interface SectionData {
  title: string;
  data: ExpenseItem[];
}

const formatDateHeader = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-GB', options); // e.g., 20 April 2025
};

const groupExpensesByDate = (expenses: ExpenseItem[]): SectionData[] => {
  const grouped: {[date: string]: ExpenseItem[]} = {};

  expenses.forEach(item => {
    const dateKey = formatDateHeader(item.date);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });

  // Convert to SectionList data format
  return Object.entries(grouped)
    .map(([title, data]) => ({title, data}))
    .sort(
      (a, b) =>
        new Date(b.data[0].date).getTime() - new Date(a.data[0].date).getTime(),
    );
};

const ExpenseList: React.FC<ExpenseListProps> = ({expenses}) => {
  const sections = groupExpensesByDate(expenses);

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      renderSectionHeader={({section: {title}}) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
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
            {new Date(item.date).toLocaleTimeString()}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: '#374151',
  },
  card: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 5,
    borderWidth: 1,
  },
  expenseCard: {
    backgroundColor: '#fef0f0',
    borderColor: '#fecaca',
  },
  incomeCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#d1fae5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontWeight: '600',
    fontSize: 17,
  },
  expenseAmount: {
    color: '#dc2626',
  },
  incomeAmount: {
    color: '#16a34a',
  },
  date: {
    color: '#6b7280',
    fontSize: 13,
  },
});

export {ExpenseList};
