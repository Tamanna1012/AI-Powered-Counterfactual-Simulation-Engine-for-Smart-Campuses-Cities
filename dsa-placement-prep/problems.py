"""Curated problem list. Each topic: (week, topic, prerequisites, [problems]).

Problem tuple: (title, platform, slug, difficulty, concept, priority)
  platform "LC" -> https://leetcode.com/problems/<slug>/
  platform "HR" -> https://www.hackerrank.com/challenges/<slug>/problem
  priority: E = essential, R = recommended, O = optional

Links are built from each platform's standard URL pattern. They could not be
opened from the environment this list was written in, so click each link once
and fix any that moved (see README, "Verify before you trust").
"""

LC, HR = "LC", "HR"

TOPICS = [
    (1, "Programming fundamentals & Big-O", "Python basics", [
        ("Solve Me First", HR, "solve-me-first", "Easy", "I/O and submission workflow", "E"),
        ("Simple Array Sum", HR, "simple-array-sum", "Easy", "Loops, arrays", "E"),
        ("Compare the Triplets", HR, "compare-the-triplets", "Easy", "Conditionals, indexing", "R"),
        ("A Very Big Sum", HR, "a-very-big-sum", "Easy", "Integers, accumulation", "R"),
        ("Diagonal Difference", HR, "diagonal-difference", "Easy", "2D arrays", "R"),
        ("Plus Minus", HR, "plus-minus", "Easy", "Counting, formatting", "R"),
        ("Staircase", HR, "staircase", "Easy", "Nested loops, strings", "R"),
        ("Mini-Max Sum", HR, "mini-max-sum", "Easy", "Sum/min/max", "R"),
        ("Birthday Cake Candles", HR, "birthday-cake-candles", "Easy", "Max and counting", "O"),
        ("Time Conversion", HR, "time-conversion", "Easy", "String parsing", "O"),
        ("FizzBuzz", LC, "fizz-buzz", "Easy", "Loops, modulo", "E"),
        ("Running Sum of 1d Array", LC, "running-sum-of-1d-array", "Easy", "Prefix idea", "E"),
    ]),
    (1, "Arrays & strings", "Loops, indexing", [
        ("Contains Duplicate", LC, "contains-duplicate", "Easy", "Set membership", "E"),
        ("Best Time to Buy and Sell Stock", LC, "best-time-to-buy-and-sell-stock", "Easy", "One-pass min tracking", "E"),
        ("Maximum Subarray", LC, "maximum-subarray", "Medium", "Kadane's algorithm", "E"),
        ("Move Zeroes", LC, "move-zeroes", "Easy", "In-place array writes", "E"),
        ("Remove Duplicates from Sorted Array", LC, "remove-duplicates-from-sorted-array", "Easy", "In-place read/write pointers", "R"),
        ("Merge Sorted Array", LC, "merge-sorted-array", "Easy", "Merge from the back", "R"),
        ("Plus One", LC, "plus-one", "Easy", "Carry handling", "R"),
        ("Rotate Array", LC, "rotate-array", "Medium", "Reversal trick", "R"),
        ("Majority Element", LC, "majority-element", "Easy", "Boyer-Moore voting", "R"),
        ("Reverse String", LC, "reverse-string", "Easy", "In-place reversal", "E"),
        ("Valid Palindrome", LC, "valid-palindrome", "Easy", "Two-ended scan, cleaning input", "E"),
        ("Longest Common Prefix", LC, "longest-common-prefix", "Easy", "String comparison", "R"),
        ("Roman to Integer", LC, "roman-to-integer", "Easy", "Mapping, lookahead", "O"),
        ("Product of Array Except Self", LC, "product-of-array-except-self", "Medium", "Prefix/suffix products", "E"),
    ]),
    (2, "Hashing & frequency counting", "Arrays, strings", [
        ("Two Sum", LC, "two-sum", "Easy", "Hash map complement lookup", "E"),
        ("Valid Anagram", LC, "valid-anagram", "Easy", "Frequency counting", "E"),
        ("Ransom Note", LC, "ransom-note", "Easy", "Frequency counting", "R"),
        ("First Unique Character in a String", LC, "first-unique-character-in-a-string", "Easy", "Two-pass counting", "R"),
        ("Isomorphic Strings", LC, "isomorphic-strings", "Easy", "Bijective mapping", "R"),
        ("Single Number", LC, "single-number", "Easy", "Hash set / XOR", "E"),
        ("Missing Number", LC, "missing-number", "Easy", "Sum / XOR / set", "R"),
        ("Group Anagrams", LC, "group-anagrams", "Medium", "Canonical key hashing", "E"),
        ("Top K Frequent Elements", LC, "top-k-frequent-elements", "Medium", "Counter + bucket/heap", "E"),
        ("Longest Consecutive Sequence", LC, "longest-consecutive-sequence", "Medium", "Set-based O(n)", "E"),
        ("Subarray Sum Equals K", LC, "subarray-sum-equals-k", "Medium", "Prefix sum + hash map", "E"),
        ("Contains Duplicate II", LC, "contains-duplicate-ii", "Easy", "Index map", "O"),
        ("Happy Number", LC, "happy-number", "Easy", "Cycle detection with set", "O"),
        ("Lonely Integer", HR, "lonely-integer", "Easy", "XOR / counting", "O"),
        ("Two Strings", HR, "two-strings", "Easy", "Set intersection", "O"),
        ("Sparse Arrays", HR, "sparse-arrays", "Medium", "Frequency map queries", "O"),
        ("Sherlock and Anagrams", HR, "sherlock-and-anagrams", "Medium", "Substring signature counting", "O"),
    ]),
    (2, "Two pointers", "Arrays, sorting basics", [
        ("Two Sum II - Input Array Is Sorted", LC, "two-sum-ii-input-array-is-sorted", "Medium", "Converging pointers", "E"),
        ("Valid Palindrome II", LC, "valid-palindrome-ii", "Easy", "Two pointers with one skip", "R"),
        ("3Sum", LC, "3sum", "Medium", "Sort + two pointers, dedupe", "E"),
        ("Container With Most Water", LC, "container-with-most-water", "Medium", "Greedy pointer move", "E"),
        ("Trapping Rain Water", LC, "trapping-rain-water", "Hard", "Two-pointer max tracking", "R"),
    ]),
    (3, "Sliding window", "Two pointers, hashing", [
        ("Maximum Average Subarray I", LC, "maximum-average-subarray-i", "Easy", "Fixed window", "E"),
        ("Longest Substring Without Repeating Characters", LC, "longest-substring-without-repeating-characters", "Medium", "Variable window + set/map", "E"),
        ("Minimum Size Subarray Sum", LC, "minimum-size-subarray-sum", "Medium", "Shrinking window", "E"),
        ("Longest Repeating Character Replacement", LC, "longest-repeating-character-replacement", "Medium", "Window validity condition", "R"),
        ("Permutation in String", LC, "permutation-in-string", "Medium", "Fixed window + frequency compare", "R"),
        ("Minimum Window Substring", LC, "minimum-window-substring", "Hard", "Window with need/have counts", "O"),
        ("Sliding Window Maximum", LC, "sliding-window-maximum", "Hard", "Monotonic deque", "O"),
    ]),
    (3, "Sorting & binary search", "Arrays, loops, invariants", [
        ("Binary Search", LC, "binary-search", "Easy", "Classic template", "E"),
        ("Search Insert Position", LC, "search-insert-position", "Easy", "Lower bound", "E"),
        ("First Bad Version", LC, "first-bad-version", "Easy", "Binary search on predicate", "R"),
        ("Sqrt(x)", LC, "sqrtx", "Easy", "Binary search on answer", "R"),
        ("Find First and Last Position of Element in Sorted Array", LC, "find-first-and-last-position-of-element-in-sorted-array", "Medium", "Lower/upper bound", "E"),
        ("Search in Rotated Sorted Array", LC, "search-in-rotated-sorted-array", "Medium", "Binary search on rotated array", "E"),
        ("Find Minimum in Rotated Sorted Array", LC, "find-minimum-in-rotated-sorted-array", "Medium", "Pivot finding", "E"),
        ("Search a 2D Matrix", LC, "search-a-2d-matrix", "Medium", "Binary search on flattened index", "R"),
        ("Koko Eating Bananas", LC, "koko-eating-bananas", "Medium", "Binary search on answer", "E"),
        ("Sort Colors", LC, "sort-colors", "Medium", "Dutch national flag", "E"),
        ("Merge Intervals", LC, "merge-intervals", "Medium", "Sort then sweep", "E"),
        ("Kth Largest Element in an Array", LC, "kth-largest-element-in-an-array", "Medium", "Heap / quickselect", "R"),
    ]),
    (4, "Prefix sums, math & matrices", "Arrays", [
        ("Palindrome Number", LC, "palindrome-number", "Easy", "Digit manipulation", "R"),
        ("Reverse Integer", LC, "reverse-integer", "Medium", "Overflow-aware digits", "R"),
        ("Count Primes", LC, "count-primes", "Medium", "Sieve of Eratosthenes", "E"),
        ("Power of Two", LC, "power-of-two", "Easy", "Math / bit trick", "O"),
        ("Pow(x, n)", LC, "powx-n", "Medium", "Fast exponentiation", "R"),
        ("Rotate Image", LC, "rotate-image", "Medium", "Matrix transpose + reverse", "E"),
        ("Spiral Matrix", LC, "spiral-matrix", "Medium", "Boundary simulation", "E"),
        ("Set Matrix Zeroes", LC, "set-matrix-zeroes", "Medium", "In-place markers", "R"),
        ("Valid Sudoku", LC, "valid-sudoku", "Medium", "Hash sets on grids", "R"),
        ("Insert Interval", LC, "insert-interval", "Medium", "Interval merging", "R"),
    ]),
    (4, "Bit manipulation", "Binary numbers", [
        ("Number of 1 Bits", LC, "number-of-1-bits", "Easy", "Bit counting", "E"),
        ("Counting Bits", LC, "counting-bits", "Easy", "DP on bits", "R"),
        ("Reverse Bits", LC, "reverse-bits", "Easy", "Shifting", "O"),
        ("Sum of Two Integers", LC, "sum-of-two-integers", "Medium", "Bitwise addition", "O"),
    ]),
    (4, "Recursion & backtracking", "Arrays, call stack", [
        ("Fibonacci Number", LC, "fibonacci-number", "Easy", "Recursion base cases", "E"),
        ("Subsets", LC, "subsets", "Medium", "Include/exclude choice", "E"),
        ("Permutations", LC, "permutations", "Medium", "Used-array backtracking", "E"),
        ("Combination Sum", LC, "combination-sum", "Medium", "Reuse with start index", "E"),
        ("Letter Combinations of a Phone Number", LC, "letter-combinations-of-a-phone-number", "Medium", "Cartesian backtracking", "R"),
        ("Generate Parentheses", LC, "generate-parentheses", "Medium", "Constrained generation", "E"),
        ("Word Search", LC, "word-search", "Medium", "Grid DFS + backtrack", "R"),
        ("Palindrome Partitioning", LC, "palindrome-partitioning", "Medium", "Partition backtracking", "O"),
    ]),
    (5, "Linked lists", "Pointers/references, recursion", [
        ("Reverse Linked List", LC, "reverse-linked-list", "Easy", "Pointer reversal", "E"),
        ("Merge Two Sorted Lists", LC, "merge-two-sorted-lists", "Easy", "Dummy node merge", "E"),
        ("Linked List Cycle", LC, "linked-list-cycle", "Easy", "Fast/slow pointers", "E"),
        ("Middle of the Linked List", LC, "middle-of-the-linked-list", "Easy", "Fast/slow pointers", "E"),
        ("Remove Linked List Elements", LC, "remove-linked-list-elements", "Easy", "Dummy node deletion", "R"),
        ("Palindrome Linked List", LC, "palindrome-linked-list", "Easy", "Middle + reverse", "R"),
        ("Intersection of Two Linked Lists", LC, "intersection-of-two-linked-lists", "Easy", "Pointer switching", "R"),
        ("Remove Nth Node From End of List", LC, "remove-nth-node-from-end-of-list", "Medium", "Gap pointers", "E"),
        ("Linked List Cycle II", LC, "linked-list-cycle-ii", "Medium", "Floyd cycle start", "R"),
        ("Add Two Numbers", LC, "add-two-numbers", "Medium", "Carry on lists", "E"),
        ("Reorder List", LC, "reorder-list", "Medium", "Split, reverse, merge", "R"),
        ("LRU Cache", LC, "lru-cache", "Medium", "Hash map + doubly linked list", "E"),
        ("Merge two sorted linked lists", HR, "merge-two-sorted-linked-lists", "Easy", "Merge pattern (HackerRank variant)", "O"),
    ]),
    (5, "Stacks & queues", "Arrays, linked lists", [
        ("Valid Parentheses", LC, "valid-parentheses", "Easy", "Stack matching", "E"),
        ("Min Stack", LC, "min-stack", "Medium", "Auxiliary stack", "E"),
        ("Implement Queue using Stacks", LC, "implement-queue-using-stacks", "Easy", "Two-stack queue", "R"),
        ("Next Greater Element I", LC, "next-greater-element-i", "Easy", "Monotonic stack", "R"),
        ("Evaluate Reverse Polish Notation", LC, "evaluate-reverse-polish-notation", "Medium", "Stack evaluation", "R"),
        ("Daily Temperatures", LC, "daily-temperatures", "Medium", "Monotonic stack", "E"),
        ("Largest Rectangle in Histogram", LC, "largest-rectangle-in-histogram", "Hard", "Monotonic stack", "O"),
        ("Balanced Brackets", HR, "balanced-brackets", "Medium", "Stack matching (HackerRank)", "O"),
        ("Queues: A Tale of Two Stacks", HR, "ctci-queue-using-two-stacks", "Hard", "Queue via stacks", "O"),
    ]),
    (6, "Trees & binary search trees", "Recursion, queues", [
        ("Maximum Depth of Binary Tree", LC, "maximum-depth-of-binary-tree", "Easy", "DFS recursion", "E"),
        ("Invert Binary Tree", LC, "invert-binary-tree", "Easy", "Recursive swap", "E"),
        ("Same Tree", LC, "same-tree", "Easy", "Parallel traversal", "E"),
        ("Symmetric Tree", LC, "symmetric-tree", "Easy", "Mirror recursion", "R"),
        ("Binary Tree Inorder Traversal", LC, "binary-tree-inorder-traversal", "Easy", "Recursive + iterative inorder", "E"),
        ("Binary Tree Level Order Traversal", LC, "binary-tree-level-order-traversal", "Medium", "BFS by level", "E"),
        ("Subtree of Another Tree", LC, "subtree-of-another-tree", "Easy", "Tree matching", "R"),
        ("Diameter of Binary Tree", LC, "diameter-of-binary-tree", "Easy", "Height + global max", "E"),
        ("Balanced Binary Tree", LC, "balanced-binary-tree", "Easy", "Height with early exit", "R"),
        ("Path Sum", LC, "path-sum", "Easy", "Root-to-leaf DFS", "R"),
        ("Binary Tree Right Side View", LC, "binary-tree-right-side-view", "Medium", "BFS last node per level", "R"),
        ("Lowest Common Ancestor of a Binary Search Tree", LC, "lowest-common-ancestor-of-a-binary-search-tree", "Medium", "BST property", "E"),
        ("Lowest Common Ancestor of a Binary Tree", LC, "lowest-common-ancestor-of-a-binary-tree", "Medium", "Postorder return values", "E"),
        ("Validate Binary Search Tree", LC, "validate-binary-search-tree", "Medium", "Range bounds", "E"),
        ("Kth Smallest Element in a BST", LC, "kth-smallest-element-in-a-bst", "Medium", "Inorder traversal", "E"),
        ("Convert Sorted Array to Binary Search Tree", LC, "convert-sorted-array-to-binary-search-tree", "Easy", "Divide and conquer", "R"),
        ("Construct Binary Tree from Preorder and Inorder Traversal", LC, "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium", "Tree reconstruction", "R"),
        ("Binary Tree Maximum Path Sum", LC, "binary-tree-maximum-path-sum", "Hard", "Postorder gain tracking", "O"),
    ]),
    (7, "Heaps & priority queues", "Trees, sorting", [
        ("Last Stone Weight", LC, "last-stone-weight", "Easy", "Max-heap simulation", "E"),
        ("Kth Largest Element in a Stream", LC, "kth-largest-element-in-a-stream", "Easy", "Size-k min-heap", "E"),
        ("K Closest Points to Origin", LC, "k-closest-points-to-origin", "Medium", "Heap with custom key", "E"),
        ("Task Scheduler", LC, "task-scheduler", "Medium", "Greedy + counting / heap", "R"),
        ("Merge k Sorted Lists", LC, "merge-k-sorted-lists", "Hard", "Heap of list heads", "R"),
        ("Find Median from Data Stream", LC, "find-median-from-data-stream", "Hard", "Two heaps", "R"),
        ("Jesse and Cookies", HR, "jesse-and-cookies", "Easy", "Min-heap simulation", "O"),
    ]),
    (7, "Greedy algorithms & intervals", "Sorting", [
        ("Assign Cookies", LC, "assign-cookies", "Easy", "Sort + greedy match", "E"),
        ("Jump Game", LC, "jump-game", "Medium", "Reachability greedy", "E"),
        ("Jump Game II", LC, "jump-game-ii", "Medium", "Greedy BFS levels", "R"),
        ("Gas Station", LC, "gas-station", "Medium", "Running-surplus greedy", "R"),
        ("Non-overlapping Intervals", LC, "non-overlapping-intervals", "Medium", "Sort by end", "E"),
        ("Partition Labels", LC, "partition-labels", "Medium", "Last occurrence greedy", "R"),
        ("Climbing the Leaderboard", HR, "climbing-the-leaderboard", "Medium", "Dedupe + binary search/pointer", "O"),
    ]),
    (8, "Graphs: BFS, DFS & shortest paths", "Trees, queues, hashing", [
        ("Flood Fill", LC, "flood-fill", "Easy", "Grid DFS/BFS", "E"),
        ("Find if Path Exists in Graph", LC, "find-if-path-exists-in-graph", "Easy", "Graph traversal / union-find", "R"),
        ("Number of Islands", LC, "number-of-islands", "Medium", "Connected components on grid", "E"),
        ("Max Area of Island", LC, "max-area-of-island", "Medium", "DFS with counting", "R"),
        ("Number of Provinces", LC, "number-of-provinces", "Medium", "Components on adjacency matrix", "R"),
        ("Clone Graph", LC, "clone-graph", "Medium", "Graph traversal with map", "E"),
        ("Rotting Oranges", LC, "rotting-oranges", "Medium", "Multi-source BFS", "E"),
        ("Pacific Atlantic Water Flow", LC, "pacific-atlantic-water-flow", "Medium", "Reverse multi-source DFS", "O"),
        ("Surrounded Regions", LC, "surrounded-regions", "Medium", "Border DFS", "O"),
        ("Course Schedule", LC, "course-schedule", "Medium", "Cycle detection / topo sort", "E"),
        ("Course Schedule II", LC, "course-schedule-ii", "Medium", "Topological ordering", "E"),
        ("Is Graph Bipartite?", LC, "is-graph-bipartite", "Medium", "BFS/DFS colouring", "R"),
        ("Word Ladder", LC, "word-ladder", "Hard", "BFS on implicit graph", "R"),
        ("Network Delay Time", LC, "network-delay-time", "Medium", "Dijkstra", "E"),
        ("Cheapest Flights Within K Stops", LC, "cheapest-flights-within-k-stops", "Medium", "Bellman-Ford / BFS levels", "O"),
        ("Roads and Libraries", HR, "torque-and-development", "Medium", "Graph components + cost", "O"),
    ]),
    (9, "Dynamic programming", "Recursion, hashing, arrays", [
        ("Climbing Stairs", LC, "climbing-stairs", "Easy", "1-D DP basics", "E"),
        ("Min Cost Climbing Stairs", LC, "min-cost-climbing-stairs", "Easy", "1-D DP with cost", "R"),
        ("House Robber", LC, "house-robber", "Medium", "Take/skip DP", "E"),
        ("House Robber II", LC, "house-robber-ii", "Medium", "Circular DP", "R"),
        ("Coin Change", LC, "coin-change", "Medium", "Unbounded knapsack", "E"),
        ("Longest Increasing Subsequence", LC, "longest-increasing-subsequence", "Medium", "O(n^2) DP / patience sort", "E"),
        ("Unique Paths", LC, "unique-paths", "Medium", "Grid DP", "E"),
        ("Minimum Path Sum", LC, "minimum-path-sum", "Medium", "Grid DP", "R"),
        ("Decode Ways", LC, "decode-ways", "Medium", "String DP", "R"),
        ("Word Break", LC, "word-break", "Medium", "Prefix DP", "E"),
        ("Maximum Product Subarray", LC, "maximum-product-subarray", "Medium", "Track min and max", "R"),
        ("Longest Common Subsequence", LC, "longest-common-subsequence", "Medium", "2-D string DP", "E"),
        ("Partition Equal Subset Sum", LC, "partition-equal-subset-sum", "Medium", "0/1 knapsack", "E"),
        ("Target Sum", LC, "target-sum", "Medium", "Subset-sum count", "O"),
        ("Longest Palindromic Substring", LC, "longest-palindromic-substring", "Medium", "Expand around centre", "E"),
        ("Palindromic Substrings", LC, "palindromic-substrings", "Medium", "Expand around centre", "R"),
        ("Edit Distance", LC, "edit-distance", "Medium", "2-D string DP", "R"),
    ]),
    (10, "Tries & advanced structures", "Trees, hashing", [
        ("Implement Trie (Prefix Tree)", LC, "implement-trie-prefix-tree", "Medium", "Trie insert/search", "E"),
        ("Design Add and Search Words Data Structure", LC, "design-add-and-search-words-data-structure", "Medium", "Trie + wildcard DFS", "R"),
        ("Word Search II", LC, "word-search-ii", "Hard", "Trie + grid backtracking", "O"),
    ]),
]


def url(platform, slug):
    if platform == "LC":
        return f"https://leetcode.com/problems/{slug}/"
    return f"https://www.hackerrank.com/challenges/{slug}/problem"


def flat():
    """Return problems in recommended order with order numbers."""
    rows, n = [], 0
    for week, topic, prereq, probs in TOPICS:
        for title, plat, slug, diff, concept, prio in probs:
            n += 1
            rows.append(dict(
                n=n, week=week, topic=topic, prereq=prereq, title=title,
                platform={"LC": "LeetCode", "HR": "HackerRank"}[plat],
                url=url(plat, slug), diff=diff, concept=concept,
                prio={"E": "Essential", "R": "Recommended", "O": "Optional"}[prio],
            ))
    return rows


if __name__ == "__main__":
    r = flat()
    from collections import Counter
    print(len(r), Counter(x["prio"] for x in r), Counter(x["diff"] for x in r),
          Counter(x["platform"] for x in r))
    seen = Counter(x["title"] for x in r)
    print([t for t, c in seen.items() if c > 1])
