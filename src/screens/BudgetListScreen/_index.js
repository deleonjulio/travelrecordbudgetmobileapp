import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import dayjs from 'dayjs';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {retrieveData, storeData, moneyFormat} from '../../utils/helper';
import {colors} from '../../config';
import {
  RestoreBudgetButton,
  DeleteBudgetButton,
  CloseButton,
} from './components';

export const BudgetListScreen = () => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['27%'], []);
  const handleOpenBottomSheet = useCallback(budgetId => {
    bottomSheetModalRef.current?.present();
    setSelectedBudget(budgetId);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        appearsOnIndex={1}
        animatedIndex={{
          value: 1,
        }}
      />
    ),
    [],
  );

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [budgets, setBudgets] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const getCategories = async () => {
        try {
          const budgetsFromStorage = await retrieveData('budgets');
          if (budgetsFromStorage) {
            const {
              budgets: initialBudgets,
              archivedBudgets: initialArchivedBudgets,
            } = budgetsFromStorage;
            setBudgets({
              active: initialBudgets,
              archive: initialArchivedBudgets,
            });
          }
        } catch (error) {
          Alert.alert('Something went wrong!');
        }
      };

      getCategories();
    }, []),
  );

  const restoreBudget = async () => {
    try {
      const budgetsFromStorage = await retrieveData('budgets');
      let {
        selectedBudget: initialSelectedBudget,
        archivedBudgets: initialArchivedBudgets,
        budgets: initialBudgets,
      } = budgetsFromStorage;

      const toBeRestored = initialArchivedBudgets.find(
        budget => budget.id === selectedBudget,
      );

      let updatedSelectedBudget = initialSelectedBudget;
      if (initialBudgets?.length === 0) {
        updatedSelectedBudget = toBeRestored.id;
      }

      const updatedBudget = {
        selectedBudget: updatedSelectedBudget,
        budgets: [toBeRestored, ...initialBudgets],
        archivedBudgets: initialArchivedBudgets.filter(
          budget => budget.id !== selectedBudget,
        ),
      };

      const saveBudget = await storeData('budgets', updatedBudget);
      if (saveBudget) {
        bottomSheetModalRef.current?.dismiss();
        setBudgets({
          active: updatedBudget.budgets,
          archive: updatedBudget.archivedBudgets,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong!');
    }
  };

  const deleteBudget = async () => {
    try {
      const budgetsFromStorage = await retrieveData('budgets');
      let {archivedBudgets: initialArchivedBudgets} = budgetsFromStorage;

      const updatedBudget = {
        ...budgetsFromStorage,
        archivedBudgets: initialArchivedBudgets.filter(
          budget => budget.id !== selectedBudget,
        ),
      };

      const saveBudget = await storeData('budgets', updatedBudget);
      if (saveBudget) {
        bottomSheetModalRef.current?.dismiss();
        setBudgets({
          active: updatedBudget.budgets,
          archive: updatedBudget.archivedBudgets,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong!');
    }
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          disabled={activeTab === 1}
          onPress={() => setActiveTab(1)}
          style={
            activeTab === 1 ? styles.activeTabButton : styles.inactiveTabButton
          }>
          <Text
            style={
              activeTab === 1
                ? styles.activeTabButtonText
                : styles.inactiveTabButtonText
            }>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={activeTab === 0}
          onPress={() => setActiveTab(0)}
          style={
            activeTab === 0 ? styles.activeTabButton : styles.inactiveTabButton
          }>
          <Text
            style={
              activeTab === 0
                ? styles.activeTabButtonText
                : styles.inactiveTabButtonText
            }>
            Archive
          </Text>
        </TouchableOpacity>
      </View>
      <BudgetList
        activeTab={activeTab}
        budgets={budgets}
        handleOpenBottomSheet={handleOpenBottomSheet}
      />
      <BottomSheetModal
        handleComponent={null}
        handleIndicatorStyle={{display: 'none'}}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        backgroundStyle={{borderRadius: 0}}>
        <RestoreBudgetButton restoreBudget={restoreBudget} />
        <DeleteBudgetButton deleteBudget={deleteBudget} />
        <CloseButton onPress={() => bottomSheetModalRef.current?.dismiss()} />
      </BottomSheetModal>
    </View>
  );
};

const BudgetList = ({activeTab, budgets, handleOpenBottomSheet}) => {
  if (activeTab === 1) {
    return (
      <FlatList
        contentContainerStyle={{paddingBottom: verticalScale(100)}}
        data={budgets?.active}
        renderItem={({item}) => {
          return (
            <TouchableOpacity key={item?.id} style={styles.budgetCard}>
              <View style={styles.budgetCardTextContainer}>
                <Text style={styles.budgetName}>{item?.name}</Text>
                <Text style={styles.budgetAmount}>
                  {moneyFormat(item?.amount)}
                </Text>
                <Text style={styles.date}>
                  {`${dayjs(item.startDate).format('MMM DD, YYYY')} - ${dayjs(
                    item?.endDate,
                  ).format('MMM DD, YYYY')}`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={{paddingBottom: verticalScale(100)}}
      data={budgets?.archive}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            key={item?.id}
            style={styles.budgetCard}
            onPress={() => handleOpenBottomSheet(item?.id)}>
            <View style={styles.budgetCardTextContainer}>
              <Text style={styles.budgetName}>{item?.name}</Text>
              <Text style={styles.budgetAmount}>
                {moneyFormat(item?.amount)}
              </Text>
              <Text style={styles.date}>
                {`${dayjs(item.startDate).format('MMM DD, YYYY')} - ${dayjs(
                  item?.endDate,
                ).format('MMM DD, YYYY')}`}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: verticalScale(20),
    marginHorizontal: scale(10),
  },
  activeTabButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(14),
    borderRadius: moderateScale(14),
    backgroundColor: colors.color2,
    width: scale(100),
  },
  inactiveTabButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(14),
    borderRadius: moderateScale(14),
    width: scale(100),
  },
  activeTabButtonText: {
    color: 'white',
    fontSize: verticalScale(16),
    fontWeight: '700',
  },
  inactiveTabButtonText: {
    color: 'gray',
    fontSize: verticalScale(16),
    fontWeight: '700',
  },
  budgetCard: {
    backgroundColor: 'white',
    marginHorizontal: scale(25),
    marginVertical: verticalScale(10),
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    elevation: 2,
  },
  budgetName: {
    fontSize: moderateScale(16),
  },
  budgetAmount: {
    fontWeight: '600',
    fontSize: moderateScale(24),
  },
  date: {
    fontSize: moderateScale(14),
  },
  budgetCardTextContainer: {paddingHorizontal: scale(4)},
});
