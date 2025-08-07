export const calculateScoreOld = (tiles: number[]): number => {
  let score = 0;

  for (let y = 0; y < 5; y++) {
    let streak = 1;
    let lastNum: number = tiles[y * 5 + 0] ?? 0;
    for (let x = 1; x < 5; x++) {
      if (tiles[y * 5 + x] === lastNum) streak++;
      else {
        if (streak > 1) score += lastNum * streak;
        streak = 1;
      }
      lastNum = tiles[y * 5 + x] ?? 0;
    }
    if (streak > 1) score += lastNum * streak;
  }

  for (let x = 0; x < 5; x++) {
    let streak = 1;
    let lastNum: number = tiles[x] ?? 0;
    for (let y = 1; y < 5; y++) {
      if (tiles[y * 5 + x] === lastNum) streak++;
      else {
        if (streak > 1) score += lastNum * streak;
        streak = 1;
      }
      lastNum = tiles[y * 5 + x] ?? 0;
    }
    if (streak > 1) score += lastNum * streak;
  }

  return score;
};

export const calculateScoreOldLocal = (board: number[]): number => {
  let newScore = 0;

  for (let y = 0; y < 5; y++) {
    let streak = 1;
    let lastNum = board[y * 5 + 0] ?? 0;
    for (let x = 1; x < 5; x++) {
      if (board[y * 5 + x] === lastNum) streak++;
      else {
        if (streak > 1) newScore += lastNum * streak;
        streak = 1;
      }
      lastNum = board[y * 5 + x] ?? 0;
    }
    if (streak > 1) newScore += lastNum * streak;
  }

  for (let x = 0; x < 5; x++) {
    let streak = 1;
    let lastNum: number = board[x] ?? 0;
    for (let y = 1; y < 5; y++) {
      if (board[y * 5 + x] === lastNum) streak++;
      else {
        if (streak > 1) newScore += lastNum * streak;
        streak = 1;
      }
      lastNum = board[y * 5 + x] ?? 0;
    }
    if (streak > 1) newScore += lastNum * streak;
  }

  return newScore;
};

export const calculateScore = (tiles: number[]): number => {
  let score = 0;

  for (let i = 0; i < 5; i++) {
    let rowStreak = 1;
    let rowPrev = tiles[i * 5] as number;
    let colStreak = 1;
    let colPrev = tiles[i] as number;
    for (let j = 1; j < 5; j++) {
      const rowCurr = tiles[i * 5 + j];
      const colCurr = tiles[j * 5 + i];

      if (rowCurr === rowPrev && rowCurr > 0) {
        rowStreak++;
      } else {
        if (rowStreak > 1) score += rowPrev * rowStreak;
        rowStreak = 1;
        rowPrev = rowCurr as number;
      }

      if (colCurr === colPrev && colCurr > 0) {
        colStreak++;
      } else {
        if (colStreak > 1) score += colPrev * colStreak;
        colStreak = 1;
        colPrev = colCurr as number;
      }
    }
    if (rowStreak > 1) score += rowPrev * rowStreak;
    if (colStreak > 1) score += colPrev * colStreak;
  }

  return score;
};
