import React from 'react';
import './App.css';
import {Stage} from "@inlet/react-pixi";
import {Jet} from "./Jet";

function App() {
  return (<Stage>
    <Jet/>
  </Stage>)
}

export default App;
