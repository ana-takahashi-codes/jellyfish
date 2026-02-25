import { redirect } from 'next/navigation'
import { mockCourse } from '@/lib/mock-data'

export default function HomePage() {
  // Temporary redirect to the demo course
  const firstLesson = mockCourse.modules[0]?.lessons[0]
  if (firstLesson) {
    redirect(`/cursos/${mockCourse.slug}/licoes/${firstLesson.slug}`)
  }
  return null
}
