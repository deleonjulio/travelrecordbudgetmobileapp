import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {retrieveData} from '../../utils/helper';
import { colors } from '../../config';

export const CategoryScreen = ({navigation}) => {
  const [categories, setCategories] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
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

  return (
    <CategoryContent
      categories={categories}
      createCategory={() => navigation.navigate('CreateCategoryScreen')}
    />
  );
};

const CategoryContent = ({categories, createCategory}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        {/* <Text>Category</Text> */}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerHeader}>
          <View style={styles.bottomContainerHeaderLeft}>
            <Text style={styles.title}>Categories</Text>
          </View>
          <View style={styles.bottomContainerHeaderRight}>
            <TouchableOpacity
              style={styles.addCategoryButton}
              onPress={createCategory}>
              <Text style={styles.addCategoryButtonText}>New Category</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={categories}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate('UpdateCategoryScreen', {
                    categoryId: item?.id,
                  })
                }
                key={item?.id}>
                <Text style={styles.categoryCardText}>{item?.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topContainer: {
    flex: 1,
    backgroundColor: colors.color2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 3,
  },
  bottomContainerHeader: {
    flexDirection: 'row',
    borderWidth: 0.2,
    borderColor: '#ccc',
  },
  bottomContainerHeaderLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomContainerHeaderRight: {
    flex: 1,
  },
  addCategoryButtonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 18,
  },
  addCategoryButton: {
    backgroundColor: colors.color2,
    alignItems: 'center',
    padding: 20,
  },
  categoryCard: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryCardText: {
    fontWeight: '700',
  },
});
