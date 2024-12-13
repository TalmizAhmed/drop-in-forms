/*
Copyright 2024 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from "react";
import ErrorBoundary from "react-error-boundary";
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import ExtensionRegistration from "./ExtensionRegistration";
import Modal from "./Modal";

function App() {
    return (
        <Router>
            <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
                <Routes>
                    <Route index element={<ExtensionRegistration/>}/>
                    <Route
                        exact path="index.html"
                        element={<ExtensionRegistration/>}
                    />
                    <Route
                        exact path="modal/drop"
                        element={<Modal />}
                    />
                </Routes>
            </ErrorBoundary>
        </Router>
    )


    function onError(e, componentStack) {
        console.error(e, componentStack)
    }

    // component to show if UI fails rendering
    function fallbackComponent({componentStack, error}) {
        return (
            <React.Fragment>
                <h1 style={{textAlign: "center", marginTop: "20px"}}>
                    Phly, phly... Something went wrong :(
                </h1>
                <pre>{componentStack + "\n" + error.message}</pre>
            </React.Fragment>
        )
    }
}

export default App
