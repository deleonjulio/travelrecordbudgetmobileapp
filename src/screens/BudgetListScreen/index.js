import { useState, useRef, useMemo, useCallback } from "react"
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import dayjs from "dayjs"
import { RealmContext } from "../../realm/RealmWrapper"
import { moneyFormat } from "../../utils/helper"
import { Text } from "../../components"
import { Transaction } from "../../realm/Schema"
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { DeleteBudgetButton, CloseButton, SelectButton, ExportButton } from "./components"

export const BudgetListScreen = ({navigation}) => {
    const [selectedBudget, setSelectedBudget] = useState(null)
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['28%'], []);
    
    const handleOpenBottomSheet = useCallback(budget => {
        bottomSheetModalRef.current?.present();
        setSelectedBudget(budget);
    }, []);

    const renderBackdrop = useCallback( props => (<BottomSheetBackdrop {...props} pressBehavior={'close'} appearsOnIndex={1} animatedIndex={{ value: 1 }} />), [],);

    const { useQuery, useRealm } = RealmContext
    const realm = useRealm()
    
    let budgets = useQuery('Budget', budgets => {
        return budgets.filtered('archived == $0', false).sorted('selected', true);
    });

    const budgetIds = budgets.map((budget) => budget?._id)
    const transactions = realm.objects(Transaction).filtered('budgetId IN $0', budgetIds)

    budgets = budgets.map((budget) => {
        let transactionCount = 0
        transactions.forEach((transaction) => {
            if(budget?._id.toString() === transaction?.budgetId.toString()) {
                transactionCount++
            }
        })
        return {...budget, transactionCount}
    })

    const selectSuccessCallback = () => {
        bottomSheetModalRef.current?.dismiss()
        navigation.goBack()
    }

    const deleteSuccessfulCallback = () => { 
        bottomSheetModalRef.current?.dismiss()
        if(budgets.length === 1) {
            navigation.goBack()
        }
    }

    return (
        <View style={styles.container}>
            <BudgetList budgets={budgets} handleOpenBottomSheet={handleOpenBottomSheet} />
            <BottomSheetModal
                // handleComponent={null}
                // handleIndicatorStyle={{display: 'none'}}
                backdropComponent={renderBackdrop}
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                // backgroundStyle={{borderRadius: 0}}
            >   
                <SelectButton selectSuccessCallback={selectSuccessCallback} selectedBudget={selectedBudget}  />
                <ExportButton selectSuccessCallback={selectSuccessCallback} selectedBudget={selectedBudget}  />
                <DeleteBudgetButton deleteSuccessfulCallback={deleteSuccessfulCallback} selectedBudget={selectedBudget} />
                {/* <CloseButton onPress={() => bottomSheetModalRef.current?.dismiss()} /> */}
            </BottomSheetModal>
        </View>
    )
}

const BudgetList = ({budgets, handleOpenBottomSheet}) => {
    const flatListRef = useRef(null);

    // Function to scroll to a specific index
    const scrollToIndex = (index) => {
        flatListRef.current.scrollToIndex({ animated: true, index });
    };

    return (
        <FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
            data={budgets}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => {
            return (
                    <TouchableOpacity key={item?._id} style={styles.budgetCard({selected: item?.selected})} onPress={() => handleOpenBottomSheet(item)}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', rowGap: verticalScale(2)}}>
                            <View>
                                <Text style={styles.budgetName} numberOfLines={2} ellipsizeMode='tail' >{item?.name}</Text>
                                <Text style={styles.date}>
                                {`${dayjs(item.startDate).format('MMM DD, YYYY')} - ${dayjs(
                                    item?.endDate,
                                ).format('MMM DD, YYYY')}`}
                                </Text>
                            </View>
                            <View>
                                {item?.selected && <Text style={styles.activeText}>Active</Text>}
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                            <View style={{flex: 0.40}}>
                                <Text style={styles.transactionCount}>{`${item.transactionCount} transaction${item.transactionCount > 1 || item.transactionCount === 0 ? 's' : ''}`}</Text>
                            </View>
                            <View style={{flex:0.60, alignItems: 'flex-end'}}>
                                <Text style={styles.amountText}>Budget</Text>
                                <Text style={styles.budgetAmount} numberOfLines={1} ellipsizeMode='tail'>{`${item?.currency ? item.currency : ''}${moneyFormat(item?.amount)}`}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    )    
}

const styles = StyleSheet.create({
    container: {
        // marginTop: verticalScale(8),
        paddingHorizontal: scale(12),
        flex: 1
    },
    budgetCard: ({selected = false}) => ({
        marginVertical: verticalScale(5),
        backgroundColor: 'white',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
        borderWidth: moderateScale(selected ? 0.5 : 0),
        borderColor: '#37c796',
    }),
    budgetName: {
        color: 'black',
        fontSize: moderateScale(16),
        fontWeight: '600'
    },
    date: {
        color: 'gray',
        fontSize: moderateScale(14),
        fontWeight: '400',
    },
    amountText: {
        color: 'gray',
        fontSize: moderateScale(14),
        fontWeight: '400',
    },
    budgetAmount: {
        color: 'black',
        fontSize: moderateScale(20),
        fontWeight: '500',
    },   
    transactionCount: {
        color: 'black',
        fontSize: moderateScale(14)
    },
    activeText: {
        color: '#37c796',
        fontWeight: '600',
        fontFamily: 'Muli-SemiBold'
    }
});
    