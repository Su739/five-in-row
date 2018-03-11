/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

// 棋盘上的格子
const Square = (props) => {
  const { btnWidth, value, onStep } = props;
  return (
    <button style={{ width: btnWidth, height: btnWidth }} className="square" onClick={onStep}>
      {value}
    </button>
  );
};
Square.propTypes = {
  value: PropTypes.string,
  onStep: PropTypes.func,
  btnWidth: PropTypes.string,
};

// 棋盘
const Board = (props) => {
  const {
    square, onStep, boardNum, clientWidth, clientHeight,
  } = props;
  const board = [];

  // 计算棋盘大小，要与css中media配合使用
  let rowWidth = 300;
  if (clientWidth > 1200 && clientHeight > 1200) {
    rowWidth = 800;
  } else if (clientWidth > 992 && clientHeight > 992) {
    rowWidth = 600;
  } else if (clientWidth > 768 && clientHeight > 768) {
    rowWidth = 380;
  }
  const btnWidth = `${rowWidth / boardNum}px`;

  // 生成一个格子，传递给square宽度、格子上的棋子(X\O\NULL)、以及用于liftup的方法
  const renderSquare = i => (
    <Square key={`s-${i}`} btnWidth={btnWidth} value={square[i]} onStep={() => onStep(i)} />
  );

  // 生成棋盘
  for (let i = 0; i < boardNum; i += 1) {
    const row = [];
    for (let j = 0; j < boardNum; j += 1) {
      row.push(renderSquare((i * boardNum) + j));
    }
    board.push(<div className="board-row" key={`r-${i}`}>{row}</div>);
  }
  return (
    <div className="board-container" style={{ width: rowWidth }}>
      {board}
    </div>
  );
};

Board.propTypes = {
  square: PropTypes.arrayOf(PropTypes.string),
  onStep: PropTypes.func,
  boardNum: PropTypes.number,
  clientWidth: PropTypes.number,
  clientHeight: PropTypes.number,
};

// 棋盘控制
const BoardController = (props) => {
  const handleClick = (e) => {
    const { target: { id } } = e;
    if (id === 'b-10') {
      props.renderBoard(10);
    } else if (id === 'b-16') {
      props.renderBoard(16);
    } else if (id === 'restart') {
      props.resetBoard();
    }
  };
  if (props.isStarted) {
    return (
      <div className="board-controller">
        <button id="restart" onClick={handleClick}>重新开始</button>
      </div>
    );
  }
  return (
    <div>
      <h3>请选择棋盘</h3>
      <button id="b-10" onClick={handleClick}>10x10</button>
      <button id="b-16" onClick={handleClick}>16x16</button>
    </div>
  );
};

BoardController.propTypes = {
  renderBoard: PropTypes.func,
  isStarted: PropTypes.bool,
  resetBoard: PropTypes.func,
};

/**
 * 胜负算法
 * @param {string} arr
 */
const calculateWinner = (squares, row) => {
  const arr = squares.slice();
  let result1 = 0;
  let result2 = 0;
  let result3 = 0;
  let result4 = 0;
  let result5 = 0;
  let result6 = 0;

  // 遍历所有棋子
  for (let i = 0; i < row - 1; i += 1) {
    for (let j = 0; j < row - 1; j += 1) {
      // R1-横向,1、该位置有棋子，2、棋子连续，3、这条线上剩余位置加上已有连续棋子够5子
      if (arr[(i * row) + j] !== null
        && arr[(i * row) + j] === arr[(i * row) + (j + 1)]
        && (result1 + (row - j) >= 5)) {
        result1 += 1;
        // 横向决出胜负
        if (result1 >= 4) {
          return arr[(i * row) + j];
        }
      } else {
        result1 = 0;
      }

      // R2-竖向,1、该位置有棋子，2、棋子连续，3、这条线上剩余位置加上已有连续棋子够5子
      if (arr[(j * row) + i] !== null
        && arr[(j * row) + i] === arr[((j + 1) * row) + i]
        && (result2 + (row - j)) >= 5) {
        result2 += 1;
        // 纵向决出胜负
        if (result2 >= 4) {
          return arr[(j * row) + i];
        }
      } else {
        result2 = 0;
      }

      // R3-左切斜、上半部(包括对角线)，1、同步坐标，2、该位置有棋子，3、棋子连续
      // 4、这条线上剩余位置加上已有连续棋子够5子(横向耗尽，横纵都一样，或者说)
      /* if(j<i) break;。。之前居然写出这个，break直接跳出for循环啦大兄弟 */
      if (j >= i
        && arr[j + ((j - i) * row)] !== null
        && arr[j + ((j - i) * row)] === arr[(j + 1) + (((j - i) + 1) * row)]
        && (result3 + (row - j)) >= 5) {
        result3 += 1;
        // 左切斜、上半部(包括对角线)决出胜负
        if (result3 >= 4) {
          return arr[j + ((j - i) * row)];
        }
      } else {
        result3 = 0;
      }

      // R-4左切斜、下半部(包括对角线)，1、同步坐标，2、该位置有棋子，3、棋子连续
      // 4、这条线上剩余位置加上已有连续棋子够5子(横向耗尽，横纵都一样，或者说)
      if (j >= i
        && arr[(j - i) + (j * row)] !== null
        && arr[(j - i) + (j * row)] === arr[((j - i) + 1) + ((j + 1) * row)]
        && (result4 + (row - j)) >= 5) {
        result4 += 1;
        // 左切斜、上半部(包括对角线)决出胜负
        if (result4 >= 4) {
          return arr[(j - i) + (j * row)];
        }
      } else {
        result4 = 0;
      }

      // R-5右切斜、上半部(包括对角线)，1、同步坐标，2、该位置有棋子，3、棋子连续，
      // 4、这条线上剩余位置加上已有连续棋子够5子(横向耗尽，或者说横纵都一样)
      if (j >= i
        && arr[(j - i) + ((row - j - 1) * row)] !== null
        &&
          arr[(j - i) + ((row - j - 1) * row)]
        ===
          arr[((j - i) + 1) + ((row - j - 1 - 1) * row)]
        && (result5 + (row - j)) >= 5) {
        result5 += 1;
        // 左切斜、上半部(包括对角线)决出胜负
        if (result5 >= 4) {
          return arr[(j - i) + ((row - j - 1) * row)];
        }
      } else {
        result5 = 0;
      }
      // R6-右切斜、下半部(包括对角线)，1、同步坐标，2、该位置有棋子，3、棋子连续，
      // 4、这条线上剩余位置加上已有连续棋子够5子(横向耗尽，横纵都一样，或者说)
      if (j >= i
        && arr[j + ((row - j) * row)] !== null
        && arr[j + ((row - j) * row)] === arr[j + 1 + ((row - j - 1) * row)]
        && (result6 + (row - j)) >= 5) {
        result6 += 1;
        // 左切斜、上半部(包括对角线)决出胜负
        if (result6 >= 4) {
          return arr[j + ((row - j) * row)];
        }
      } else {
        result6 = 0;
      }
    }
  }
  return false;
};

// 主程序
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      boardNum: 0,
      stepList: [],
      squares: [],
      started: false,
      turn: 'X',
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(i) {
    const {
      turn,
      stepList,
      boardNum,
    } = this.state;
    const squares = this.state.squares.slice();
    // 判断点击是否有效或者已分出胜负
    if (calculateWinner(squares, boardNum) || squares[i]) {
      return;
    }
    // 落子
    squares[i] = turn;
    // 下棋记录
    const slist = stepList.concat({ player: turn, position: `(${i % boardNum}, ${Math.floor(i / boardNum)})` });
    this.setState({
      turn: turn === 'X' ? 'O' : 'X',
      stepList: slist,
      squares,
    });
  }
  // 重新开始
  resetBoard() {
    this.setState({
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      boardNum: 0,
      stepList: [],
      squares: [],
      started: false,
      turn: 'X',
    });
  }
  // 生成棋盘
  renderBoard(num) {
    this.setState({
      boardNum: num,
      // 记住更新窗口大小
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      squares: Array(num * num).fill(null),
      started: true,
    });
  }
  render() {
    // 生成对局记录表
    const stepList = this.state.stepList.map((item, index) => (
      <li key={`k-${item.position}`}>{`#-${index}:  ${item.player} at ${item.position}`}</li>
    ));
    // 判断是否胜负已分来决定渲染
    const winner = calculateWinner(this.state.squares, this.state.boardNum);
    const guide = (
      <div>
        {winner ? <h3>{`Winner is ${winner}`}</h3> : <h3>{`Turn is ${this.state.turn}`}</h3>}
        <ul className="step-list">
          {stepList.reverse()}
        </ul>
      </div>);

    return (
      <div className="container">
        {this.state.boardNum !== 0 ? guide : null}
        <Board
          clientWidth={this.state.clientWidth}
          clientHeight={this.state.clientHeight}
          square={this.state.squares}
          boardNum={this.state.boardNum}
          guide={guide}
          onStep={i => this.handleClick(i)}
        />
        <BoardController
          isStarted={this.state.started}
          renderBoard={(num, e) => this.renderBoard(num, e)}
          resetBoard={() => this.resetBoard()}
        />
      </div>
    );
  }
}


export default Game;
