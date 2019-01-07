import React, { Component } from "react";
import Board from "./Board";
import "./App.css";

class App extends Component {
  state = {
    width: 4,
    height: 5
  };
  handleSubmit(e) {
    e.preventDefault();
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    return (
      <div className="App">
        <Board
          width={this.state.width}
          height={this.state.height}
          defaultLayout={0}
        />
        <form onSubmit={this.handleSubmit}>
          <label>
            Width:
            <input
              type="number"
              name="width"
              value={this.state.width}
              onChange={this.handleChange}
            />
          </label>

          <label>
            Height:
            <input
              type="number"
              name="height"
              value={this.state.height}
              onChange={this.handleChange}
            />
          </label>
          <div style={{ margin: 16 }}>
            <input style={{ height: 64 }} type="submit" value="Change" />
          </div>
        </form>
      </div>
    );
  }
}

export default App;
