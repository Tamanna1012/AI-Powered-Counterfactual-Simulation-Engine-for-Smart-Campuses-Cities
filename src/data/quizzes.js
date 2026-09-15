export const quizzes = [
  {
    id: 'q1',
    courseId: 'c1',
    title: 'Data Structures Fundamentals',
    questions: [
      {
        q: 'What is the time complexity of binary search on a sorted array?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        answerIndex: 1,
      },
      {
        q: 'Which data structure uses LIFO (Last In First Out) ordering?',
        options: ['Queue', 'Stack', 'Linked List', 'Graph'],
        answerIndex: 1,
      },
      {
        q: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n log n)', 'O(log n)', 'O(n)', 'O(n^2)'],
        answerIndex: 3,
      },
      {
        q: 'Which traversal visits nodes level by level in a tree?',
        options: ['Inorder', 'Preorder', 'Breadth-First Search', 'Postorder'],
        answerIndex: 2,
      },
      {
        q: 'Dynamic programming is best suited for problems with:',
        options: [
          'Overlapping subproblems & optimal substructure',
          'Purely random inputs',
          'No repeated computation',
          'Only sorting operations',
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'q2',
    courseId: 'c2',
    title: 'Web Development Basics',
    questions: [
      {
        q: 'Which HTML tag is used to link an external CSS file?',
        options: ['<style>', '<script>', '<link>', '<css>'],
        answerIndex: 2,
      },
      {
        q: 'In React, what is used to manage component state?',
        options: ['useState', 'useRoute', 'useStyle', 'useDOM'],
        answerIndex: 0,
      },
      {
        q: 'Which HTTP method is typically used to create a new resource?',
        options: ['GET', 'POST', 'DELETE', 'HEAD'],
        answerIndex: 1,
      },
      {
        q: 'What does REST stand for in RESTful APIs?',
        options: [
          'Representational State Transfer',
          'Remote State Transmission',
          'Reactive State Transfer',
          'Recorded State Template',
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'q3',
    courseId: 'c3',
    title: 'Class 10 Maths — Quick Check',
    questions: [
      {
        q: 'The HCF of two numbers is always a factor of their LCM. True or False?',
        options: ['True', 'False'],
        answerIndex: 0,
      },
      {
        q: 'How many solutions does a pair of linear equations have if the lines are parallel?',
        options: ['No solution', 'One solution', 'Infinite solutions', 'Two solutions'],
        answerIndex: 0,
      },
      {
        q: 'Two triangles are similar if their corresponding angles are:',
        options: ['Unequal', 'Equal', 'Supplementary', 'Complementary'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'q4',
    courseId: 'c4',
    title: 'JEE Physics — Mechanics Check',
    questions: [
      {
        q: 'Newton\'s second law relates force to:',
        options: ['Mass and velocity', 'Mass and acceleration', 'Distance and time', 'Energy and power'],
        answerIndex: 1,
      },
      {
        q: 'The SI unit of work done is:',
        options: ['Watt', 'Newton', 'Joule', 'Pascal'],
        answerIndex: 2,
      },
      {
        q: 'Which quantity remains constant in projectile motion (ignoring air resistance)?',
        options: ['Vertical velocity', 'Horizontal velocity', 'Total speed', 'Acceleration direction'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'q5',
    courseId: 'c5',
    title: 'Python Basics Quiz',
    questions: [
      {
        q: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'lambda'],
        answerIndex: 1,
      },
      {
        q: 'What is the output of len("Skillora")?',
        options: ['7', '8', '9', '6'],
        answerIndex: 1,
      },
      {
        q: 'Which data type is mutable in Python?',
        options: ['tuple', 'string', 'list', 'int'],
        answerIndex: 2,
      },
    ],
  },
  {
    id: 'q6',
    courseId: 'c6',
    title: 'Aptitude Quick Test',
    questions: [
      {
        q: 'If a train travels 60 km in 45 minutes, its speed is:',
        options: ['70 km/h', '80 km/h', '75 km/h', '60 km/h'],
        answerIndex: 1,
      },
      {
        q: '25% of 240 is:',
        options: ['50', '55', '60', '65'],
        answerIndex: 2,
      },
    ],
  },
]

export function getQuizByCourseId(courseId) {
  return quizzes.find((q) => q.courseId === courseId)
}
