import React, { PureComponent } from "react";
import { gamePositions, PieceType } from "./klotski";

export default class Board extends PureComponent {
  static width = 200;
  static height = 250;
  state = {
    game: 0
  };

  renderBlocks() {
    const gamePieces = gamePositions[this.state.game];

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
    return <div id="frame">{blocks}</div>;
  }
}

class Block extends PureComponent {
  render() {
    return <div className={this.props.className} style={this.props.style} />;
  }
}
