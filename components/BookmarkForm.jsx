// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import * as SQLite from "expo-sqlite";

// const db = SQLite.openDatabase("bookmarks.db");

// const BookmarkForm = () => {
//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [bookmarks, setBookmarks] = useState({});
//   const [newFolderName, setNewFolderName] = useState("");

//   useEffect(() => {
//     createTables();
//     loadFolders();
//     loadBookmarks();
//   }, []);

//   const createTables = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS folders (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE)`,
//         [],
//         () => console.log("Folders table created successfully"),
//         (_, error) => console.error("Failed to create folders table", error)
//       );

//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, folder TEXT)`,
//         [],
//         () => console.log("Bookmarks table created successfully"),
//         (_, error) => console.error("Failed to create bookmarks table", error)
//       );
//     });
//   };

//   const loadFolders = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `SELECT * FROM folders`,
//         [],
//         (_, { rows }) => {
//           const folderNames = Array.from({ length: rows.length }, (_, index) => {
//             return rows.item(index).name;
//           });
//           setFolders(folderNames);
//         },
//         (_, error) => console.error("Failed to load folders", error)
//       );
//     });
//   };

//   const loadBookmarks = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `SELECT * FROM bookmarks`,
//         [],
//         (_, { rows }) => {
//           const allBookmarks = {};
//           for (let i = 0; i < rows.length; i++) {
//             const bookmark = rows.item(i);
//             if (!allBookmarks[bookmark.folder]) {
//               allBookmarks[bookmark.folder] = [];
//             }
//             allBookmarks[bookmark.folder].push({ title: bookmark.title, url: bookmark.url });
//           }
//           setBookmarks(allBookmarks);
//         },
//         (_, error) => console.error("Failed to load bookmarks", error)
//       );
//     });
//   };

//   const handleSave = () => {
//     if (title && url && selectedFolder) {
//       db.transaction((tx) => {
//         tx.executeSql(
//           `INSERT INTO bookmarks (title, url, folder) VALUES (?, ?, ?)`,
//           [title, url, selectedFolder],
//           () => {
//             loadBookmarks(); // Reload bookmarks after saving
//             setTitle("");
//             setUrl("");
//           },
//           (_, error) => console.error("Failed to save bookmark", error)
//         );
//       });
//     }
//   };

//   const handleCreateFolder = () => {
//     if (newFolderName && !folders.includes(newFolderName)) {
//       db.transaction((tx) => {
//         tx.executeSql(
//           `INSERT INTO folders (name) VALUES (?)`,
//           [newFolderName],
//           () => {
//             loadFolders();
//             setNewFolderName("");
//           },
//           (_, error) => console.error("Failed to create folder", error)
//         );
//       });
//     }
//   };

//   const handleFolderSelection = (folderName) => {
//     setSelectedFolder(folderName);
//   };

//   const renderFolderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleFolderSelection(item)} style={styles.folderItem}>
//       <Text style={styles.folderText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderBookmarkItem = ({ item }) => (
//     <Text style={styles.bookmarkText}>
//       {item.title} - {item.url}
//     </Text>
//   );

//   return (
//     <FlatList
//       ListHeaderComponent={
//         <View style={styles.section}>
//           <Text style={styles.label}>New Folder</Text>
//           <TextInput value={newFolderName} onChangeText={(text) => setNewFolderName(text)} placeholder="Enter folder name" style={styles.input} />
//           <TouchableOpacity style={styles.button} onPress={handleCreateFolder}>
//             <Text style={styles.buttonText}>Create Folder</Text>
//           </TouchableOpacity>

//           <Text style={styles.label}>Select Folder:</Text>
//         </View>
//       }
//       data={folders}
//       keyExtractor={(item) => item}
//       renderItem={renderFolderItem}
//       ListFooterComponent={
//         selectedFolder ? (
//           <View style={styles.section}>
//             <Text style={styles.label}>Bookmark Title</Text>
//             <TextInput value={title} onChangeText={(text) => setTitle(text)} placeholder="Enter bookmark title" style={styles.input} />

//             <Text style={styles.label}>Bookmark URL</Text>
//             <TextInput value={url} onChangeText={(text) => setUrl(text)} placeholder="Enter bookmark URL" style={styles.input} />

//             <TouchableOpacity style={styles.button} onPress={handleSave}>
//               <Text style={styles.buttonText}>Save Bookmark</Text>
//             </TouchableOpacity>

//             <Text style={styles.sectionHeader}>Saved Bookmarks in {selectedFolder}:</Text>
//             <FlatList data={bookmarks[selectedFolder] || []} keyExtractor={(item, index) => index.toString()} renderItem={renderBookmarkItem} />
//           </View>
//         ) : null
//       }
//       contentContainerStyle={styles.container}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f8f8f8",
//   },
//   section: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     backgroundColor: "#fff",
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#4CAF50",
//     padding: 12,
//     marginTop: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   folderItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   folderText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   bookmarkText: {
//     padding: 10,
//     fontSize: 16,
//     color: "#555",
//   },
// });

// export default BookmarkForm;
