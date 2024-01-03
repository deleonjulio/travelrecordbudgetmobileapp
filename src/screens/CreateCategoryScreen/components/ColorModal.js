import { memo } from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Text, FlatList, Platform } from "react-native"
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CATEGORY_COLOR } from "../../../config";

export const ColorModal = memo(function CategoryModal({show, setShow, selectedColor, setSelectedColor}) {
  return (
      <Modal
        visible={show}
        animationType="fade"
        onRequestClose={() => setShow(false)}
        transparent={true}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* <View style={{paddingHorizontal: scale(16), paddingVertical: verticalScale(12), rowGap: verticalScale(10)}}>
            <Text style={{fontSize: moderateScale(17), color: 'black'}}>Selected Icon</Text>
            <Icon name={selectedIcon} size={moderateScale(40)} color={'black'} />
          </View> */}
          <FlatList
            showsVerticalScrollIndicator
            data={CATEGORY_COLOR}
            keyExtractor={(item) => item.iconColor}
            renderItem={({ item }) => <ListItem item={item} selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>}
            numColumns={4}
            style={{height: '50%'}}
          />
          <TouchableOpacity onPress={() => setShow(false)} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
})

const ListItem = memo(function ListItem({ item, selectedColor, setSelectedColor }) {

  return (
    <TouchableOpacity style={{ width: '25%'}} onPress={() => setSelectedColor({...item})}>
      <View renderToHardwareTextureAndroid style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* { backgroundColor: selectedColor.iconColor === item.iconColor ? 'whitesmoke' : 'white'} */}
        <View style={[styles.card({backgroundColor: item.backgroundColor})]}>
         <Icon name="format-color-text" size={moderateScale(26)} color={item.iconColor} />
        </View>
        <Text />
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  centeredView: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    paddingHorizontal: scale(10),
    marginHorizontal: scale(14),
    backgroundColor: 'white',
  },
  card: ({backgroundColor}) => ({
    padding: moderateScale(14), 
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(0.5), 
    borderColor: 'gray',
    elevation: moderateScale(2),
    backgroundColor: backgroundColor
  }),
  okButton: {backgroundColor: 'white', padding: 10, alignItems: 'flex-end'},
  okButtonText: {
    fontSize: moderateScale(17),
    color: 'black'
  }
});
