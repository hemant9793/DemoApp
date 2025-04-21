import firestore from '@react-native-firebase/firestore';
import {ExpenseItem, User} from '../../types';

const USERS_COLLECTION = 'users';

// Helper function to get the user's document reference
const getUserDoc = (userId: string) =>
  firestore().collection(USERS_COLLECTION).doc(userId);

export const setMonthlyBudget = async (
  userId: string,
  month: string, // Format: "YYYY-MM"
  amount: number,
) => {
  const ref = getUserDoc(userId).collection('budgets').doc(month);

  await ref.set(
    {
      initialBudget: amount,
      createdAt: firestore.FieldValue.serverTimestamp(),
    },
    {merge: true},
  );
};

export const fetchMonthlyBudget = async (
  userId: string,
  month: string, // Format: "YYYY-MM"
): Promise<number | null> => {
  const doc = await getUserDoc(userId).collection('budgets').doc(month).get();
  console.log('doc', doc);

  if (doc.exists) {
    return doc.data()?.initialBudget ?? null;
  }

  return null;
};

export const fetchMonthlyExpenses = async (
  userId: string,
  month: string, // Format: "YYYY-MM"
): Promise<ExpenseItem[]> => {
  const year = parseInt(month.substring(0, 4), 10);
  const monthNumber = parseInt(month.substring(5, 7), 10) - 1; // JavaScript months are 0-indexed
  const startUTC = new Date(Date.UTC(year, monthNumber, 1, 0, 0, 0));
  const endUTC = new Date(Date.UTC(year, monthNumber + 1, 1, 0, 0, 0));

  const snapshot = await getUserDoc(userId)
    .collection('expenses')
    .where('date', '>=', firestore.Timestamp.fromDate(startUTC))
    .where('date', '<', firestore.Timestamp.fromDate(endUTC))
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    amount: doc.data().amount,
    category: doc?.data()?.category,
    date: (doc.data().date as firestore.Timestamp).toDate().toISOString(),
    userId: userId,
  }));
};

export const addExpenseToFirestore = async (
  userId: string,
  expense: Omit<ExpenseItem, 'id' | 'userId'>, // Don't require id and userId here
) => {
  await getUserDoc(userId)
    .collection('expenses')
    .add({
      ...expense,
      date: firestore.Timestamp.fromDate(expense?.date),
    });
};

export const createUserTable = async (newUser: User) => {
  try {
    await firestore().collection('users').doc(newUser.id).set({
      name: newUser.name,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log('User document created in Firestore:', newUser.id);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};
