-- ============================================================
-- Add problems for different categories
-- ============================================================
-- This migration adds 5 problems each for:
-- - Implementation/Simulation
-- - Debugging
-- - System Design
-- - OOP
-- - SQL/Database
-- (DSA category already has 10 problems from V8)
-- ============================================================

-- First, add new tags for different categories
INSERT INTO tags (name, slug, description) VALUES
('Implementation', 'implementation', 'Implementation and simulation problems'),
('Debugging', 'debugging', 'Code debugging and error fixing'),
('System Design', 'system-design', 'System architecture and scalability'),
('OOP', 'oop', 'Object-oriented programming and design patterns'),
('Database', 'database', 'SQL and database management'),
('Simulation', 'simulation', 'Process simulation problems'),
('Design Patterns', 'design-patterns', 'Software design patterns'),
('Architecture', 'architecture', 'Software architecture and structure')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- IMPLEMENTATION / SIMULATION PROBLEMS (5 problems)
-- ============================================================

-- Problem 11: Spiral Matrix
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Spiral Matrix',
    'spiral-matrix',
    'MEDIUM',
    'Given an m x n matrix, return all elements of the matrix in spiral order (clockwise from outside to inside).',
    'm == matrix.length
n == matrix[i].length
1 <= m, n <= 10
-100 <= matrix[i][j] <= 100',
    'First line: m n (dimensions)
Next m lines: n space-separated integers',
    'Space-separated integers in spiral order',
    '3 3
1 2 3
4 5 6
7 8 9',
    '1 2 3 6 9 8 7 4 5',
    'Start from top-left, go right, down, left, up, then repeat for inner layers.',
    'Traverse a 2D matrix in spiral order from outside to inside.',
    '["Master matrix traversal patterns", "Practice boundary tracking", "Implement direction changes"]',
    'matrix=[[1,2,3],[4,5,6],[7,8,9]]',
    '[1,2,3,6,9,8,7,4,5]',
    'Traverse: top row, right column, bottom row, left column, center',
    'matrix=[[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
    '[1,2,3,4,8,12,11,10,9,5,6,7]',
    'Follow the spiral pattern for a 3x4 matrix',
    3000, 256, false
);

-- Problem 12: Robot Bounded In Circle
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Robot Bounded In Circle',
    'robot-bounded-in-circle',
    'MEDIUM',
    'A robot on an infinite plane starts at (0,0) facing north. It receives a string of instructions: ''G'' (go forward 1 unit), ''L'' (turn left 90 degrees), ''R'' (turn right 90 degrees). Determine if after executing the instructions, the robot stays in a circle (returns to origin or changes direction).',
    '1 <= instructions.length <= 100
instructions[i] is ''G'', ''L'', or ''R''',
    'A string of instructions (G, L, R)',
    'true if bounded in circle, false otherwise',
    'GGLLGG',
    'true',
    'After executing, robot returns to (0,0) facing south, will circle back.',
    'Simulate a robot following instructions to check if it moves in a circle.',
    '["Practice coordinate simulation", "Track position and direction", "Understand cyclic patterns"]',
    'instructions="GGLLGG"',
    'true',
    'Robot moves in a pattern that returns to origin after repeating.',
    'instructions="GG"',
    'false',
    'Robot moves straight north and never returns.',
    2000, 256, false
);

-- Problem 13: Game of Life
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Game of Life',
    'game-of-life',
    'MEDIUM',
    'Simulate Conway''s Game of Life. Given an m x n grid (0=dead, 1=alive), compute the next state:
1. Any live cell with <2 or >3 live neighbors dies
2. Any live cell with 2-3 live neighbors lives
3. Any dead cell with exactly 3 live neighbors becomes alive',
    'm == board.length
n == board[i].length
1 <= m, n <= 25
board[i][j] is 0 or 1',
    'First line: m n
Next m lines: n space-separated integers (0 or 1)',
    'm lines of n space-separated integers (next state)',
    '4 3
0 1 0
0 0 1
1 1 1
0 0 0',
    '0 0 0
1 0 1
0 1 1
0 1 0',
    'Apply Game of Life rules to each cell based on its 8 neighbors.',
    'Simulate Conway''s Game of Life for one generation.',
    '["Implement cellular automaton rules", "Handle 2D grid neighbor counting", "Practice in-place or auxiliary array techniques"]',
    'board=[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]',
    '[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]',
    'Each cell changes based on counting its 8 neighbors.',
    'board=[[1,1],[1,0]]',
    '[[1,1],[1,1]]',
    'Small 2x2 grid evolution.',
    3000, 256, false
);

-- Problem 14: Text Justification
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Text Justification',
    'text-justification',
    'HARD',
    'Given an array of words and a maxWidth, format the text such that each line has exactly maxWidth characters and is fully justified (extra spaces distributed evenly between words). Last line should be left-justified.',
    '1 <= words.length <= 300
1 <= words[i].length <= 20
1 <= maxWidth <= 100
words[i] consists of only English letters',
    'First line: maxWidth
Next lines: words (one per line)
Last line: END',
    'Each line of justified text',
    '16
This
is
an
example
of
text
justification.
END',
    'This    is    an
example  of text
justification.  ',
    'Pack words into lines with even spacing, left-justify last line.',
    'Format text into justified lines with even spacing.',
    '["Practice string manipulation", "Implement greedy line packing", "Handle edge cases with spacing"]',
    'words=["This","is","an","example"], maxWidth=16',
    '["This    is    an","example  of text","justification.  "]',
    'Distribute spaces evenly, left-justify last line.',
    'words=["What","must","be","shall","be."], maxWidth=12',
    '["What must be","shall be.   "]',
    'Pack words and justify each line.',
    3000, 256, false
);

-- Problem 15: Snake Game
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Snake Game',
    'snake-game',
    'MEDIUM',
    'Design a Snake game. The snake starts at (0,0) with length 1. Food appears at given positions. The snake moves in 4 directions (U/D/L/R). If it eats food, it grows. If it hits itself or wall, game over. Return the score (number of food eaten) after all moves.',
    'width and height >= 2
food.length >= 0
moves.length >= 0',
    'Line 1: width height
Line 2: number of food items
Next lines: food coordinates (row col)
Next line: number of moves
Next lines: moves (U/D/L/R)',
    'Final score (number of food eaten)',
    '3 2
3
1 2
0 1
1 0
3
R
D
R',
    '0',
    'Snake hits wall before eating any food.',
    'Simulate a snake game with food and movement.',
    '["Implement game logic simulation", "Track snake body positions with queue", "Detect collisions"]',
    'width=3, height=2, food=[[1,2],[0,1]], moves=["R","D","R","U","L","U"]',
    '1',
    'Snake eats one food before dying.',
    'width=3, height=3, food=[[1,1],[2,2]], moves=["R","R","D"]',
    '1',
    'Snake eats one food item.',
    3000, 256, false
);

-- Link Implementation problems with tags
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'spiral-matrix' AND t.slug IN ('array', 'implementation', 'simulation');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'robot-bounded-in-circle' AND t.slug IN ('implementation', 'simulation', 'math');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'game-of-life' AND t.slug IN ('array', 'implementation', 'simulation');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'text-justification' AND t.slug IN ('string', 'implementation', 'simulation');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'snake-game' AND t.slug IN ('implementation', 'simulation', 'queue');

-- ============================================================
-- DEBUGGING PROBLEMS (5 problems)
-- ============================================================

-- Problem 16: Fix Binary Search Bug
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Fix Binary Search Bug',
    'fix-binary-search-bug',
    'EASY',
    'The following binary search code has a bug that causes integer overflow:
```
int mid = (left + right) / 2;
```
Your task is to identify the bug and provide the correct line of code.',
    'Code provided in problem description',
    'Choose the correct fix from options',
    'Option number (1-4)',
    '1',
    '2',
    'Option 2: int mid = left + (right - left) / 2; prevents overflow.',
    'Fix integer overflow bug in binary search.',
    '["Identify overflow issues", "Understand integer arithmetic limits", "Apply safe arithmetic patterns"]',
    'Bug: mid = (left + right) / 2',
    'Fix: mid = left + (right - left) / 2',
    'Prevents overflow when left and right are large.',
    'Bug causes crash on large arrays',
    'Use safe arithmetic to prevent overflow',
    'Understanding integer limits is crucial.',
    2000, 256, false
);

-- Problem 17: Fix Infinite Loop
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Fix Infinite Loop',
    'fix-infinite-loop',
    'EASY',
    'The following code to reverse a linked list has an infinite loop bug:
```
while (current != null) {
    next = current.next;
    current.next = prev;
    current = next;
}
```
Find and fix the bug.',
    'Code provided in problem description',
    'Corrected code',
    'INPUT',
    'OUTPUT',
    'Explanation of the bug and fix.',
    'Missing prev = current; causes infinite loop. Add this line.',
    'Debug an infinite loop in linked list reversal.',
    '["Identify missing state updates","Trace execution flow","Debug pointer manipulation"]',
    'Code missing: prev = current',
    'Add: prev = current before current = next',
    'State must be saved before moving pointers.',
    'Infinite loop due to missing update',
    'All pointers must advance correctly',
    'Trace each iteration to find the issue.',
    2000, 256, false
);

-- Problem 18: Fix Memory Leak
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Fix Memory Leak',
    'fix-memory-leak',
    'MEDIUM',
    'The following code creates a memory leak:
```java
public List<Integer> process(int[] arr) {
    List<Integer> result = new ArrayList<>();
    for (int i : arr) {
        result.add(i);
        result = new ArrayList<>(); // BUG HERE
    }
    return result;
}
```
Identify and fix the bug.',
    'Code provided in problem description',
    'Corrected code',
    'INPUT',
    'OUTPUT',
    'Explanation of the memory leak bug.',
    'Remove the line creating new ArrayList inside loop.',
    'Fix memory leak by removing redundant object creation.',
    '["Identify unnecessary object creation", "Understand memory management", "Optimize resource usage"]',
    'Bug: creates new ArrayList each iteration',
    'Remove: result = new ArrayList<>(); from loop',
    'Previous list is lost, causing memory leak.',
    'Memory grows unnecessarily',
    'Reuse same list throughout',
    'Only create objects when needed.',
    2000, 256, false
);

-- Problem 19: Fix Off-By-One Error
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Fix Off-By-One Error',
    'fix-off-by-one-error',
    'EASY',
    'The following code to find maximum in array has an off-by-one error:
```
int max = arr[0];
for (int i = 0; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
}
```
This causes ArrayIndexOutOfBoundsException. Fix it.',
    'Code provided in problem description',
    'Corrected code',
    'INPUT',
    'OUTPUT',
    'Explanation of the off-by-one error.',
    'Loop should start at i=0 or check i < arr.length, not <=.',
    'Fix off-by-one error in array traversal.',
    '["Identify boundary condition errors", "Understand array indexing", "Test edge cases"]',
    'Bug: loop condition wrong',
    'Fix: ensure i < arr.length not i <= arr.length',
    'Arrays are 0-indexed, last valid index is length-1.',
    'Common mistake with array bounds',
    'Always check boundary conditions',
    'Test with small arrays to catch errors.',
    2000, 256, false
);

-- Problem 20: Fix Null Pointer Exception
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Fix Null Pointer Exception',
    'fix-null-pointer-exception',
    'EASY',
    'The following code throws NullPointerException:
```java
public int getLength(String str) {
    return str.length();
}
```
When str is null, it crashes. Fix it to return 0 for null strings.',
    'Code provided in problem description',
    'Corrected code that handles null',
    'INPUT',
    'OUTPUT',
    'Explanation of null pointer exception.',
    'Add null check: if (str == null) return 0; before str.length().',
    'Fix null pointer exception with defensive programming.',
    '["Practice defensive programming", "Handle null inputs gracefully", "Understand null safety"]',
    'Bug: no null check',
    'Fix: if (str == null) return 0;',
    'Always validate inputs before using them.',
    'Null inputs cause crashes',
    'Add null checks for robustness',
    'Defensive programming prevents runtime errors.',
    2000, 256, false
);

-- Link Debugging problems with tags
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'fix-binary-search-bug' AND t.slug IN ('debugging', 'binary-search');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'fix-infinite-loop' AND t.slug IN ('debugging', 'linked-list');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'fix-memory-leak' AND t.slug IN ('debugging', 'array');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'fix-off-by-one-error' AND t.slug IN ('debugging', 'array');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'fix-null-pointer-exception' AND t.slug IN ('debugging', 'string');

-- ============================================================
-- SYSTEM DESIGN PROBLEMS (5 problems)
-- ============================================================

-- Problem 21: Design URL Shortener
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design URL Shortener',
    'design-url-shortener',
    'MEDIUM',
    'Design a URL shortening service like bit.ly. Implement:
1. encode(longUrl) - converts long URL to short URL
2. decode(shortUrl) - converts short URL back to long URL

Requirements:
- Short URLs should be unique and short (6-8 characters)
- Support billions of URLs
- Fast encode/decode operations',
    'URLs are valid strings
Length <= 2048 characters',
    'Operations: ENCODE <url> or DECODE <shortUrl>',
    'Result of operation',
    'ENCODE https://leetcode.com/problems/design-tinyurl
DECODE http://tinyurl.com/4e9iAk',
    'http://tinyurl.com/4e9iAk
https://leetcode.com/problems/design-tinyurl',
    'Use base62 encoding and hash map for bidirectional mapping.',
    'Design a scalable URL shortening service.',
    '["Design scalable systems", "Choose appropriate data structures", "Handle collisions in hashing"]',
    'encode("https://example.com/long")',
    '"http://tiny.url/abc123"',
    'Generate unique short code using hash or counter.',
    'decode("http://tiny.url/abc123")',
    '"https://example.com/long"',
    'Lookup original URL from mapping.',
    5000, 512, false
);

-- Problem 22: Design Rate Limiter
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design Rate Limiter',
    'design-rate-limiter',
    'MEDIUM',
    'Design a rate limiter that restricts the number of requests a user can make within a time window.

Implement: boolean allowRequest(userId, timestamp)
- Returns true if request is allowed
- Returns false if rate limit exceeded

Limit: 3 requests per 10 seconds per user',
    'userId is a valid integer
timestamp increases monotonically
Limit: 3 requests per 10 seconds',
    'Multiple lines: userId timestamp',
    'true or false for each request',
    '1 0
1 2
1 5
1 11
1 12',
    'true
true
true
true
false',
    'First 3 requests within 10s are allowed. 4th at t=11 starts new window. 5th at t=12 is still within same window.',
    'Design a rate limiter using sliding window algorithm.',
    '["Implement sliding window algorithm", "Design distributed rate limiting", "Handle time-based constraints"]',
    'userId=1, requests at t=0,2,5',
    'true, true, true',
    'All 3 requests within limit.',
    'userId=1, 4th request at t=7',
    'false',
    'Exceeds 3 requests per 10s limit.',
    5000, 512, false
);

-- Problem 23: Design LRU Cache
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design LRU Cache',
    'design-lru-cache',
    'MEDIUM',
    'Design a Least Recently Used (LRU) cache with O(1) operations:
- get(key): Get value of key if exists, else return -1
- put(key, value): Set or insert value. If cache is full, evict least recently used item before inserting.

Capacity: given in first line',
    '1 <= capacity <= 3000
0 <= key <= 10^4
0 <= value <= 10^5
At most 2 * 10^5 calls to get and put',
    'First line: capacity
Next lines: GET key or PUT key value',
    'Result of GET operations',
    '2
PUT 1 1
PUT 2 2
GET 1
PUT 3 3
GET 2
PUT 4 4
GET 1
GET 3
GET 4',
    '1
-1
-1
3
4',
    'Capacity is 2. After PUT 3, key 2 is evicted (LRU). GET 2 returns -1.',
    'Design an LRU cache with O(1) get and put operations.',
    '["Implement LRU eviction policy", "Combine hash map and doubly linked list", "Achieve O(1) time complexity"]',
    'capacity=2, PUT 1 1, PUT 2 2, GET 1',
    '1',
    'Key 1 exists, return value 1.',
    'PUT 3 3 when cache full',
    'Evicts key 2 (LRU)',
    'Key 2 was least recently used.',
    5000, 512, false
);

-- Problem 24: Design Load Balancer
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design Load Balancer',
    'design-load-balancer',
    'HARD',
    'Design a load balancer that distributes requests across servers:
- addServer(serverId): Add a server to the pool
- removeServer(serverId): Remove a server
- getServer(): Return next server using round-robin algorithm

If a server is removed, redistribute its load.',
    '1 <= serverId <= 1000
At most 10^4 operations',
    'Operations: ADD id, REMOVE id, or GET',
    'Server ID for GET operations',
    'ADD 1
ADD 2
ADD 3
GET
GET
GET
REMOVE 2
GET
GET',
    '1
2
3
1
3',
    'Round-robin cycles through servers. After removing server 2, only 1 and 3 remain.',
    'Design a load balancer with round-robin distribution.',
    '["Implement round-robin algorithm", "Handle dynamic server pool", "Design for high availability"]',
    'ADD 1, ADD 2, GET, GET',
    '1, 2',
    'Alternate between servers in round-robin.',
    'REMOVE 1, GET',
    '2',
    'Only server 2 remains.',
    5000, 512, false
);

-- Problem 25: Design Parking Lot
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design Parking Lot',
    'design-parking-lot',
    'HARD',
    'Design a parking lot system with multiple levels and spot types:
- SMALL spots: motorcycles only
- MEDIUM spots: motorcycles, cars
- LARGE spots: motorcycles, cars, buses

Implement:
- parkVehicle(vehicleType): Returns spot number or -1 if full
- removeVehicle(spotNumber): Frees the spot

Initial setup: 5 SMALL, 5 MEDIUM, 3 LARGE spots',
    'vehicleType: MOTORCYCLE, CAR, BUS
spotNumber: 1-13',
    'PARK type or REMOVE spotNumber',
    'Spot number or -1',
    'PARK MOTORCYCLE
PARK CAR
PARK BUS
REMOVE 1
PARK MOTORCYCLE',
    '1
6
11
1',
    'Assign smallest suitable spot. After removing spot 1, it becomes available again.',
    'Design a parking lot with different spot sizes and vehicle types.',
    '["Design class hierarchies", "Implement allocation algorithms", "Handle resource management"]',
    'PARK MOTORCYCLE, PARK CAR',
    '1, 6',
    'Motorcycle gets SMALL, car gets MEDIUM.',
    'PARK BUS when no LARGE spots',
    '-1',
    'No suitable spot available.',
    5000, 512, false
);

-- Link System Design problems with tags
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-url-shortener' AND t.slug IN ('system-design', 'hash-table', 'design-patterns');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-rate-limiter' AND t.slug IN ('system-design', 'design-patterns', 'queue');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-lru-cache' AND t.slug IN ('system-design', 'hash-table', 'linked-list');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-load-balancer' AND t.slug IN ('system-design', 'design-patterns', 'queue');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-parking-lot' AND t.slug IN ('system-design', 'oop', 'design-patterns');

-- ============================================================
-- OOP / DESIGN PATTERNS PROBLEMS (5 problems)
-- ============================================================

-- Problem 26: Implement Singleton Pattern
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Implement Singleton Pattern',
    'implement-singleton-pattern',
    'EASY',
    'Implement the Singleton design pattern for a Logger class. The class should:
1. Have a private constructor
2. Provide a static getInstance() method that returns the same instance
3. Be thread-safe
4. Support lazy initialization

The Logger should have a log(String message) method that prints messages with timestamps.',
    'Thread-safe implementation required
Lazy initialization preferred',
    'Operations: GET_INSTANCE, LOG message',
    'Success or instance ID',
    'GET_INSTANCE
GET_INSTANCE
LOG Hello World
LOG Another message',
    'Instance1
Instance1
[2024-01-01 10:00:00] Hello World
[2024-01-01 10:00:01] Another message',
    'Both GET_INSTANCE calls return the same instance, proving singleton behavior.',
    'Implement thread-safe singleton pattern with lazy initialization.',
    '["Master singleton pattern", "Ensure thread safety with double-checked locking", "Practice lazy initialization"]',
    'getInstance() called twice',
    'Returns same instance both times',
    'Only one instance exists throughout application lifecycle.',
    'Multiple threads call getInstance()',
    'All get the same instance (thread-safe)',
    'Use synchronized or volatile for thread safety.',
    3000, 256, false
);

-- Problem 27: Design Vending Machine
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design Vending Machine',
    'design-vending-machine',
    'MEDIUM',
    'Design a vending machine using OOP principles and State pattern:

States: IDLE, HAS_MONEY, DISPENSING
Products: Each has name, price, quantity

Operations:
- INSERT_COIN amount
- SELECT_PRODUCT productId
- CANCEL (returns money)
- DISPENSE (gives product)

The machine should track state transitions and handle edge cases (insufficient money, out of stock, etc.).',
    'Product prices are positive integers
Initial products provided',
    'INIT followed by operations',
    'Result of each operation',
    'INIT 3
1 Coke 25 5
2 Pepsi 25 3
3 Water 15 10
INSERT_COIN 25
SELECT_PRODUCT 1
DISPENSE',
    'State: IDLE
Coin inserted: 25, State: HAS_MONEY
Product selected: Coke
Dispensing Coke, Change: 0',
    'Machine transitions through states based on operations.',
    'Design a vending machine using State pattern and OOP principles.',
    '["Apply State pattern", "Design state machines", "Handle state transitions and edge cases"]',
    'INSERT_COIN 20, SELECT_PRODUCT 1 (price=25)',
    'Insufficient funds',
    'Need to insert more money or cancel.',
    'SELECT_PRODUCT when out of stock',
    'Product unavailable',
    'Check inventory before dispensing.',
    4000, 512, false
);

-- Problem 28: Implement Observer Pattern
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Implement Observer Pattern',
    'implement-observer-pattern',
    'MEDIUM',
    'Implement the Observer pattern for a weather station:

Subject: WeatherStation (tracks temperature, humidity, pressure)
Observers: Display devices that get notified when weather changes

Implement:
- WeatherStation: setMeasurements(), notifyObservers()
- Observer interface: update()
- DisplayDevice: shows current conditions

When weather changes, all registered displays should be notified automatically.',
    'Temperature: -50 to 50 degrees C
Humidity: 0-100%
Pressure: 900-1100 hPa',
    'Operations: REGISTER observer, SET_WEATHER temp humidity pressure, UNREGISTER observer',
    'Notifications to observers',
    'REGISTER Display1
REGISTER Display2
SET_WEATHER 25 65 1013
UNREGISTER Display1
SET_WEATHER 28 70 1015',
    'Display1 registered
Display2 registered
Display1: Temp=25C, Humidity=65%, Pressure=1013hPa
Display2: Temp=25C, Humidity=65%, Pressure=1013hPa
Display1 unregistered
Display2: Temp=28C, Humidity=70%, Pressure=1015hPa',
    'Observers are notified when subject state changes. After unregistering, Display1 no longer receives updates.',
    'Implement Observer pattern for weather monitoring system.',
    '["Master Observer pattern", "Implement loose coupling between objects", "Handle dynamic observer lists"]',
    'Register 3 displays, update weather',
    'All 3 displays notified',
    'All registered observers receive notifications.',
    'Unregister one, update weather',
    'Only 2 displays notified',
    'Unregistered observers stop receiving updates.',
    3000, 256, false
);

-- Problem 29: Design ATM System
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Design ATM System',
    'design-atm-system',
    'HARD',
    'Design an ATM system with OOP principles:

Classes needed:
- Account (balance, accountNumber, PIN)
- ATM (cash inventory in different denominations)
- Transaction (type, amount, timestamp)

Operations:
- AUTHENTICATE accountNumber PIN
- CHECK_BALANCE
- WITHDRAW amount
- DEPOSIT amount
- LOGOUT

Constraints:
- Withdrawal: ATM dispenses minimum number of notes (denominations: 100, 50, 20, 10)
- Transaction history tracking
- PIN verification',
    'Account numbers are 6 digits
PINs are 4 digits
Amounts are multiples of 10',
    'Operations as described',
    'Result of each operation',
    'AUTHENTICATE 123456 1234
CHECK_BALANCE
WITHDRAW 280
LOGOUT',
    'Authentication successful
Balance: 1000
Dispensing: 2x100, 1x50, 1x20, 1x10
New Balance: 720
Logged out',
    'ATM dispenses optimal combination of notes and updates balance.',
    'Design a complete ATM system with authentication and transactions.',
    '["Design complex class hierarchies", "Implement security features", "Handle multiple operations and states"]',
    'WITHDRAW 150',
    '1x100, 1x50',
    'Optimal denomination combination.',
    'WITHDRAW 275',
    'Error: Cannot dispense (no 5-note)',
    'ATM cannot make exact change.',
    4000, 512, false
);

-- Problem 30: Implement Factory Pattern
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Implement Factory Pattern',
    'implement-factory-pattern',
    'MEDIUM',
    'Implement the Factory pattern for a shape drawing application:

Create a ShapeFactory that creates different shapes (Circle, Rectangle, Triangle) based on input.

Each shape has:
- draw() method
- getArea() method
- getPerimeter() method

Factory should:
- Create shapes based on type string
- Return null for invalid types
- Support extensibility for new shapes',
    'Valid shapes: CIRCLE, RECTANGLE, TRIANGLE
Parameters provided for each shape type',
    'CREATE type parameters',
    'Shape details and calculations',
    'CREATE CIRCLE 5
CREATE RECTANGLE 4 6
CREATE TRIANGLE 3 4 5
CREATE HEXAGON',
    'Circle created: radius=5
Area: 78.54, Perimeter: 31.42
Rectangle created: width=4, height=6
Area: 24, Perimeter: 20
Triangle created: sides=3,4,5
Area: 6, Perimeter: 12
Error: Invalid shape type',
    'Factory creates appropriate shape objects. Invalid types return errors.',
    'Implement Factory pattern for shape creation.',
    '["Master Factory pattern", "Practice polymorphism", "Design extensible systems"]',
    'Factory.createShape("CIRCLE", 10)',
    'Circle object with radius 10',
    'Factory returns appropriate type based on parameter.',
    'Factory.createShape("INVALID")',
    'null',
    'Unknown types return null or throw exception.',
    3000, 256, false
);

-- Link OOP problems with tags
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'implement-singleton-pattern' AND t.slug IN ('oop', 'design-patterns');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-vending-machine' AND t.slug IN ('oop', 'design-patterns');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'implement-observer-pattern' AND t.slug IN ('oop', 'design-patterns');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'design-atm-system' AND t.slug IN ('oop', 'design-patterns');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'implement-factory-pattern' AND t.slug IN ('oop', 'design-patterns');

-- ============================================================
-- SQL / DATABASE PROBLEMS (5 problems)
-- ============================================================

-- Problem 31: Second Highest Salary
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Second Highest Salary',
    'second-highest-salary',
    'EASY',
    'Write a SQL query to find the second highest salary from the Employee table. If there is no second highest salary, return null.

Table: Employee
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+

Expected query to use: SELECT, DISTINCT, ORDER BY, LIMIT, OFFSET',
    'Salary values are unique or may have duplicates
Handle case when less than 2 distinct salaries',
    'SQL query',
    'Second highest salary or NULL',
    'SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT 1 OFFSET 1',
    '200',
    'After sorting in descending order, skip the first (highest) and return the second.',
    'Write SQL query to find second highest salary.',
    '["Master SQL SELECT with ORDER BY", "Use LIMIT and OFFSET", "Handle NULL cases with COALESCE or IFNULL"]',
    'Salaries: 100, 200, 300',
    '200',
    'Second highest is 200.',
    'Only one salary exists',
    'NULL',
    'No second highest when only one distinct salary.',
    3000, 256, false
);

-- Problem 32: Department Top Three Salaries
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Department Top Three Salaries',
    'department-top-three-salaries',
    'HARD',
    'Write a SQL query to find employees who earn in the top three unique salaries in each department.

Table: Employee
+----+-------+--------+--------------+
| Id | Name  | Salary | DepartmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 85000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
| 5  | Janet | 69000  | 1            |
| 6  | Randy | 85000  | 1            |
+----+-------+--------+--------------+

Use window functions: DENSE_RANK() or RANK()',
    'Multiple employees can have same salary
Return all employees in top 3 salary ranks per department',
    'SQL query using window functions',
    'Department, Employee, Salary',
    'SELECT d.Name AS Department, e.Name AS Employee, e.Salary
FROM Employee e
JOIN Department d ON e.DepartmentId = d.Id
WHERE (
  SELECT COUNT(DISTINCT Salary)
  FROM Employee
  WHERE DepartmentId = e.DepartmentId AND Salary > e.Salary
) < 3',
    'IT | Max | 90000
IT | Joe | 85000
IT | Randy | 85000
Sales | Henry | 80000',
    'For each department, rank salaries and return top 3 ranks.',
    'Find top 3 salaries per department using SQL window functions.',
    '["Master window functions (DENSE_RANK)", "Practice GROUP BY with partitions", "Use correlated subqueries"]',
    'IT dept: salaries 90k, 85k, 85k, 69k',
    'Returns 4 people (top 3 distinct salaries)',
    'Two people have 85k (2nd rank), both included.',
    'Department with only 2 employees',
    'Returns both employees',
    'Returns all available when less than 3.',
    4000, 512, false
);

-- Problem 33: Consecutive Numbers
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Consecutive Numbers',
    'consecutive-numbers',
    'MEDIUM',
    'Write a SQL query to find all numbers that appear at least three times consecutively in the Logs table.

Table: Logs
+----+-----+
| Id | Num |
+----+-----+
| 1  | 1   |
| 2  | 1   |
| 3  | 1   |
| 4  | 2   |
| 5  | 1   |
| 6  | 2   |
| 7  | 2   |
+----+-----+

Use self-joins or window functions (LAG/LEAD).',
    'Id is sequential (1, 2, 3, ...)
Find consecutive occurrences',
    'SQL query using self-join or LAG/LEAD',
    'Distinct numbers appearing 3+ times consecutively',
    'SELECT DISTINCT l1.Num
FROM Logs l1, Logs l2, Logs l3
WHERE l1.Id = l2.Id - 1 AND l2.Id = l3.Id - 1
AND l1.Num = l2.Num AND l2.Num = l3.Num',
    '1',
    'Number 1 appears in rows 1, 2, 3 consecutively.',
    'Find numbers appearing at least 3 times consecutively.',
    '["Practice self-joins", "Use LAG/LEAD window functions", "Identify patterns in sequences"]',
    'Logs: 1,1,1,2,1,2,2',
    '1',
    'Only 1 appears 3 times in a row.',
    'Logs: 1,2,3,2,2,2,2',
    '2',
    'Number 2 appears 4 times consecutively.',
    3000, 256, false
);

-- Problem 34: Delete Duplicate Emails
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Delete Duplicate Emails',
    'delete-duplicate-emails',
    'EASY',
    'Write a SQL DELETE statement to remove duplicate emails from the Person table, keeping only the row with the smallest Id for each email.

Table: Person
+----+------------------+
| Id | Email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
| 3  | john@example.com |
+----+------------------+

After deletion:
+----+------------------+
| Id | Email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
+----+------------------+',
    'Id is unique and auto-increment
Email may have duplicates',
    'SQL DELETE statement with self-join',
    'Number of rows deleted',
    'DELETE p1 FROM Person p1, Person p2
WHERE p1.Email = p2.Email AND p1.Id > p2.Id',
    '1 row deleted',
    'Row with Id=3 is deleted because Id=1 has the same email but smaller Id.',
    'Delete duplicate emails keeping the one with smallest Id.',
    '["Master DELETE with JOIN", "Use self-join for duplicate detection", "Understand DELETE syntax variations"]',
    'Emails: john@ex.com (Id 1,3)',
    'Deletes Id 3',
    'Keeps the row with smallest Id.',
    'No duplicate emails',
    'Deletes 0 rows',
    'Nothing to delete when all unique.',
    3000, 256, false
);

-- Problem 35: Nth Highest Salary
INSERT INTO problems (
    title, slug, difficulty, description,
    constraints, input_format, output_format,
    sample_input, sample_output, explanation,
    summary, learning_objectives,
    example1_input, example1_output, example1_explanation,
    example2_input, example2_output, example2_explanation,
    time_limit_ms, memory_limit_mb, is_premium
) VALUES (
    'Nth Highest Salary',
    'nth-highest-salary',
    'MEDIUM',
    'Write a SQL function to find the Nth highest salary from the Employee table. If there are fewer than N distinct salaries, return null.

Create a function: getNthHighestSalary(N INT)

Table: Employee
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+

For N=2, return 200.
For N=4, return null (only 3 distinct salaries).',
    'N >= 1
Handle case when N > number of distinct salaries',
    'SQL function definition',
    'Nth highest salary or NULL',
    'CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  DECLARE M INT;
  SET M = N - 1;
  RETURN (
    SELECT DISTINCT Salary FROM Employee
    ORDER BY Salary DESC LIMIT 1 OFFSET M
  );
END',
    '200 (for N=2)',
    'Returns the 2nd highest salary after sorting descending.',
    'Create SQL function to find Nth highest salary.',
    '["Write SQL functions with parameters", "Use variables in SQL", "Handle dynamic LIMIT with OFFSET"]',
    'getNthHighestSalary(2) with salaries 100,200,300',
    '200',
    'Second highest salary.',
    'getNthHighestSalary(5) with only 3 salaries',
    'NULL',
    'Returns NULL when N exceeds available salaries.',
    3000, 256, false
);

-- Link SQL problems with tags
INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'second-highest-salary' AND t.slug IN ('database');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'department-top-three-salaries' AND t.slug IN ('database');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'consecutive-numbers' AND t.slug IN ('database');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'delete-duplicate-emails' AND t.slug IN ('database');

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug = 'nth-highest-salary' AND t.slug IN ('database');

-- ============================================================
-- ADD TEST CASES FOR NEW PROBLEMS
-- ============================================================

-- Test cases for Implementation problems (11-15)
INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, '3 3
1 2 3
4 5 6
7 8 9', '1 2 3 6 9 8 7 4 5', true
FROM problems p WHERE p.slug = 'spiral-matrix';

INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'GGLLGG', 'true', true
FROM problems p WHERE p.slug = 'robot-bounded-in-circle';

INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, '4 3
0 1 0
0 0 1
1 1 1
0 0 0', '0 0 0
1 0 1
0 1 1
0 1 0', true
FROM problems p WHERE p.slug = 'game-of-life';

-- Test cases for Debugging problems (16-20)
INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'Fix: mid = left + (right - left) / 2', 'Correct', true
FROM problems p WHERE p.slug = 'fix-binary-search-bug';

INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'Add: prev = current before current = next', 'Correct', true
FROM problems p WHERE p.slug = 'fix-infinite-loop';

-- Test cases for System Design problems (21-25) - Simplified
INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'ENCODE https://example.com/long', 'http://tiny.url/abc123', true
FROM problems p WHERE p.slug = 'design-url-shortener';

INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, '2
PUT 1 1
GET 1', '1', true
FROM problems p WHERE p.slug = 'design-lru-cache';

-- Test cases for OOP problems (26-30) - Conceptual
INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'GET_INSTANCE twice', 'Same instance both times', true
FROM problems p WHERE p.slug = 'implement-singleton-pattern';

INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'CREATE CIRCLE 5', 'Area: 78.54', true
FROM problems p WHERE p.slug = 'implement-factory-pattern';

-- Test cases for SQL problems (31-35) - Query results
INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT 1 OFFSET 1', '200', true
FROM problems p WHERE p.slug = 'second-highest-salary';

INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
SELECT p.id, 'DELETE p1 FROM Person p1, Person p2 WHERE p1.Email = p2.Email AND p1.Id > p2.Id', '1 row deleted', true
FROM problems p WHERE p.slug = 'delete-duplicate-emails';
