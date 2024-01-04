import { memo, useState } from "react";
import { Modal, StyleSheet, View, TouchableOpacity, FlatList, Platform } from "react-native"
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ICONS, CATEGORY_COLOR } from "../../../config";
import { Text, IconCard } from "../../../components";

export const CategoryModal = memo(function CategoryModal({show, setShow, selectedIcon, setSelectedIcon, setSelectedColor, selectedColor}) {

  const [selectedTab, setSelectedTab] = useState('category')

  const handleOk = () => {
    setShow(false)
    setSelectedTab('category')
  }
  
  return (
      <Modal
        visible={show}
        animationType="fade"
        onRequestClose={() => setShow(false)}
        transparent={true}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{paddingTop: verticalScale(12)}}>
            {/* <Text style={{fontSize: moderateScale(17), color: 'black'}}>Selected Icon</Text> */}
            {/* <Icon name={selectedIcon} size={moderateScale(40)} color={'black'} /> */}
            <View style={{alignItems: 'flex-start'}}>
              <IconCard icon={selectedIcon} iconColor={selectedColor.iconColor} backgroundColor={selectedColor.backgroundColor} />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'lightgray', borderRadius: 8, paddingVertical: verticalScale(4)}}>
            <TouchableOpacity style={styles.button({selected: selectedTab === 'category' ? true : false})} disabled={selectedTab === 'category'} onPress={() => setSelectedTab('category')}>
              <Text style={styles.buttonText}>Icon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button({selected: selectedTab === 'color' ? true : false})} disabled={selectedTab === 'color'} onPress={() => setSelectedTab('color')}>
              <Text style={styles.buttonText}>Color</Text>
            </TouchableOpacity>
          </View>
          {
            selectedTab === 'category' ? (
              <FlatList
                key={1}
                data={ICONS}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => <ListItemCategory item={item} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} selectedColor={selectedColor} />}
                numColumns={4}
                style={{height: '30%', backgroundColor: 'whitesmoke', borderRadius: scale(8)}}
              />
            ) : (
              <FlatList
                keh={2}
                showsVerticalScrollIndicator
                data={CATEGORY_COLOR}
                keyExtractor={(item) => item.iconColor}
                renderItem={({ item }) => <ListItemColor item={item} selectedIcon={selectedIcon} selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>}
                numColumns={4}
                style={{height: '30%', backgroundColor: 'whitesmoke', borderRadius: scale(8)}}
              />
            )
          }
        
          <TouchableOpacity onPress={() => handleOk()} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
})

const ListItemCategory = memo(function ListItem({ item, selectedIcon, setSelectedIcon, selectedColor }) {
  return (
    <TouchableOpacity style={{ width: '25%'}} onPress={() => setSelectedIcon(item.name)}>
      <View renderToHardwareTextureAndroid style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.cardCategory({backgroundColor: selectedIcon === item.name ? 'lightgray' : null})]}>
         <Icon name={item.name} size={moderateScale(28)} color={'black'} />
        </View>
        <Text />
      </View>
    </TouchableOpacity>
  )
})

const ListItemColor = memo(function ListItem({ item, selectedIcon, selectedColor, setSelectedColor }) {
  return (
    <TouchableOpacity style={{ width: '25%'}} onPress={() => setSelectedColor({...item})}>
      <View renderToHardwareTextureAndroid style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.cardColor({backgroundColor: item.backgroundColor}), { borderColor: selectedColor.iconColor === item.iconColor ?  'black' : item.backgroundColor }]}>
         <Icon name={selectedIcon} size={moderateScale(28)} color={item.iconColor} />
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
    borderRadius: scale(6),
    paddingHorizontal: scale(10),
    marginHorizontal: scale(14),
    backgroundColor: 'white',
    gap: scale(12)
  },
  cardCategory:({backgroundColor}) => ({
    padding: moderateScale(14), 
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1), 
    borderColor: 'lightgray',
    backgroundColor: backgroundColor
  }),
  cardColor:({backgroundColor}) => ({
    padding: moderateScale(14), 
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1), 
    // borderColor: 'gray',
    backgroundColor: backgroundColor
  }),
  okButton: {backgroundColor: 'white', padding: 10, alignItems: 'flex-end'},
  okButtonText: {
    fontSize: moderateScale(17),
    color: 'black'
  },
  button:({selected}) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : selected ? 'white' : 'lightgray',
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    marginHorizontal: scale(4)
  }),
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Muli-Bold',
    color: 'black'
  }
});
