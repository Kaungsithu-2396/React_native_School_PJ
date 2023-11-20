import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import ShowLists from "./screens/ShowLists";
import { HikingContextProvider } from "./src/HikingContext";
import ModifyHike from "./screens/ModifyHike";
export default function App() {
    const Stack = createNativeStackNavigator();
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Show" component={ShowLists} />
                    <Stack.Screen name="modify" component={ModifyHike} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
