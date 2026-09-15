const names = [
  'Aarav Shah', 'Diya Patel', 'Ishaan Gupta', 'Kavya Reddy', 'Vihaan Iyer',
  'Ananya Singh', 'Reyansh Kumar', 'Myra Joshi', 'Arjun Nair', 'Saanvi Rao',
  'Kabir Mehta', 'Aadhya Bose', 'Vivaan Chawla', 'Anika Menon', 'Advait Pillai',
]

export function studentsForCourse(courseId, count = 6) {
  let seed = 0
  for (const char of courseId) seed += char.charCodeAt(0)
  return Array.from({ length: count }).map((_, i) => {
    const name = names[(seed + i * 3) % names.length]
    const progress = 20 + ((seed + i * 17) % 75)
    return {
      id: `${courseId}-stu-${i}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      progress,
      initials: name
        .split(' ')
        .map((p) => p[0])
        .join(''),
    }
  })
}
