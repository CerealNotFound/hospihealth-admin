
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bullet: {
    width: 20,
    fontSize: 12,
    color: "#000000",
    marginTop: 1,
  },
  itemContent: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#000000",
  },
  nestedList: {
    marginLeft: 20,
    marginTop: 4,
  },
  nestedItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  nestedBullet: {
    width: 15,
    fontSize: 11,
    color: "#000000",
    marginTop: 1,
  },
  nestedContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4,
    color: "#000000",
  },
});

interface BulletItem {
  content: string;
  nested?: string[];
}

interface ResumeBulletListProps {
  items: (string | BulletItem)[];
  bulletChar?: string;
  nestedBulletChar?: string;
}

export function ResumeBulletList({ 
  items, 
  bulletChar = "•",
  nestedBulletChar = "◦"
}: ResumeBulletListProps) {
  return (
    <View style={styles.listContainer}>
      {items.map((item, index) => {
        const isNested = typeof item === "object" && "content" in item;
        const content = isNested ? item.content : item;
        const nestedItems = isNested ? item.nested : undefined;

        return (
          <View key={index}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>{bulletChar}</Text>
              <Text style={styles.itemContent}>{content}</Text>
            </View>
            {nestedItems && nestedItems.length > 0 && (
              <View style={styles.nestedList}>
                {nestedItems.map((nestedItem, nestedIndex) => (
                  <View key={nestedIndex} style={styles.nestedItem}>
                    <Text style={styles.nestedBullet}>{nestedBulletChar}</Text>
                    <Text style={styles.nestedContent}>{nestedItem}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}