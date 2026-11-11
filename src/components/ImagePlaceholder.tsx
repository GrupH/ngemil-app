import { ImageOff } from "lucide-react-native";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export default function ImagePlaceholder({style}:{style?: StyleProp<ViewStyle>}){
    return(
        <View style={[styles.container, style]}>
            <ImageOff color="#bababa" size={40}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#dadada",
        justifyContent: "center",
        alignItems: "center"
    }
})