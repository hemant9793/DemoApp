export interface ExpenseItem {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
}

export interface User {
  id: string;
  name: string;
}
