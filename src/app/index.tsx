import { StyleSheet, Text, View } from "react-native";

const App = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text>Test</Text>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
});
