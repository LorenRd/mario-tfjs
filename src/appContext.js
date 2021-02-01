import React from "react";

const appContext = React.createContext();

const ContextProvider = appContext.Provider;
const ContextConsumer = appContext.Consumer;

export { ContextProvider, ContextConsumer };
