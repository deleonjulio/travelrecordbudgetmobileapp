import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { retrieveData } from "../utils/helper";

export const useGetCategories = () => {
  const [categories, setCategories] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getCategories = async () => {
        try {
          const categoriesFromStorage = await retrieveData('categories');
          if (categoriesFromStorage) {
            setCategories(categoriesFromStorage);
          }
        } catch (error) {
          Alert.alert('Something went wrong!');
        }
      };

      getCategories();
    }, []),
  );
  
  return { categories }
}