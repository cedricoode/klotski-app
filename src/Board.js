import React, { PureComponent } from "react";
import { gamePositions, PieceType, Game, GamePosition } from "./klotski";

export default class Board extends PureComponent {
  static width = 200;
  static height = 250;

  constructor(props) {
    super(props);

    this.state = {
      initialPieces: gamePositions[1]
    };
  }

  componentDidMount() {
    const gamePosition = new GamePosition(this.props.width, this.props.height);
    gamePosition.initPosition(this.state.initialPieces, 1);
    const game = new Game(gamePosition);
    game.findSolution();
    if (game.solutions.length > 0) {
      console.log("solutions found!");
    }
    this.setState({ gamePosition, game });
  }

  handlePlay = () => {
    const { intervalHandle, autoPlayState } = this.state;

    if (autoPlayState === undefined) {
      this.playGame();
    } else if (autoPlayState === "playing") {
      clearInterval(intervalHandle);
      this.setState({
        intervalHandle: undefined,
        autoPlayState: "paused"
      });
    } else if (autoPlayState === "paused") {
      this.playGame();
    } else if (autoPlayState === "finished") {
      this.setState({
        intervalHandle: undefined,
        autoPlayState: undefined,
        step: undefined
      });
    }
  };

  playGame() {
    let { game, plays, step } = this.state;
    plays = plays || (game.hasSolution() && game.getSolution());
    if (!plays) {
      alert("No solution found!");
    }
    step = step === undefined ? 0 : step;
    const handle = setInterval(() => {
      if (step < plays.length) {
        this.setState({ step });
        step++;
      } else {
        handle && clearInterval(handle);
        this.setState({ intervalHandle: undefined, autoPlayState: "finished" });
      }
    }, 100);
    this.setState({
      intervalHandle: handle,
      autoPlayState: "playing",
      plays,
      step
    });
  }

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
      const style = {};
      const className = ["block"];
      if (gamePiece.type === PieceType.V2) {
        style.width = blockWidth;
        style.height = blockHeight * 2;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("v2");
      } else if (gamePiece.type === PieceType.H2) {
        style.width = blockWidth * 2;
        style.height = blockHeight;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("h2");
      } else if (gamePiece.type === PieceType.CUBE) {
        style.width = blockWidth * 2;
        style.height = blockHeight * 2;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("cube");
      } else if (gamePiece.type === PieceType.BLOCK) {
        style.width = blockWidth;
        style.height = blockHeight;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("blk");
      }
      return (
        <Block
          className={className.join(" ")}
          style={style}
          key={gamePiece.id}
        />
      );
    });
    return rslt;
  }
  render() {
    const blocks = this.renderBlocks();
    const buttonTextMap = {
      playing: "Pause",
      paused: "Continue",
      finished: "Reinitialize",
      undefined: "Play"
    };
    return (
      <div>
        <div id="frame">{blocks}</div>
        <div>
          <button
            style={{ width: 160, height: 40, margin: 24, fontSize: 24 }}
            onClick={this.handlePlay}
          >
            {buttonTextMap[this.state.autoPlayState]}
          </button>
        </div>
      </div>
    );
  }
}

class Block extends PureComponent {
  render() {
    return <div className={this.props.className} style={this.props.style} />;
  }
}
