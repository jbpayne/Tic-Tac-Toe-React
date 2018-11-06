import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" id={props.id} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={"cell-" + i}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  makeButtonBold(theButton) {
    for (let i = 0; i < 10; i++) {
      let buttonId = document.getElementById("button-" + i);
      if (buttonId) {
        buttonId.style.fontWeight = 'normal';
      }
    }

    document.getElementById("button-" + theButton).style.fontWeight = 'bold';
  }

  clearColors() {
    for (let i = 0; i < 9; i++) {
      let cellId = document.getElementById("cell-" + i);
      if (cellId) {
        cellId.style.color = 'black';
        cellId.style.backgroundColor = 'white';
      }
    }
  }

  jumpTo(step) {
    this.clearColors();
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
    this.makeButtonBold(step);
  }

  toggleOrder() {
    let myOl = document.getElementById('moves');
    if (myOl.style.transform === 'rotate(180deg)') {
      myOl.style.transform = 'rotate(0deg)';
    } else {
      myOl.style.transform = 'rotate(180deg)';
    }

    for (let i = 0; i < 10; i++) {
      let lineId = document.getElementById("line-" + i);
      if (lineId) {
        if (lineId.style.transform === 'rotate(180deg)') {
          lineId.style.transform = 'rotate(0deg)';
        } else {
          lineId.style.transform = 'rotate(180deg)';
        }
      }
    }
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move: ' + move :
        'Go to the beginning';
      return (
        <li key={move} id={"line-" + move} style={{ transform: 'rotate(180deg)' }}>
          <button onClick={() => this.jumpTo(move)}>{<span id={"button-" + move}>{desc}</span>}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "The winner is: " + winner;
    } else if (history.length === 10) {
      status = "It's a draw!";
    } else {
      status = "The next player is: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol id="moves" style={{ transform: 'rotate(180deg)' }}>{moves}</ol>
        </div>
        <div>
          <button onClick={() => this.toggleOrder()}>Reverse Order</button>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log([a, b, c]);
      document.getElementById('cell-' + a).style.backgroundColor = 'yellow';
      document.getElementById('cell-' + a).style.color = 'red';
      document.getElementById('cell-' + b).style.backgroundColor = 'yellow';
      document.getElementById('cell-' + b).style.color = 'red';
      document.getElementById('cell-' + c).style.backgroundColor = 'yellow';
      document.getElementById('cell-' + c).style.color = 'red';
      return squares[a];
    }
  }
  return null;
}
