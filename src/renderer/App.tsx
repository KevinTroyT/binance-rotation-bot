import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import layout from './components/layout/layout';
// import { ipcRenderer } from 'electron';

export default function App() {
  
  return (
    <Router>
      <Switch>
        <Route path="/" component={layout} />
      </Switch>
    </Router>
  );
}
