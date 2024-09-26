import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Linking, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const folderIcon = require("./assets/folder-icon.webp");

const App = () => {
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const foldersData = await AsyncStorage.getItem("folders");
      if (foldersData) {
        setFolders(JSON.parse(foldersData));
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const createFolder = async () => {
    if (folderName) {
      const newFolders = [...folders, folderName];
      setFolders(newFolders);
      await AsyncStorage.setItem("folders", JSON.stringify(newFolders));
      setFolderName("");
    }
  };

  const saveBookmark = async () => {
    if (selectedFolder && bookmarkUrl) {
      const folderPath = `${FileSystem.documentDirectory}${selectedFolder}/`;
      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      const filePath = `${folderPath}bookmarks.txt`;

      const newBookmark = `${bookmarkUrl}\n`;
      try {
        const fileExists = await FileSystem.getInfoAsync(filePath);
        if (fileExists.exists) {
          const bookmarksData = await FileSystem.readAsStringAsync(filePath);
          await FileSystem.writeAsStringAsync(filePath, bookmarksData + newBookmark);
        } else {
          await FileSystem.writeAsStringAsync(filePath, newBookmark);
        }
        loadBookmarks(selectedFolder);
        setBookmarkUrl("");
      } catch (error) {
        console.error("Error saving bookmark:", error);
      }
    }
  };

  const loadBookmarks = async (folder) => {
    const folderPath = `${FileSystem.documentDirectory}${folder}/`;
    const filePath = `${folderPath}bookmarks.txt`;

    try {
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (fileExists.exists) {
        const bookmarksData = await FileSystem.readAsStringAsync(filePath);
        const bookmarkList = bookmarksData.split("\n").filter((url) => url);
        setBookmarks(bookmarkList);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setBookmarks([]);
    }
  };

  const deleteBookmark = async (bookmark) => {
    const folderPath = `${FileSystem.documentDirectory}${selectedFolder}/`;
    const filePath = `${folderPath}bookmarks.txt`;

    try {
      const updatedBookmarks = bookmarks.filter((url) => url !== bookmark).join("\n");
      await FileSystem.writeAsStringAsync(filePath, updatedBookmarks);
      loadBookmarks(selectedFolder);
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const openBookmark = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
  };

  const onFolderSelect = (folder) => {
    setSelectedFolder(folder);
    loadBookmarks(folder); // Load bookmarks when folder is selected
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmark App</Text>
      {!selectedFolder ? (
        <View style={styles.folderContainer}>
          <TextInput style={styles.input} placeholder="Create Folder" value={folderName} onChangeText={setFolderName} />
          <Button title="Create Folder" onPress={createFolder} />

          <FlatList
            data={folders}
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onFolderSelect(item)} style={styles.folderItem}>
                <Image source={folderIcon} style={styles.folderIcon} />
                <Text style={styles.folderText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.bookmarkContainer}>
          {/* Back Arrow Button */}
          <TouchableOpacity onPress={() => setSelectedFolder(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder="Add Bookmark URL" value={bookmarkUrl} onChangeText={setBookmarkUrl} />
          <Button title="Save Bookmark" onPress={saveBookmark} />

          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.bookmarkItem}>
                <TouchableOpacity onPress={() => openBookmark(item)}>
                  <Text style={styles.bookmarkText}>{item}</Text>
                </TouchableOpacity>
                <Button title="Delete" onPress={() => deleteBookmark(item)} />
              </View>
            )}
          />
        </View>
      )}
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#333",
  },
  folderContainer: {
    flex: 1,
    alignItems: "center",
  },
  folderItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    width: "30%", // Make folder items responsive
  },
  folderIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  folderText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  bookmarkContainer: {
    flex: 1,
  },
  bookmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  bookmarkText: {
    fontSize: 16,
  },
  input: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    width: "100%", // Full-width input
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007BFF",
  },
});

export default App;
