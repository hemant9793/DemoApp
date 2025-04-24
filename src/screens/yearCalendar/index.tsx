import React, {useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GoodDayModal from './components/GoodDayModal';
import {AppSingleton} from '../../constants';
import {fetchGoodDaysForYear, setGoodDayNote} from '../../firebase/firestore';
import {Loader} from '../../common/components/loader/Loader';

interface DayData {
  date: string;
  day: number;
  isCurrentDay: boolean;
}

const getDaysInMonth = (month: number, year: number): DayData[] => {
  const date = new Date(year, month, 1);
  const today = new Date();
  const days: DayData[] = [];

  while (date.getMonth() === month) {
    const isCurrentDay =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    const currentDate = date.toLocaleDateString('en-CA');

    days.push({
      date: currentDate,
      day: date.getDate(),
      isCurrentDay,
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const generateYearCalendar = (year: number) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthNames.map((month, index) => ({
    title: month,
    data: getDaysInMonth(index, year),
  }));
};

interface DayCellProps {
  day: number;
  isCurrentDay: boolean;
  isGoodDay: boolean;
  onPress: () => void;
}

const DayCell = React.memo(
  ({day, isCurrentDay, isGoodDay, onPress}: DayCellProps) => {
    const backgroundColor = isGoodDay
      ? '#007bff' // green
      : isCurrentDay
      ? '#FFD700' // yellow
      : '#E0E0E0'; // default

    const textColor = isGoodDay || isCurrentDay ? '#FFF' : '#000';

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.day, {backgroundColor}]}>
        <Text style={{color: textColor, fontSize: 12}}>{day}</Text>
      </TouchableOpacity>
    );
  },
);

const YearlyCalendar: React.FC = () => {
  const year = new Date().getFullYear();
  const months = useMemo(() => generateYearCalendar(year), [year]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [goodDays, setGoodDays] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleSubmit = async (note: string, date: string) => {
    if (note.trim()) {
      setLoading(true);
      setGoodDays(prev => new Set([...prev, date]));
      await setGoodDayNote(AppSingleton?.user?.id || '', date, note.trim());
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGoodDays = async () => {
      setLoading(true);
      const userId = AppSingleton.user?.id;
      if (userId) {
        const days = await fetchGoodDaysForYear(userId, year);
        console.log('loadGoodDays -> days', days);
        setGoodDays(days);
      }
      setLoading(false);
    };
    loadGoodDays();
  }, [year]);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{padding: 10}}>
      <>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.header}>Yearly Calendar</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {months.map(month => (
            <View key={month.title} style={styles.months}>
              <Text style={styles.title}>{month.title}</Text>
              <View style={styles.monthData}>
                {month.data.map(day => (
                  <DayCell
                    key={day.date}
                    day={day.day}
                    isCurrentDay={day.isCurrentDay}
                    isGoodDay={goodDays.has(day.date)}
                    onPress={() => handleDayPress(day.date)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </>
      {selectedDate && (
        <GoodDayModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedDate={selectedDate}
          userId={AppSingleton.user?.id || ''}
          onSubmit={handleSubmit}
        />
      )}
      <Loader visible={loading} />
    </ScrollView>
  );
};

export {YearlyCalendar};

const styles = StyleSheet.create({
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007bff',
  },
  headerName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: 'black',
  },
  months: {
    marginRight: 4,
    alignItems: 'center',
  },
  monthData: {
    height: '100%',
    maxHeight: '100%',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  day: {
    width: 24,
    height: 20,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
  },
});
