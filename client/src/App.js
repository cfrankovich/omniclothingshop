import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Collection from './components/Collection';
import Lookbook from './components/Lookbook';
import About from './components/About';
import Appointment from './components/Appointment';
import Signup from './components/Signup';
import Test from './components/Test';
import OrbPage from './components/OrbPage';

function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen font-sans bg-image">
        <Navbar />
        <main className="container mx-auto p-4 max-w-screen-xl">
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/collection" component={Collection} />
            <Route path="/lookbook" component={Lookbook} />
            <Route path="/book-appointment" component={Appointment} />
            <Route path="/signup" component={Signup} />
            <Route path="/test" component={Test} />
            <Route path="/orb" component={OrbPage} />
            <Route exact path="/" component={Home} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
