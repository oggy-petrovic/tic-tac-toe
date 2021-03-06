import React from 'react';
import PropTypes from 'prop-types';

import Square from './Square';

function checkLine(squares, player, index, dimension, step) {
  if (!player) {
    return null;
  }
  const start = index + step;
  const limit = dimension * step + index;
  for (let i = start; i < limit; i += step) {
    const element = squares[i];
    if (element !== player) {
      return null;
    }
  }

  return player;
}

function checkHorizontal(squares, index, dimension) {
  const player = squares[index];
  const step = 1;
  return checkLine(squares, player, index, dimension, step);
}

function checkVertical(squares, index, dimension) {
  const player = squares[index];
  const step = dimension;
  return checkLine(squares, player, index, dimension, step);
}

function checkDiagonalRight(squares, index, dimension) {
  const player = squares[index];
  const step = dimension + 1;
  return checkLine(squares, player, index, dimension, step);
}

function checkDiagonalLeft(squares, index, dimension) {
  const player = squares[index];
  const step = dimension - 1;
  return checkLine(squares, player, index, dimension, step);
}

function findWinner(squares, dimension) {
  let winner = null;
  // check verticals
  for (let i = 0; i < dimension; i += 1) {
    winner = checkVertical(squares, i, dimension);
    if (winner) {
      return winner;
    }
  }
  // check horizontals
  for (let i = 0; i < dimension * dimension; i += dimension) {
    winner = checkHorizontal(squares, i, dimension);
    if (winner) {
      return winner;
    }
  }
  // check diagonals
  winner = checkDiagonalRight(squares, 0, dimension);
  if (winner) {
    return winner;
  }
  winner = checkDiagonalLeft(squares, dimension - 1, dimension);
  if (winner) {
    return winner;
  }

  return winner;
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const { dimension } = props;
    this.state = {
      dimension,
      nextPlayer: 'X',
      squares: Array(dimension * dimension).fill(null),
      winner: null,
    };
  }

  handleClick(i) {
    const {
      dimension,
      squares,
      winner,
      nextPlayer,
    } = this.state;

    if (winner || squares[i]) {
      return;
    }

    const squaresUpdate = [...squares];
    squaresUpdate[i] = nextPlayer;
    const winnerUpdate = findWinner(squaresUpdate, dimension);

    this.setState({
      squares: squaresUpdate,
      winner: winnerUpdate,
      nextPlayer: nextPlayer === 'X' ? 'O' : 'X',
    });
  }

  renderSquare(i) {
    const { squares } = this.state;
    return <Square value={squares[i]} onClick={() => this.handleClick(i)} />;
  }

  renderRow(offset) {
    const { dimension } = this.state;
    const squares = Array(dimension);
    for (let i = 0; i < dimension; i += 1) {
      squares[i] = this.renderSquare(i + offset);
    }
    return <div className="board-row">{squares}</div>;
  }

  render() {
    const { dimension, nextPlayer, winner } = this.state;

    const status = winner
      ? `The winner is: ${winner}`
      : `Next player: ${nextPlayer}`;

    const rows = Array(dimension);
    for (let i = 0; i < dimension; i += 1) {
      rows[i] = this.renderRow(i * dimension);
    }

    return (
      <div>
        <div className="status">{status}</div>
        {rows}
      </div>
    );
  }
}

Board.propTypes = {
  dimension: PropTypes.number,
};

Board.defaultProps = {
  dimension: 3,
};
