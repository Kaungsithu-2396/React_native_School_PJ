import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { StyleSheet } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";
import { TextInput } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
export default function ModifyHike({ navigation }) {
    const db = SQLite.openDatabase("m_Hike");
    const route = useRoute();
    const { id } = route.params;
    const dropDownData = [
        { key: "1", value: "Easy" },
        { key: "2", value: "Medium" },
        { key: "3", value: "Hard" },
    ];
    const radioBtns = useMemo(
        () => [
            {
                id: "0",
                label: "Yes",
                value: "Yes",
            },
            {
                id: "1",
                label: "No",
                value: "No",
            },
        ],
        []
    );
    const dataCol = ["Yes", "No"];
    const [selectedId, setSelectedId] = useState();
    const [selectedEl, setSelectedEl] = useState("");
    const [selectOption, setSelectOption] = useState({});
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState("date");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pitfall, setPitfall] = useState("");
    const [length, setLength] = useState("");

    const retrieveData = () => {
        console.log(selectedEl);

        db.transaction((txn) => {
            txn.executeSql(
                `select * from m_Hike where id=?`,
                [id],
                (tx, result) => {
                    console.log(result.rows._array[0]);
                    const {
                        date,
                        descritpion,
                        difficulty,
                        length,
                        location,
                        name,
                        parking,
                        pitfall,
                    } = result.rows._array[0];
                    setName(name);
                    setDescription(descritpion);
                    setLocation(location);
                    setLength(length);
                    setPitfall(pitfall);
                    switch (difficulty) {
                        case "Easy": {
                            setSelectOption(dropDownData[0]);
                            break;
                        }
                        case "Medium": {
                            setSelectOption(dropDownData[1]);
                            break;
                        }
                        case "Hard": {
                            setSelectOption(dropDownData[2]);
                            break;
                        }
                    }
                    setSelectedId(dataCol.indexOf(parking));
                    setDate(new Date(date));
                    setSelectedEl(selectedEl);
                    switch (parking) {
                        case "Yes": {
                            setSelectedId(0);
                            break;
                        }
                        case "No": {
                            setSelectedId(1);
                            break;
                        }
                    }
                },
                (tx, error) => {
                    alert("fail data retrieval");
                }
            );
        });
    };
    const deleteHike = () => {
        Alert.alert("Confirmation", "Are you sure to delete this record?", [
            {
                text: "Yes",
                onPress: () => {
                    db.transaction((txn) => {
                        txn.executeSql(
                            "delete from m_Hike where id=?",
                            [id],
                            (tsc, result) => {
                                Alert.alert("success", "delete success");
                            },
                            (tsc, error) => {
                                Alert.alert("Fail", "delete fail");
                            }
                        );
                    });
                    navigation.navigate("Home");
                },
            },
            {
                text: "No",
            },
        ]);
    };
    const updateHike = () => {
        Alert.alert(
            "Confirmation",
            `Are you sure to update this record?\n
           Name: ${name}
           Location: ${location}
           Description: ${description}
           Parking: ${dataCol[selectedId]}
           Difficulty: ${selectedEl}
           Date: ${date}
           Length: ${length}
           Pitfall: ${pitfall}
         `,
            [
                {
                    text: "Yes",
                    onPress: () => {
                        db.transaction((txn) => {
                            txn.executeSql(
                                "UPDATE m_Hike SET date=?, descritpion=?, difficulty=?, length=?, location=?, name=?, parking=?, pitfall=? WHERE id=?",
                                [
                                    date.toISOString(),
                                    description,
                                    selectedEl,
                                    length,
                                    location,
                                    name,
                                    dataCol[selectedId],
                                    pitfall,
                                    id,
                                ],
                                (tx, result) => {
                                    if (result.rowsAffected > 0) {
                                        Alert.alert(
                                            "Success",
                                            "Update success"
                                        );
                                        console.log("Update success");
                                        navigation.navigate("Home");
                                        // Navigate or perform any other action after successful update
                                    } else {
                                        Alert.alert(
                                            "Fail",
                                            "No record found for update"
                                        );
                                    }
                                },
                                (tx, error) => {
                                    console.error(error);
                                    Alert.alert("Error", "Update failed");
                                }
                            );
                        });
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

    useEffect(() => {
        retrieveData();
    }, []);

    const dateHandler = (e, selectedDate) => {
        setDate(selectedDate);
        setShow(false);
    };
    const showMode = (showMode) => {
        setShow(true);
        setMode(showMode);
    };

    return (
        <>
            <KeyboardAvoidingView
                keyboardVerticalOffset={100}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView>
                    <TextInput
                        placeholder="Name"
                        style={styles.inputbox}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        placeholder="location"
                        style={styles.inputbox}
                        value={location}
                        onChangeText={setLocation}
                    />
                    <View>
                        <TextInput
                            placeholder="Description"
                            style={styles.inputbox}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.text}>Parking Available?</Text>
                        <RadioGroup
                            radioButtons={radioBtns}
                            onPress={setSelectedId}
                            selectedId={selectedId}
                            layout="row"
                        />
                    </View>
                    <View style={styles.list}>
                        <SelectList
                            setSelected={(val) => setSelectedEl(val)}
                            data={dropDownData}
                            save="value"
                            search={false}
                            defaultOption={selectOption}
                        />
                    </View>
                    <View>
                        <Text style={{ margin: 10 }}>{`${new Date(
                            date
                        ).getDate()}.${
                            new Date(date).getMonth() + 1
                        }.${new Date(date).getFullYear()}`}</Text>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => showMode("date")}
                        >
                            <Text
                                style={{ color: "white", textAlign: "center" }}
                            >
                                Select Date
                            </Text>
                        </TouchableOpacity>
                        {show && (
                            <DateTimePicker
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={dateHandler}
                                display="spinner"
                            />
                        )}
                    </View>
                    <TextInput
                        placeholder="length"
                        style={styles.inputbox}
                        value={length}
                        onChangeText={setLength}
                    />
                    <TextInput
                        placeholder="pitfalls"
                        style={styles.inputbox}
                        value={pitfall}
                        onChangeText={setPitfall}
                    />
                    <View style={styles.btnCol}>
                        <TouchableOpacity
                            style={styles.submitBtn_A}
                            onPress={() => updateHike()}
                        >
                            <Text
                                style={{ textAlign: "center", color: "white" }}
                            >
                                Update
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.del_B}
                            onPress={() => deleteHike()}
                        >
                            <Text
                                style={{ textAlign: "center", color: "white" }}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                 
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
const styles = StyleSheet.create({
    searchBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        padding: 10,
    },
    btnCol: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    del_B: {
        width: "40%",
        backgroundColor: "red",
        padding: 3,
        marginTop: 10,
        borderRadius: 20,
        paddingVertical: 20,
        marginBottom: 20,
    },
    submitBtn_A: {
        width: "40%",
        backgroundColor: "green",
        padding: 3,
        marginTop: 10,
        borderRadius: 20,
        paddingVertical: 20,
        marginBottom: 20,
    },
    btn: {
        padding: 10,
        borderBlockColor: "black",
        margin: 10,
        backgroundColor: "green",
        width: "50%",
        borderRadius: 10,
    },
    container: {
        margin: 10,
    },
    text: {
        fontSize: 20,
    },
    list: {
        width: "80%",
        color: "#000000",
        fontSize: 22,
        margin: 10,
    },
    inputbox: {
        width: "100%",
        marginLeft: 10,
        marginTop: 7,
        margin: 5,
        borderRadius: 4,
        backgroundColor: "white",
    },
});
