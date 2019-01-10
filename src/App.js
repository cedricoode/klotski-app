import React, { Component } from "react";
import Board, { GameBoard } from "./Board";
import "./App.css";
import { gamePositions } from "./klotski";

class App extends Component {
  state = {
    width: 4,
    height: 5,
    defaultLayout: 0
  };
  handleSubmit(e) {
    e.preventDefault();
  }
  handleRadioButtonChange = e => {
    console.log(e.target);
    this.setState({ defaultLayout: Number(e.target.id) });
  };
  handleChange = e => {
    const value = Number(e.target.value);
    if (
      (e.target.name === "width" && value >= 4) ||
      (e.target.name === "height" && value >= 5)
    )
      this.setState({
        [e.target.name]: value
      });
  };
  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <div>
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
          </div>
          <h3>Choose your layout</h3>
          <div>
            {gamePositions.map((g, i) => {
              return (
                <div style={{ display: "inline-block", margin: 16 }} key={i}>
                  <GameBoard
                    width={this.state.width}
                    height={this.state.height}
                    pieces={g}
                  />
                  <div>
                    <input
                      type="radio"
                      name="layout"
                      id={i}
                      checked={i === this.state.defaultLayout}
                      onChange={this.handleRadioButtonChange}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </form>
        <hr
          style={{
            backgroundColor: "#fff",
            borderTop: "2px dashed #8c8b8b",
            margin: 16
          }}
        />
        <div style={{ margin: 32 }}>
          <Board
            width={this.state.width}
            height={this.state.height}
            defaultLayout={this.state.defaultLayout}
          />
        </div>
      </div>
    );
  }
}

export default App;
