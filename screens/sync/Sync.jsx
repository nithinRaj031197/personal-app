import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Picker } from "react-native";
import SyncMobileStorage from "./SyncMobileStorage";
import SyncGoogleSheets from "./SyncGoogleSheets";

const Sync = () => {
  const [selectedSyncOption, setSelectedSyncOption] = useState("mobile");

  const renderSyncComponent = () => {
    if (selectedSyncOption === "mobile") {
      return <SyncMobileStorage />;
    } else if (selectedSyncOption === "google") {
      return <SyncGoogleSheets />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sync </Text>

      <Picker selectedValue={selectedSyncOption} style={styles.picker} onValueChange={(itemValue) => setSelectedSyncOption(itemValue)}>
        <Picker.Item label="Sync with Mobile Storage" value="mobile" />
        <Picker.Item label="Sync with Google Sheets" value="google" />
      </Picker>

      {renderSyncComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default Sync;
