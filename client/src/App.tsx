import { Link, Route } from "wouter";
import './App.css'

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";

function App() {
    return (
        <>
            <Route path="/" component={Homepage} />
            <Route path="/login" component={Login} />
        </>
    )
}

export default App
