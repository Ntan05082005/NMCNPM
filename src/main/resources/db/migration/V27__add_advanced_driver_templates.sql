-- V27: Add driver templates for advanced problems (11-15)
-- These problems involve 2D matrices, simulation, and complex I/O

-- ============================================
-- Problem 11: Spiral Matrix
-- Input: First line: m n, Next m lines: n integers
-- Output: Space-separated integers in spiral order
-- ============================================

UPDATE problems SET function_name = 'spiralOrder' WHERE id = 11;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    int m, n;
    cin >> m >> n;
    
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> matrix[i][j];
        }
    }
    
    vector<int> result = spiralOrder(matrix);
    
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;
    
    return 0;
}' WHERE id = 11;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    m, n = map(int, input().split())
    matrix = []
    for _ in range(m):
        row = list(map(int, input().split()))
        matrix.append(row)
    
    result = spiral_order(matrix)
    print(" ".join(map(str, result)))' WHERE id = 11;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const [m, n] = lines[0].split(" ").map(Number);
    const matrix = [];
    
    for (let i = 1; i <= m; i++) {
        matrix.push(lines[i].split(" ").map(Number));
    }
    
    const result = spiralOrder(matrix);
    console.log(result.join(" "));
});' WHERE id = 11;

-- ============================================
-- Problem 12: Robot Bounded In Circle
-- Input: string instructions (G, L, R)
-- Output: "true" or "false"
-- ============================================

UPDATE problems SET function_name = 'isRobotBounded' WHERE id = 12;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <string>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    string instructions;
    getline(cin, instructions);
    
    bool result = isRobotBounded(instructions);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}' WHERE id = 12;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    instructions = input().strip()
    result = is_robot_bounded(instructions)
    print("true" if result else "false")' WHERE id = 12;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const instructions = lines[0] || "";
    const result = isRobotBounded(instructions);
    console.log(result ? "true" : "false");
});' WHERE id = 12;

-- ============================================
-- Problem 13: Game of Life
-- Input: First line: m n, Next m lines: n integers (0 or 1)
-- Output: m lines of n integers (next state)
-- Note: This modifies the board in-place, so we need to handle output
-- ============================================

UPDATE problems SET function_name = 'gameOfLife' WHERE id = 13;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    int m, n;
    cin >> m >> n;
    
    vector<vector<int>> board(m, vector<int>(n));
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> board[i][j];
        }
    }
    
    gameOfLife(board);
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (j > 0) cout << " ";
            cout << board[i][j];
        }
        cout << endl;
    }
    
    return 0;
}' WHERE id = 13;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    m, n = map(int, input().split())
    board = []
    for _ in range(m):
        row = list(map(int, input().split()))
        board.append(row)
    
    game_of_life(board)
    
    for row in board:
        print(" ".join(map(str, row)))' WHERE id = 13;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const [m, n] = lines[0].split(" ").map(Number);
    const board = [];
    
    for (let i = 1; i <= m; i++) {
        board.push(lines[i].split(" ").map(Number));
    }
    
    gameOfLife(board);
    
    for (let row of board) {
        console.log(row.join(" "));
    }
});' WHERE id = 13;

-- ============================================
-- Problem 14: Text Justification
-- Input: Line 1: maxWidth, Next lines: words (one per line), Last line: END
-- Output: Each line of justified text
-- ============================================

UPDATE problems SET function_name = 'fullJustify' WHERE id = 14;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <string>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    int maxWidth;
    cin >> maxWidth;
    cin.ignore();
    
    vector<string> words;
    string word;
    while (getline(cin, word) && word != "END") {
        words.push_back(word);
    }
    
    vector<string> result = fullJustify(words, maxWidth);
    
    for (const string& line : result) {
        cout << line << endl;
    }
    
    return 0;
}' WHERE id = 14;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

import sys

if __name__ == "__main__":
    max_width = int(input())
    words = []
    
    for line in sys.stdin:
        line = line.strip()
        if line == "END":
            break
        words.append(line)
    
    result = full_justify(words, max_width)
    
    for line in result:
        print(line)' WHERE id = 14;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const maxWidth = parseInt(lines[0]);
    const words = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] === "END") break;
        words.push(lines[i]);
    }
    
    const result = fullJustify(words, maxWidth);
    
    for (const line of result) {
        console.log(line);
    }
});' WHERE id = 14;

-- ============================================
-- Problem 15: Snake Game
-- Input format:
--   Line 1: width height
--   Line 2: number of food items
--   Next lines: food coordinates (row col)
--   Next line: number of moves
--   Next lines: moves (U/D/L/R)
-- Output: Final score (number of food eaten)
-- Note: This is a class-based design, needs special handling
-- ============================================

UPDATE problems SET function_name = 'SnakeGame' WHERE id = 15;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <string>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    int width, height;
    cin >> width >> height;
    
    int foodCount;
    cin >> foodCount;
    
    vector<vector<int>> food(foodCount, vector<int>(2));
    for (int i = 0; i < foodCount; i++) {
        cin >> food[i][0] >> food[i][1];
    }
    
    SnakeGame game(width, height, food);
    
    int moveCount;
    cin >> moveCount;
    
    int score = 0;
    for (int i = 0; i < moveCount; i++) {
        string direction;
        cin >> direction;
        score = game.move(direction);
        if (score == -1) break; // Game over
    }
    
    cout << (score == -1 ? 0 : score) << endl;
    
    return 0;
}' WHERE id = 15;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    width, height = map(int, input().split())
    
    food_count = int(input())
    food = []
    for _ in range(food_count):
        row, col = map(int, input().split())
        food.append([row, col])
    
    game = SnakeGame(width, height, food)
    
    move_count = int(input())
    score = 0
    
    for _ in range(move_count):
        direction = input().strip()
        score = game.move(direction)
        if score == -1:
            break
    
    print(0 if score == -1 else score)' WHERE id = 15;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    let idx = 0;
    const [width, height] = lines[idx++].split(" ").map(Number);
    
    const foodCount = parseInt(lines[idx++]);
    const food = [];
    for (let i = 0; i < foodCount; i++) {
        const [row, col] = lines[idx++].split(" ").map(Number);
        food.push([row, col]);
    }
    
    const game = new SnakeGame(width, height, food);
    
    const moveCount = parseInt(lines[idx++]);
    let score = 0;
    
    for (let i = 0; i < moveCount; i++) {
        const direction = lines[idx++].trim();
        score = game.move(direction);
        if (score === -1) break;
    }
    
    console.log(score === -1 ? 0 : score);
});' WHERE id = 15;
