import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
    minHeight: 30,
    alignItems: "center",
  },
  headerRow: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderBottomColor: "#4E81BD",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  labelCell: {
    width: "35%",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    fontWeight: "bold",
    fontSize: 12,
    color: "#000000",
  },
  valueCell: {
    width: "65%",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 12,
    color: "#000000",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#000000",
  },
});

interface TableRow {
  label: string;
  value: string | string[];
}

interface ResumeTableProps {
  rows: TableRow[];
  showHeader?: boolean;
  labelWidth?: string;
  valueWidth?: string;
  headerOne?: string;
  headerTwo?: string;
}

export function ResumeTable({ 
  rows, 
  showHeader = false,
  labelWidth = "35%",
  valueWidth = "65%",
  headerOne = "Category",
  headerTwo = "Details"
}: ResumeTableProps) {
  const customLabelStyle = { ...styles.labelCell, width: labelWidth };
  const customValueStyle = { ...styles.valueCell, width: valueWidth };

  return (
    <View style={styles.table}>
      {showHeader && (
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[customLabelStyle, styles.headerCell]}>{headerOne}</Text>
          <Text style={[customValueStyle, styles.headerCell]}>{headerTwo}</Text>
        </View>
      )}
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;
        const displayValue = Array.isArray(row.value) 
          ? row.value.join(", ") 
          : row.value;
        
        const rowStyle = isLast ? [styles.row, styles.lastRow] : styles.row;
        
        return (
          <View 
            key={index} 
            style={rowStyle}
          >
            <Text style={customLabelStyle}>{row.label}</Text>
            <Text style={customValueStyle}>{displayValue}</Text>
          </View>
        );
      })}
    </View>
  );
}