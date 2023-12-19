import React from "react";
import About from "./components/About";
import Home from "./components/Home";
import Collection from "./components/Collection";
import Lookbook from "./components/Lookbook";
import Navbar from "./components/Navbar";
import Appointment from "./components/Appointment";
import Signup from "./components/Signup";
import Test from "./components/Test";
import Account from "./components/Account";
import { Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { createBrowserHistory } from "history";
import GarmentPage from "./components/GarmentPage";
import Checkout from "./components/Checkout";

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Navbar />
      <Route exact path="/login" component={Login} />
      <Route exact path="/account">
        <Account />
      </Route>
      <Route exact path="/about">
        <About />
      </Route>
      <Route exact path="/collection">
        <Collection />
      </Route>
      <Route path="/collection/:garmentId">
        <GarmentPage />
      </Route>
      <Route exact path="/lookbook">
        <Lookbook />
      </Route>
      <Route exact path="/book-appointment">
        <Appointment />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/logout">
        <Logout />
      </Route>
      <Route exact path="/test">
        <Test />
      </Route>
      <Route exact path="/checkout">
        <Checkout />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
    </Router>
  );
}

export default App;
