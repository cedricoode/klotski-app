import React, { PureComponent } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { gamePositions, PieceType, Game, GamePosition } from "./klotski";

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

const SOLVER_MAX_FRAME_TIME = 100;
const PRIMAY_BUTTON_TEXT_MAP = {
  solving: "Solving...",
  playing: "Pause",
  paused: "Continue",
  finished: "Reinitialize",
  undefined: "Solve",
  solved: "Play"
};
export default class Board extends PureComponent {
  static width = 200;
  static height = 250;

  constructor(props) {
    super(props);
    const initialPieces = gamePositions[props.defaultLayout];
    const gamePosition = new GamePosition(this.props.width, this.props.height);
    gamePosition.initPosition(initialPieces, 1);
    const game = new Game(gamePosition);

    this.state = {
      playbackSpeed: 400,
      initialPieces,
      gamePosition,
      iteration: 0,
      game,
      step: 0,
      solving: false
    };
  }

  componentDidMount() {}

  handleAfterChange = value => {
    this.setState({ playbackSpeed: value });
    setImmediate(() => {
      if (this.state.autoPlayState === "paused") {
        this.playGame();
      }
    });
  };

  handlePlay = () => {
    const { game, autoPlayState } = this.state;

    if (autoPlayState === undefined && !game.isCalculated()) {
      this.setState({
        autoPlayState: "solving"
      });
      game.findSolution();
      this.setState({
        autoPlayState: "solved",
        iteration: game.index
      });
    }
    if (autoPlayState === "solving") {
      return;
    } else if (autoPlayState === "solved") {
      this.playGame();
    } else if (autoPlayState === "playing") {
      this.pauseGame();
    } else if (autoPlayState === "paused") {
      this.playGame();
    } else if (autoPlayState === "finished") {
      this.setState({
        intervalHandle: undefined,
        autoPlayState: "solved",
        step: 0
      });
    }
  };

  frameSolve = () => {
    //try each move for each piece.
    let count = 0;
    const { game } = this.state;
    while (
      count < SOLVER_MAX_FRAME_TIME &&
      game.index < game.positions.length
    ) {
      const curr = game.positions[game.index];
      if (curr.isResolved()) {
        game.solutionCounts++;
        game.solutions.push(curr.getHash());
        if (game.solutionCounts >= 3) {
          return;
        }
      } else {
        game.bfsSearchSolution(curr);
      }
      this.setState({
        iteration: game.index
      });
      game.index++;
      // count % 10 === 0 && console.log(count);
      count++;
    }
    if (game.index >= game.positions.length) {
      this.setState({
        autoPlayState: "solved"
      });
      return;
    }

    requestAnimationFrame(this.frameSolve);
  };

  playGame = () => {
    let { game, plays, step } = this.state;
    plays = plays || game.getSolution();
    if (!plays) {
      return alert("No solution found!");
    }
    const handle = setInterval(() => {
      if (step < plays.length) {
        this.setState({ step });
        step++;
      } else {
        handle && clearInterval(handle);
        this.setState({ intervalHandle: undefined, autoPlayState: "finished" });
      }
    }, this.state.playbackSpeed);
    this.setState({
      intervalHandle: handle,
      autoPlayState: "playing",
      plays,
      step
    });
  };

  pauseGame = () => {
    console.log("pausing game");
    const { intervalHandle } = this.state;
    if (intervalHandle) {
      clearInterval(intervalHandle);
    }
    if (this.state.autoPlayState === "playing") {
      this.setState({ intervalHandle: undefined, autoPlayState: "paused" });
    }
  };

  getBoardToRender = () => {
    const { autoPlayState, step, plays } = this.state;
    if (autoPlayState === "playing" || autoPlayState === "paused") {
      return plays[step].getPieces();
    } else if (autoPlayState === "finished") {
      return plays[plays.length - 1].getPieces();
    } else {
      return this.state.initialPieces;
    }
  };

  renderBlocks() {
    const gamePieces = this.getBoardToRender();

    const blockWidth = Board.width / this.props.width;
    const blockHeight = Board.height / this.props.height;
    const rslt = gamePieces.map(gamePiece => {
      return (
        <Block
          gamePiece={gamePiece}
          blockHeight={blockHeight}
          blockWidth={blockWidth}
          key={gamePiece.id}
        />
      );
    });
    return rslt;
  }
  render() {
    const { autoPlayState } = this.state;
    return (
      <div>
        <div id="frame">{this.renderBlocks()}</div>
        <div>
          <button
            style={{ width: 160, height: 40, margin: 24, fontSize: 24 }}
            onClick={this.handlePlay}
            disabled={autoPlayState === "solving"}
          >
            {PRIMAY_BUTTON_TEXT_MAP[autoPlayState]}
          </button>
          <div style={{}}>Iterations: {this.state.iteration}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 32
            }}
          >
            <div>Playback speed: </div>
            <SliderWithTooltip
              railStyle={{ backgroundColor: "#c7ccca" }}
              trackStyle={{ backgroundColor: "transparent" }}
              activeDotStyle={{ backgroundColor: "transparent" }}
              onBeforeChange={this.pauseGame}
              onAfterChange={this.handleAfterChange}
              min={0}
              max={600}
              step={10}
              defaultValue={this.state.playbackSpeed}
              marks={{
                100: "100",
                200: "200",
                300: "300 ms",
                400: "400",
                500: "500"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Block extends PureComponent {
  render() {
    const { blockHeight, blockWidth, gamePiece } = this.props;
    let pieceWidth = 1;
    let pieceHeight = 1;
    let left = gamePiece.position.left;
    let top = gamePiece.position.top;
    const className = ["block"];
    if (gamePiece.type === PieceType.H2) {
      pieceWidth = 2;
      className.push("h2");
    } else if (gamePiece.type === PieceType.CUBE) {
      pieceWidth = 2;
      pieceHeight = 2;
      className.push("cube");
    } else if (gamePiece.type === PieceType.V2) {
      pieceHeight = 2;
      className.push("v2");
    } else {
      className.push("blk");
    }
    const style = {
      height: pieceHeight * blockHeight,
      width: pieceWidth * blockWidth,
      left: left * blockWidth,
      top: top * blockHeight
    };
    return <div className={className.join(" ")} style={style} />;
  }
}
