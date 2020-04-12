import React from 'react';
import './App.css';
import Callback from './Callback';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './global_styles.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/callback">
          <Callback/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
