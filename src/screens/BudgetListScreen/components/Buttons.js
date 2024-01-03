import React from 'react';
import {View, Alert, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import { RealmContext } from '../../../realm/RealmWrapper';
import { Budget, Category, Transaction } from '../../../realm/Schema';
import Realm from 'realm';
import dayjs from 'dayjs';
import RNFS from 'react-native-fs';
import Papa from 'papaparse'

export const RestoreBudgetButton = ({restoreBudget}) => {
  const confirmRestore = () =>
    Alert.alert('Restore', 'Are you sure you want to restore this budget?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => restoreBudget(),
      },
    ]);

  return (
    <TouchableOpacity style={styles.bottomSheetButton} onPress={confirmRestore}>
      <View style={styles.bottomSheetButtonTextContainer}>
        <Icon name="restore" size={moderateScale(24)} />
        <Text style={styles.bottomSheetButtonText}>Restore Budget</Text>
      </View>
    </TouchableOpacity>
  );
};

export const DeleteBudgetButton = ({deleteSuccessfulCallback, selectedBudget}) => {
  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const budgetToBeArchive = useObject(Budget, selectedBudget?._id);

  const archiveBudget = () => {
    realm.write(() => {
      budgetToBeArchive.archived = true
      budgetToBeArchive.selected = false
      deleteSuccessfulCallback()
    });
  }

  const confirmDelete = () =>
    Alert.alert('Delete Budget', 'This action cannot be undone.', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => archiveBudget(),
          style: 'destructive',
        },
      ],
    );

  return (
    <TouchableOpacity style={styles.bottomSheetButton} onPress={confirmDelete}>
      <View style={styles.bottomSheetButtonTextContainer}>
        <Icon name="delete" size={moderateScale(24)} />
        <Text style={styles.bottomSheetButtonText}>Delete Budget</Text>
      </View>
    </TouchableOpacity>
  );
};

export const CloseButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.bottomSheetButton} onPress={onPress}>
      <View style={styles.bottomSheetButtonTextContainer}>
        <Icon name="close" size={moderateScale(24)} />
        <Text style={styles.bottomSheetButtonText}>Close</Text>
      </View>
    </TouchableOpacity>
  );
};

export const SelectButton = ({selectSuccessCallback, selectedBudget}) => {
  const { useRealm, useObject, useQuery } = RealmContext
  const realm = useRealm()
  const budgetToBeSelected = useObject(Budget, selectedBudget?._id);

  let currentActiveBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0 && archived == $1', true, false);
  });

  const selectBudget = () => {
    realm.write(() => {
      for (const activeBudget of currentActiveBudget) {
        activeBudget.selected = false
      }
      budgetToBeSelected.selected = true

      selectSuccessCallback()
    });
  }

  return (
    <TouchableOpacity style={styles.bottomSheetButton} onPress={selectBudget}>
      <View style={styles.bottomSheetButtonTextContainer}>
        <Icon name="cursor-pointer" size={moderateScale(24)} />
        <Text style={styles.bottomSheetButtonText}>Select</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ExportButton = ({selectSuccessCallback, selectedBudget}) => {
  const { useRealm, useObject, useQuery } = RealmContext
  const realm = useRealm()
  const budgetToBeSelected = useObject(Budget, selectedBudget?._id);

  const categories = useQuery(Category, categories => {
    return categories.sorted('dateCreated', true)
  })

  let transactions = useQuery(Transaction, transaction => {
    return transaction.filtered('budgetId == $0', new Realm.BSON.ObjectId(selectedBudget?._id));
  })

  transactions = transactions.map((transaction) => {
    const categoryInfo = categories.find((category) => category?._id.toString() === transaction.categoryId.toString())
    return ({
      category: categoryInfo.name,
      amount: transaction.amount / 100,
      description: transaction.description,
      date: dayjs(transaction.transactionDate).format('YYYY-MM-DD').toString(),
    })
  })

  const exportBudget = async () => {

    try {
      // Convert data to CSV string
      const csvString = Papa.unparse(transactions);

      if (!csvString) {
        throw new Error('CSV string is empty');
      }

      const path = RNFS.DocumentDirectoryPath + '/example.csv';

      await RNFS.writeFile(path, csvString, 'utf8');
      console.log('CSV file created successfully:', path);
    } catch (error) {
      console.log(error)
      // console.error('Error creating CSV file:', error);
    }
  }

  return (
    <TouchableOpacity style={styles.bottomSheetButton} onPress={exportBudget}>
      <View style={styles.bottomSheetButtonTextContainer}>
        <Icon name="download" size={moderateScale(24)} />
        <Text style={styles.bottomSheetButtonText}>Export</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  budgetCardTextContainer: {paddingHorizontal: scale(4)},
  bottomSheetButton: {
    paddingVertical: verticalScale(16),
  },
  bottomSheetButtonTextContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    gap: scale(25),
  },
  bottomSheetButtonText: {
    fontSize: moderateScale(16),
    color: 'black',
  },
});
