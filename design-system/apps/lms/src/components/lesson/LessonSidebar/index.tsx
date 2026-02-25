'use client'

import { Icon } from '@jellyfish-ds/ui/icon'
import { ModuleSection } from './ModuleSection'
import type { Course, Lesson } from '@/types/lesson'

interface LessonSidebarProps {
  course: Course
  activeLessonId: string
  onLessonSelect: (lesson: Lesson) => void
  completedCount: number
  totalCount: number
}

export function LessonSidebar({
  course,
  activeLessonId,
  onLessonSelect,
  completedCount,
  totalCount,
}: LessonSidebarProps) {
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <aside className="lesson-sidebar" aria-label="Navegação do curso">
      {/* Header */}
      <div className="lesson-sidebar__header">
        <a href="/cursos" className="lesson-sidebar__back">
          <Icon name="arrow-left" size="xs" fill="muted" decorative />
          Voltar para cursos
        </a>
        <h2 className="lesson-sidebar__course-title">{course.title}</h2>
        <div className="lesson-sidebar__progress">
          <div
            className="lesson-sidebar__progress-bar"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPercent}% do curso concluído`}
          >
            <div
              className="lesson-sidebar__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="lesson-sidebar__progress-text">
            {completedCount}/{totalCount} aulas
          </span>
        </div>
      </div>

      {/* Lesson Navigation */}
      <nav className="lesson-sidebar__nav" aria-label="Lista de aulas">
        {course.modules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            courseSlug={course.slug}
            activeLessonId={activeLessonId}
            onLessonSelect={onLessonSelect}
          />
        ))}
      </nav>
    </aside>
  )
}
