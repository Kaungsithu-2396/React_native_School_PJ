import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
export default function ShowLists({ navigation }) {
    const [hikeList, setHikeList] = useState([]);
    const db = SQLite.openDatabase("m_Hike");
    let temp = [];

    useEffect(() => {
        showHikeLists();
    }, []);
    const showHikeLists = () => {
        db.transaction((txn) => {
            txn.executeSql(
                "select * from m_Hike",
                [],
                (tx, result) => {
                    console.log(result.rows._array, "show");

                    for (item in result.rows._array) {
                        temp.push(result.rows._array[item]);
                    }
                    setHikeList(temp);

                    // Check if hikeList has at least one element before accessing date
                    if (hikeList.length > 0) {
                        console.log(hikeList[0].date, "from list");
                    }
                },
                (tx, error) => {
                    console.log("fail");
                }
            );
        });
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
                    Hike Lists - ({hikeList.length})
                </Text>
            </View>

            <ScrollView>
                {!hikeList.length == 0 ? (
                    hikeList.map((el) => {
                        return (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("modify", { id: el.id })
                                }
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
