import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { retrieveData } from "../utils/helper";

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getTransactions = async () => {
        try {
          const transactionsFromStorage = await retrieveData('transactions');
          if (transactionsFromStorage) {
            setTransactions(transactionsFromStorage);
          }
        } catch (error) {
          Alert.alert('Something went wrong!');
        }
      };

      getTransactions();
    }, []),
  );
  
  return { transactions }
}