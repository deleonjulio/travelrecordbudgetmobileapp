import { Platform, Text as RNText } from 'react-native'

export const Text = ({...props}) => {

    // its important that the props.style is on the right side so we can override it.
    return <RNText {...props} style={[{fontFamily: 'Muli'}, props.style]} />
}