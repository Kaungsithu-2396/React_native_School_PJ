import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import * as SQLite from "expo-sqlite";
export default function SearchLists({ navigation }) {
    const [searchKey, setSearchKey] = useState("");
    const [result, setResult] = useState([]);
    const db = SQLite.openDatabase("m_Hike");
    const searchHikeLists = () => {
        db.transaction((txn) => {
            txn.executeSql(
                "select * from m_Hike where date LIKE ? OR descritpion LIKE ? OR difficulty LIKE ? OR length LIKE ? OR location LIKE ? OR name LIKE ? OR parking LIKE ? OR pitfall LIKE ?",
                [
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                    `%${searchKey}%`,
                ],
                (tx, result) => {
                    let tempArr = [];
                    for (item in result.rows._array) {
                        tempArr.push(result.rows._array[item]);
                    }
                    setResult(tempArr);
                },
                (tx, error) => {
                    console.log(error);
                }
            );
        });
    };
    const searchLists = () => {
        searchHikeLists();
    };
    return (
        <>
            <View>
                <Text style={styles.heading}>Search Form</Text>
            </View>
            <View style={styles.searchBarCol}>
                <TextInput
                    placeholder="Search"
                    style={styles.inputBox}
                    autoFocus={true}
                    value={searchKey}
                    onChangeText={setSearchKey}
                />
                {/* <View style={}> */}
                <TouchableOpacity style={styles.btn} onPress={searchLists}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        Search
                    </Text>
                </TouchableOpacity>
                {/* </View> */}
            </View>
            <ScrollView>
                {!result.length == 0 ? (
                    result.map((el) => {
                        return (
                            <TouchableOpacity
                                key={el.id}
                                style={styles.listCol}
                            >
                                <View style={{ paddingBottom: 10 }}>
                                    <Text>
                                        name :{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.name}
                                        </Text>
                                    </Text>
                                    <Text>
                                        Location:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.location}
                                        </Text>
                                    </Text>
                                    <Text>
                                        Date :
                                        <Text style={{ fontWeight: "bold" }}>
                                            {/* {new Date(el.date).getFullYear()},{" "}
                                            {new Date(el.date).getMonth()} ,
                                            {new Date(el.date).getDate()} */}
                                            {/* {el.date.slice(0, 16)} */}
                                            {new Date(el.date).getDate()}.
                                            {new Date(el.date).getMonth() + 1}.
                                            {new Date(el.date).getFullYear()}
                                        </Text>
                                    </Text>
                                    <Text>
                                        description:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.descritpion}
                                        </Text>
                                    </Text>
                                </View>
                                <View style={{ paddingBottom: 10 }}>
                                    <Text>
                                        parking:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.parking}
                                        </Text>
                                    </Text>
                                    <Text>
                                        pitfall:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.pitfall}
                                        </Text>
                                    </Text>
                                    <Text>
                                        Difficulty:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.difficulty}
                                        </Text>
                                    </Text>
                                    <Text style={{ paddingVertical: 4 }}>
                                        Length:{" "}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {el.length}
                                        </Text>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text
                        style={{
                            borderWidth: 4,
                            margin: 10,
                            padding: 12,
                            color: "red",
                            fontSize: 20,
                            textAlign: "center",
                            fontWeight: "bold",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        No data
                    </Text>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    searchBarCol: {
        marginVertical: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    btnView: {
        width: "30%",
        marginLeft: "30%",
        //  marginTop: 10,
    },
    btn: {
        textAlign: "center",
        backgroundColor: "green",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    heading: {
        textAlign: "center",
        padding: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    inputBox: {
        width: "60%",
    },
    line: {
        backgroundColor: "black",
        borderBlockColor: "white",
    },
    container: {
        textAlign: "center",
    },
    listCol: {
        margin: 10,
        flexDirection: "row",
        gap: 30,
        backgroundColor: "beige",
        padding: 20,
        borderRadius: 10,
    },
});
