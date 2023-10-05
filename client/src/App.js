import React from "react";
import About from "./components/About";
import Home from "./components/Home";
import Collection from "./components/Collection";
import Lookbook from "./components/Lookbook";
import Navbar from "./components/Navbar";
import Appointment from "./components/Appointment";
import Signup from "./components/Signup";
import Test from "./components/Test";
import GarmentPage from "./components/GarmentPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/collection/:garmentId">
          <GarmentPage />
        </Route>
        <Route path="/collection">
          <Collection />
        </Route>
        <Route path="/lookbook">
          <Lookbook />
        </Route>
        <Route path="/book-appointment">
          <Appointment />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/test">
          <Test />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
