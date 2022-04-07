import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import ProtectRoute from "./components/ProtectRoute/ProtectRoute";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/messenger/login" component={Login} exact />
        <ProtectRoute path="/" component={Home} exact />
        <Route path="/messenger/register" component={Register} exact />
      </Switch>
    </Router>
  );
}

export default App;
