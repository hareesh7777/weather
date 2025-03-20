import { StyleSheet, Text, View } from "react-native";
import React from "react";

const RowItem = ({
  leftText,
  rightText,
}: {
  leftText: string;
  rightText: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={styles.left}>{leftText}</Text>
      <Text style={styles.right}>{rightText}</Text>
    </View>
  );
};

export default RowItem;

const styles = StyleSheet.create({
  right: {
    fontSize: 20,
    textAlign: "right",
  },
  left: {
    fontSize: 16,
  },
});
