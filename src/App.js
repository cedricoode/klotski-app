import React, { Component } from "react";
import Board from "./Board";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board width={4} height={5} />
      </div>
    );
  }
}

export default App;
