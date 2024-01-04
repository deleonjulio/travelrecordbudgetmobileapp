import { DarkTheme } from "@react-navigation/native";


export const PRIVACY_POLICY_URL = 'https://sites.google.com/view/pokedex-gen-i-privacy-policy/home'

export const colors = {
  purple: "#966fd6",
  backgroundPrimaryDark: '#181818',
  backgroundSecondaryDark: '#2b2f40',
  // backgroundPrimaryDark: '#2b2f40',
  // backgroundSecondaryDark: '#181818',
  textPrimary: 'black',
  textPrimaryDark: 'lightgray',

  color1: '#001B48',
  color2: '#02457A',
  color3: '#018ABE',
  color4: '#97CADB',
  color5: '#D6E8EE',
  inputBorder: '#D3D3D3',

  // https://www.canva.com/colors/color-palettes/wall-greens/
  // color1: '#778A35', //Olive
  // color2: '#D1E2C4', //Sage Green
  // color3: '#EAF1FB', //'#EBEBE8', //Pewter
  // color4: '#31352E', //Olive Green
  // https://www.canva.com/colors/color-palettes/rosettes-and-cream/
  // color1: '#EF7C8E', //Hot Pink
  // color2: '#FAE8E0', //Cream
  // color3: '#B6E2D3', //Spearmint
  // color4: '#D8A7B1', //Rosewater
  // https://www.canva.com/colors/color-palettes/healthy-leaves/
  // color1: '#3D550C', //Olive Green
  // color2: '#81B622', //Lime Green
  // color3: '#ECF87F', //Yellow Green
  // color4: '#59981A', //Green
  // https://www.canva.com/colors/color-palettes/bright-lights/
  // color1: '#68BBE3', //Olive Green
  // color2: '#0E86D4', //Lime Green
  // color3: '#055C9D', //Yellow Green
  // color4: '#003060', //Green
  // https://www.canva.com/colors/color-palettes/freshly-picked-oranges/.
  // color1: '#ADA7A7', //Olive Green
  // color2: '#D3D3CB', //Lime Green
  // color3: '#D37506', //Yellow Green
  // color4: '#9F2B00', //Green
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    // primary: '#2b2f40',
    background: colors.backgroundPrimaryDark,
    card: colors.backgroundPrimaryDark,
  },
};

export const ICONS = [
  { 
    name: 'bank'
  },
  {
    name: 'cart'
  },
  {
    name: 'food'
  },
  { 
    name: 'bus'
  },
  {
    name: 'lightning-bolt'
  },
  { 
    name: 'ambulance'
  },
  {
    name: 'television-classic'
  },
  {
    name: 'emoticon-happy-outline'
  },
  {
    name: 'gift'
  },
  {
    name: 'cake-variant'
  },
  {
    name: 'home'
  },
  {
    name: 'wallet'
  },
  {
    name: 'cards-heart-outline'
  },
  {
    name: 'dots-horizontal-circle-outline'
  },
  {
    name: 'water'
  },
  {
    name: 'credit-card-outline'
  },
  {
    name: 'piggy-bank-outline'
  },
  {
    name: 'currency-usd'
  },
  {
    name: 'wallet-travel'
  },
  {
    name: 'wallet-giftcard'
  },
  {
    name: 'shopping'
  },
  {
    name: 'account'
  },
  {
    name: 'account-tie'
  },
  {
    name: 'airplane'
  },
  { 
    name: 'alarm'
  },
  { 
    name: 'alert'
  },
  { 
    name: 'ammunition'
  },
  { 
    name: 'anchor'
  },
  { 
    name: 'android-messages'
  },
  { 
    name: 'antenna'
  },
  { 
    name: 'apple'
  },
  { 
    name: 'archive-outline'
  },
  { 
    name: 'arm-flex'
  },
  { 
    name: 'arrow-all'
  },
  { 
    name: 'baby-carriage'
  },
  { 
    name: 'baby-face-outline'
  },
  { 
    name: 'badminton'
  },
  { 
    name: 'bag-checked'
  },
  { 
    name: 'bag-personal'
  },
  { 
    name: 'bag-suitcase'
  },
  { 
    name: 'baguette'
  },
  { 
    name: 'balloon'
  },
  { 
    name: 'bandage'
  },
  { 
    name: 'basket'
  },
  { 
    name: 'basketball'
  },
  {
    name: 'battery-charging-outline'
  },
  {
    name: 'beach'
  },
  {
    name: 'bed-empty'
  },
  {
    name: 'beer'
  },
  {
    name: 'bell'
  },
  {
    name: 'bicycle'
  },
  {
    name: 'bitcoin'
  }
]

export const CURRENCY_LIST = [
  {
    label: '₱', value: '₱'
  },
  {
    label: '$', value: '$'
  },
  {
    label: '€', value: '€'
  },
  {
    label: '¥', value: '¥'
  },
  {
    label : '£', value: '£'
  },
  {
    label : '₽', value: '₽'
  },
  {
    label: '฿', value: '฿'
  }
]

export const CATEGORY_COLOR = [
  {
    iconColor: 'black',
    backgroundColor: 'lightgray'
  },
  {
    iconColor: '#f6c504',
    backgroundColor: '#fceaa1'
  },
  {
    iconColor: '#de4478',
    backgroundColor: '#f8bacf'
  },
  {
    iconColor: '#37c796',
    backgroundColor: '#b5eedb'
  },
  {
    iconColor: '#1c64cc',
    backgroundColor: '#a7caf5'
  },
  {
    iconColor: '#844cc1',
    backgroundColor: '#d7bdfd'
  },
  {
    iconColor: '#965A3A',
    backgroundColor: '#CE9A72'
  },
  {
    //orange
    iconColor: '#F05E16',
    backgroundColor: '#FFB347'
  },
  {
    iconColor: '#26748c',
    backgroundColor : '#52b2cf'
  }
]
// 5 unused
export const CATEGORY_INIT = [
  {
    ...CATEGORY_COLOR[2],
    name: 'Eating Out',
    icon: ICONS.find((icon) => icon.name === 'food').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[3],
    name: 'Transportion',
    icon: ICONS.find((icon) => icon.name === 'bus').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[4],
    name: 'Groceries',
    icon: ICONS.find((icon) => icon.name === 'cart').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[1],
    name: 'Utilities',
    icon: ICONS.find((icon) => icon.name === 'lightning-bolt').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[5],
    name: 'Entertainment',
    icon: ICONS.find((icon) => icon.name === 'television-classic').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[7],
    name: 'Gift',
    icon: ICONS.find((icon) => icon.name === 'gift').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[8],
    name: 'Shopping',
    icon: ICONS.find((icon) => icon.name === 'shopping').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[6],
    name: 'Personal',
    icon: ICONS.find((icon) => icon.name === 'account').name,
    dateCreated: new Date(),
  },
  {
    ...CATEGORY_COLOR[0],
    name: 'Miscellaneous',
    icon: ICONS.find((icon) => icon.name === 'dots-horizontal-circle-outline').name,
    dateCreated: new Date(),
  }
]

