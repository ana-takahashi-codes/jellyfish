import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LessonPage } from '@/components/lesson/LessonPage'
import { findLesson } from '@/lib/mock-data'

interface PageProps {
  params: {
    courseSlug: string
    lessonSlug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = findLesson(params.courseSlug, params.lessonSlug)
  if (!result) return { title: 'Aula não encontrada' }

  return {
    title: `${result.lesson.title} — ${result.course.title}`,
    description: result.lesson.description?.trim().slice(0, 160),
  }
}

export default function LicaoPage({ params }: PageProps) {
  const result = findLesson(params.courseSlug, params.lessonSlug)

  if (!result) notFound()

  const { course, module, lesson, nextLesson, prevLesson } = result

  return (
    <LessonPage
      course={course}
      initialModule={module}
      initialLesson={lesson}
      initialNextLesson={nextLesson}
      initialPrevLesson={prevLesson}
    />
  )
}
