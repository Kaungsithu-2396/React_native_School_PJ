import React, { useState } from "react";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DateTime() {
    const [mydate, setDate] = useState(new Date());
    const [displaymode, setMode] = useState("date");
    const [isDisplayDate, setShow] = useState(false);

    const [text, setText] = useState("");

    const changeSelectedDate = (event, selectedDate) => {
        const currentDate = selectedDate || mydate;
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let stDate =
            tempDate.getDate() +
            "/" +
            (tempDate.getMonth() + 1) +
            "/" +
            tempDate.getFullYear();
        let stTime = tempDate.getHours() + ":" + tempDate.getMinutes();
        setText(stDate + "\n" + stTime);
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>{text}</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginRight: 20 }}>
                        <Button
                            onPress={() => showMode("date")}
                            title="Show date picker!"
                        />
                    </View>
                    <View>
                        <Button
                            onPress={() => showMode("time")}
                            title="Show time picker!"
                        />
                    </View>
                </View>
            </View>
            {isDisplayDate && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={mydate}
                    mode={displaymode}
                    is24Hour={true}
                    display="default"
                    onChange={changeSelectedDate}
                />
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
