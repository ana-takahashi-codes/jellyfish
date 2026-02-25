import { redirect } from 'next/navigation'
import { mockCourse } from '@/lib/mock-data'

interface PageProps {
  params: { courseSlug: string }
}

export default function CoursePage({ params }: PageProps) {
  // Redirect to the current (or first) lesson
  const course = mockCourse
  if (course.slug !== params.courseSlug) {
    redirect('/cursos')
  }

  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.status === 'current') {
        redirect(`/cursos/${course.slug}/licoes/${lesson.slug}`)
      }
    }
  }

  // Fallback: redirect to first lesson
  const firstLesson = course.modules[0]?.lessons[0]
  if (firstLesson) {
    redirect(`/cursos/${course.slug}/licoes/${firstLesson.slug}`)
  }

  redirect('/cursos')
}
