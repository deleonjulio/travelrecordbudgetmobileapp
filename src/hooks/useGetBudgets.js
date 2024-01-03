import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { retrieveData } from "../utils/helper";

export const useGetBudgets = () => {
  const [budgets, setBudgets] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getBudgets = async () => {
        try {
          const budgetsFromStorage = await retrieveData('budgets');
          if (budgetsFromStorage) {
            setBudgets(budgetsFromStorage);
          }
        } catch (error) {
          Alert.alert('Something went wrong!');
        }
      };

      getBudgets();
    }, []),
  );
  
  return { budgets }
}