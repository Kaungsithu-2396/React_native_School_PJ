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
export default function Home({ navigation }) {
    const db = SQLite.openDatabase("m_Hike");
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
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState("date");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pitfall, setPitfall] = useState("");
    const [length, setLength] = useState("");

    useEffect(() => {
        createTable();
    }, []);

    const createTable = () => {
        db.transaction((txn) => {
            txn.executeSql(
                `create table if not exists m_Hike (id integer primary key autoincrement,name text,date text,descritpion text,parking text,location text,pitfall text,difficulty text,length text)`,
                [],
                (tx, result) => {
                    console.log("table create success!");
                },
                (tx, error) => {
                    alert("fail create table");
                }
            );
        });
    };

    const addToDb = () => {
        db.transaction((txn) => {
            txn.executeSql(
                "INSERT INTO m_Hike(name, date, descritpion, parking, location, pitfall, difficulty, length) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    name,
                    date.toISOString(),
                    description,
                    dataCol[selectedId],
                    location,
                    pitfall,
                    selectedEl,
                    length,
                ],
                (tx, result) => {
                    Alert.alert("success", "Data input successs");
                },
                (tx, error) => {
                    alert("Failed", error);
                }
            );
        });
    };

    const addHike = () => {
        if (
            !(name.length === 0 ||
                location.length === 0 ||
                description.length == 0 ||
                selectedId === undefined ||
                selectedEl === "",
            length.length === 0,
            pitfall.length === 0)
        ) {
            Alert.alert(
                `Confirmation`,
                `Are you sure to add this information?\n
                Name:${name}
                Location:${location}\n
                Description:${description}
                Parking Availability:${dataCol[selectedId]}\n
                Difficulty:${selectedEl}\n
                Date:${date.getDate()}.${
                    date.getMonth() + 1
                }.${date.getFullYear()}
                Length:${length},
                Pitfalls:${pitfall}
            `,
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            addToDb();
                            setDate(new Date());
                            setDescription("");
                            setSelectedEl("");
                            setLength("");
                            setLocation("");
                            setName("");
                            setSelectedId("");
                            setPitfall("");
                        },
                    },
                    {
                        text: "No",
                    },
                ]
            );
        } else {
            Alert.alert("Warning", "Make sure all the fields are filled!");
        }
    };
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
                        />
                    </View>
                    <View>
                        <Text style={{ margin: 10 }}>{`${date.getDate()}.${
                            date.getMonth() + 1
                        }.${date.getFullYear()}`}</Text>
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
                            style={styles.submitBtn}
                            onPress={() => addHike()}
                        >
                            <Text
                                style={{ textAlign: "center", color: "white" }}
                            >
                                Submit
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => navigation.navigate("Show")}
                        >
                            <Text
                                style={{ textAlign: "center", color: "white" }}
                            >
                                Lists
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.searchBtn}
                        onPress={() => navigation.navigate("Search")}
                    >
                        <Text style={{ color: "white" }}>Search</Text>
                    </TouchableOpacity>
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
    submitBtn: {
        width: "40%",
        // marginLeft: "25%",
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
