// Deterministic mock progress percentage per course, stable across renders.
export function progressForCourse(courseId) {
  let hash = 0
  for (const char of courseId) hash = (hash * 31 + char.charCodeAt(0)) % 97
  return 25 + (hash % 65)
}
