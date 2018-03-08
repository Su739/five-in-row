/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

const Square = (props) => {
  const { btnWidth, value, click } = props;
  return (
    <button style={{ width: btnWidth, height: btnWidth }} className="square" onClick={click}>
      {value}
    </button>
  );
};
Square.propTypes = {
  value: PropTypes.string,
  click: PropTypes.func,
  btnWidth: PropTypes.number,
};

const Board = (props) => {
  const {
    square, onClick, boardNum, clientWidth,
  } = props;
  const board = [];
  let rowWidth = 24;
  if (clientWidth > 1200) {
    rowWidth = 1200;
  } else if (clientWidth > 900) {
    rowWidth = 900;
  } else if (clientWidth > 600) {
    rowWidth = 600;
  } else {
    rowWidth = 400;
  }
  const btnWidth = `${rowWidth / boardNum}px`;
  const renderSquare = i => (
    <Square btnWidth={btnWidth} value={square[i]} num={boardNum} onClick={() => onClick(i)} />
  );
  for (let i = 0; i < boardNum; i += 1) {
    const row = [];
    for (let j = 0; j < boardNum; j += 1) {
      row.push(renderSquare((i * boardNum) + j));
    }
    board.push(<div style={{ width: rowWidth }}>{row}</div>);
  }
  return (
    <div>{board}</div>
  );
};

Board.propTypes = {
  square: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  boardNum: PropTypes.number,
  clientWidth: PropTypes.number,
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWidth: window.innerWidth,
      boardNum: 16,
      square: Array(256).fill(''),
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(i) {
    console.log(this.state.boardNum + i);
  }
  render() {
    const rootWidth = window.innerWidth;
    return (
      <div className="board-container">
        <span>{rootWidth}</span>
        <Board
          clientWidth={this.state.clientWidth}
          square={this.state.square}
          boardNum={this.state.boardNum}
          onClick={i => this.handleClick(i)}
        />
      </div>
    );
  }
}

export default Game;
