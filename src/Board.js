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
const DEFAULT_PLAYBACK_SPEED = 400;
export default class Board extends PureComponent {
  static width = 200;
  static height = 250;

  constructor(props) {
    super(props);
    const gameState = this.initializeGame();
    this.state = {
      playbackSpeed: DEFAULT_PLAYBACK_SPEED,
      ...gameState
    };
  }

  initializeGame() {
    const initialPieces = gamePositions[this.props.defaultLayout];
    const gamePosition = new GamePosition(this.props.width, this.props.height);
    gamePosition.initPosition(initialPieces, 1);
    const game = new Game(gamePosition);
    return {
      game,
      initialPieces,
      iteration: 0,
      step: 0,
      solving: false,
      autoPlayState: undefined
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height ||
      this.props.defaultLayout !== prevProps.defaultLayout
    ) {
      const gameState = this.initializeGame();
      this.setState({
        ...gameState
      });
    }
  }

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
      setTimeout(() => {
        game.findSolution();
        this.setState({
          autoPlayState: "solved",
          iteration: game.index
        });
      }, 200);
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

  handleNext = () => {
    const { autoPlayState, step, game } = this.state;
    const plays = game.getSolution();
    if (plays && (autoPlayState === "paused" || autoPlayState === "solved")) {
      if (step < plays.length - 1) {
        this.setState({
          step: step + 1
        });
      } else {
        this.setState({
          autoPlayState: "finished"
        });
      }
    }
  };

  handlePrevious = () => {
    const { autoPlayState, step } = this.state;
    if (autoPlayState === "finished") {
      this.setState({
        step: step - 1,
        autoPlayState: "paused"
      });
    } else if (autoPlayState === "paused") {
      if (step > 0) {
        this.setState({
          step: step - 1
        });
      } else {
        this.setState({
          autoPlayState: "solved"
        });
      }
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
    let { game, step } = this.state;
    let plays = game.getSolution();
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
      step
    });
  };

  pauseGame = () => {
    const { intervalHandle } = this.state;
    if (intervalHandle) {
      clearInterval(intervalHandle);
    }
    if (this.state.autoPlayState === "playing") {
      this.setState({ intervalHandle: undefined, autoPlayState: "paused" });
    }
  };

  getBoardToRender = () => {
    const { autoPlayState, step, game } = this.state;
    let plays = game.getSolution();
    if (autoPlayState === "playing" || autoPlayState === "paused") {
      return plays[step].getPieces();
    } else if (autoPlayState === "finished") {
      return plays[plays.length - 1].getPieces();
    } else {
      return this.state.initialPieces;
    }
  };

  render() {
    const { autoPlayState } = this.state;
    return (
      <div>
        <GameBoard
          width={this.props.width}
          height={this.props.height}
          pieces={this.getBoardToRender()}
        />
        <div>
          <div style={{ margin: 16 }}>
            <span style={{ margin: 16 }}>
              Iterations: {this.state.iteration}
            </span>
            <span>{this.state.step ? `Steps: ${this.state.step}` : null}</span>
          </div>

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
                300: "300ms",
                400: "400",
                500: "500"
              }}
            />
          </div>
          <div>
            <button className="control previous" onClick={this.handlePrevious}>
              &#10094;
            </button>
            <button
              className="control play round"
              id="solveBtn"
              onClick={this.handlePlay}
              disabled={autoPlayState === "solving"}
            >
              {PRIMAY_BUTTON_TEXT_MAP[autoPlayState]}
            </button>
            <button className="control next" onClick={this.handleNext}>
              &#10095;
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export class GameBoard extends PureComponent {
  renderBlocks() {
    const gamePieces = this.props.pieces;
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
    return <div id="frame">{this.renderBlocks()}</div>;
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
