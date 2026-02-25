'use client'

import { useState, useCallback } from 'react'
import { LessonSidebar } from './LessonSidebar'
import { LessonMain } from './LessonMain'
import type { Course, CourseModule, Lesson } from '@/types/lesson'
import { getLessonProgress } from '@/lib/mock-data'

interface NextLessonInfo {
  moduleTitle: string
  lesson: Lesson
}

interface PrevLessonInfo {
  lesson: Lesson
}

interface LessonPageProps {
  course: Course
  initialModule: CourseModule
  initialLesson: Lesson
  initialNextLesson: NextLessonInfo | null
  initialPrevLesson: PrevLessonInfo | null
}

/**
 * Finds a lesson by ID across all modules and returns its context.
 */
function findLessonContext(course: Course, lessonId: string) {
  for (const module of course.modules) {
    const idx = module.lessons.findIndex((l) => l.id === lessonId)
    if (idx === -1) continue

    const lesson = module.lessons[idx]

    let nextLesson: NextLessonInfo | null = null
    if (idx < module.lessons.length - 1) {
      nextLesson = { moduleTitle: module.title, lesson: module.lessons[idx + 1] }
    } else {
      const modIdx = course.modules.indexOf(module)
      const nextModule = course.modules[modIdx + 1]
      if (nextModule?.lessons.length) {
        nextLesson = { moduleTitle: nextModule.title, lesson: nextModule.lessons[0] }
      }
    }

    let prevLesson: PrevLessonInfo | null = null
    if (idx > 0) {
      prevLesson = { lesson: module.lessons[idx - 1] }
    } else {
      const modIdx = course.modules.indexOf(module)
      const prevModule = course.modules[modIdx - 1]
      const lastLesson = prevModule?.lessons[prevModule.lessons.length - 1]
      if (lastLesson) prevLesson = { lesson: lastLesson }
    }

    return { module, lesson, nextLesson, prevLesson }
  }
  return null
}

/**
 * Returns a new course object with the given lesson marked as 'completed'.
 */
function markLessonCompleted(course: Course, lessonId: string): Course {
  return {
    ...course,
    modules: course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, status: 'completed' } : lesson
      ),
    })),
  }
}

export function LessonPage({
  course: initialCourse,
  initialModule,
  initialLesson,
  initialNextLesson,
  initialPrevLesson,
}: LessonPageProps) {
  // Local course state — allows marking lessons as completed client-side
  const [course, setCourse] = useState<Course>(initialCourse)
  const [activeLesson, setActiveLesson] = useState<Lesson>(initialLesson)
  const [activeModule, setActiveModule] = useState<CourseModule>(initialModule)
  const [nextLesson, setNextLesson] = useState<NextLessonInfo | null>(initialNextLesson)
  const [prevLesson, setPrevLesson] = useState<PrevLessonInfo | null>(initialPrevLesson)

  const progress = getLessonProgress(course)

  const handleLessonSelect = useCallback(
    (lesson: Lesson) => {
      const ctx = findLessonContext(course, lesson.id)
      if (!ctx) return
      setActiveLesson(ctx.lesson)
      setActiveModule(ctx.module)
      setNextLesson(ctx.nextLesson)
      setPrevLesson(ctx.prevLesson)
      // Scroll main content to top
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [course]
  )

  const handleNextLesson = useCallback(() => {
    if (!nextLesson) {
      // Last lesson — mark as complete
      setCourse((prev) => markLessonCompleted(prev, activeLesson.id))
      return
    }

    // Mark current lesson as complete before advancing
    const updatedCourse = markLessonCompleted(course, activeLesson.id)
    setCourse(updatedCourse)

    // Navigate to next lesson
    const ctx = findLessonContext(updatedCourse, nextLesson.lesson.id)
    if (!ctx) return
    setActiveLesson(ctx.lesson)
    setActiveModule(ctx.module)
    setNextLesson(ctx.nextLesson)
    setPrevLesson(ctx.prevLesson)

    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [course, activeLesson, nextLesson])

  const handlePrevLesson = useCallback(() => {
    if (!prevLesson) return
    const ctx = findLessonContext(course, prevLesson.lesson.id)
    if (!ctx) return
    setActiveLesson(ctx.lesson)
    setActiveModule(ctx.module)
    setNextLesson(ctx.nextLesson)
    setPrevLesson(ctx.prevLesson)
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [course, prevLesson])

  return (
    <div className="lesson-layout">
      <LessonSidebar
        course={course}
        activeLessonId={activeLesson.id}
        onLessonSelect={handleLessonSelect}
        completedCount={progress.completed}
        totalCount={progress.total}
      />
      <LessonMain
        course={course}
        module={activeModule}
        lesson={activeLesson}
        nextLesson={nextLesson}
        prevLesson={prevLesson}
        onNextLesson={handleNextLesson}
        onPrevLesson={handlePrevLesson}
      />
    </div>
  )
}
