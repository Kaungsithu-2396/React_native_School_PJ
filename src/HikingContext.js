import { createContext, useReducer } from "react";
export const HikingContext = createContext();
export const hikingReducer = (state, action) => {
    switch (action.type) {
        case "SET_HIKING":
            return { hike: action.payload };
        case "ADD_HIKING":
            return {
                hike: [action.payload, ...state.hike],
            };
        default:
            return state;
    }
};
export const HikingContextProvider = ({ childern }) => {
    const [state, dispatch] = useReducer(hikingReducer, {
        hike: null,
    });
    return (
        <HikingContext.Provider value={(state, dispatch)}>
            {childern}
        </HikingContext.Provider>
    );
};
