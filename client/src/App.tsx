import { Route } from "wouter";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <>
            <Route path="/" component={Homepage} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
        </>
    )
}

export default App
