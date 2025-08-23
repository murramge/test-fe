import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable } from 'react-native';

import { Button, Modal, Text, View, useModal } from './';
import { Calendar } from './icons';
import { placeholder } from 'i18n-js';

type DatePickerProps = {
  value?: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  testID?: string;
};

export function DatePicker({
  value,
  onDateChange,
  testID,
}: DatePickerProps) {
  const modal = useModal();
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      modal.dismiss();
      if (date && event.type === 'set') {
        setSelectedDate(date);
        onDateChange(formatDate(date));
      }
      return;
    }
    
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    onDateChange(formatDate(selectedDate));
    modal.dismiss();
  };

  const handleClear = () => {
    onDateChange('');
    modal.dismiss();
  };

  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const handleAndroidPress = () => {
    console.log('DatePicker pressed - Android');
    setShowAndroidPicker(true);
  };

  const handleAndroidDateChange = (event: any, date?: Date) => {
    setShowAndroidPicker(false);
    if (date && event.type === 'set') {
      setSelectedDate(date);
      onDateChange(formatDate(date));
    }
  };

  if (Platform.OS === 'android') {
    return (
      <>
        <Pressable
          onPress={handleAndroidPress}
          className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
          testID={testID}
        >
          <Text className={`text-base ${value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {value ? formatDisplayDate(value) : '날짜 선택'}
          </Text>
          <Calendar color="#6b7280" size={20} />
        </Pressable>

        {showAndroidPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleAndroidDateChange}
            minimumDate={new Date()}
            locale="ko-KR"
          />
        )}
      </>
    );
  }

  // iOS
  return (
    <>
      <Pressable
        onPress={() => {
          console.log('DatePicker pressed - iOS');
          modal.present();
        }}
        className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
        testID={testID}
      >
        <Text className={`text-base ${value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {value ? formatDisplayDate(value) : '날짜 선택'}
        </Text>
        <Calendar color="#6b7280" size={20} />
      </Pressable>

      <Modal
        ref={modal.ref}
        snapPoints={['35%']}
      >
        <View className="flex-1 bg-white px-4 py-2 dark:bg-gray-900">
          <View className="flex-1 items-center justify-center">
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date()}
              locale="ko-KR"
              style={{ width: '100%', height: 200 }}
            />
          </View>
          
          <View className="flex-row gap-3 pb-4 pt-2">
            <Button
              label="취소"
              variant="outline"
              onPress={modal.dismiss}
              className="flex-1"
            />
            <Button
              label="지우기"
              variant="outline"
              onPress={handleClear}
              className="flex-1"
            />
            <Button
              label="확인"
              onPress={handleConfirm}
              className="flex-1"
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
