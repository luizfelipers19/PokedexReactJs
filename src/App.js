import React from 'react';

import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/layout/NavBar';
import PokemonList from './components/pokemon/PokemonList'
import Dashboard from './components/layout/Dashboard';

import Pokemon from './components/pokemon/Pokemon';

import './App.css';

import backgroundImage from './pattern.png'

function App() {
  return (

    <Router>
      <div className="App" style={{background: `url(${backgroundImage})`}}>
      <h1 className='text-center font-weight-bold ' style={{color:'yellow'}}>Bigodex</h1>
      <Navbar></Navbar>
      
      <div className='container'>

        <Switch>
          <Route exact path = "/" component = {Dashboard}></Route>
          <Route exact path = "/pokemon/:pokemonIndex" component={Pokemon}></Route>
          
        </Switch>

        
        
      </div>


    </div>
    </Router>

    
  );
}

export default App;
