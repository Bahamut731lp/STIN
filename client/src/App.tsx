import { Route } from "wouter";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <>
            <Route path="/" component={Homepage} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
        </>
    )
}

export default App
