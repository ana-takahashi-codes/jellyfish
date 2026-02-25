'use client'

import { useState } from 'react'
import { Icon } from '@jellyfish-ds/ui/icon'
import { LessonNavItem } from './LessonNavItem'
import type { CourseModule, Lesson } from '@/types/lesson'

interface ModuleSectionProps {
  module: CourseModule
  courseSlug: string
  activeLessonId: string
  onLessonSelect: (lesson: Lesson) => void
}

export function ModuleSection({
  module,
  courseSlug,
  activeLessonId,
  onLessonSelect,
}: ModuleSectionProps) {
  const hasActive = module.lessons.some((l) => l.id === activeLessonId)
  const [isOpen, setIsOpen] = useState(true)

  const completedCount = module.lessons.filter((l) => l.status === 'completed').length

  return (
    <div className="module-section">
      <button
        type="button"
        className="module-section__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="module-section__title">{module.title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="module-section__count">
            {completedCount}/{module.lessons.length}
          </span>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size="xs"
            fill="muted"
            decorative
          />
        </span>
      </button>

      {isOpen && (
        <div className="module-section__lessons" role="list">
          {module.lessons.map((lesson) => (
            <div role="listitem" key={lesson.id}>
              <LessonNavItem
                lesson={lesson}
                courseSlug={courseSlug}
                isActive={lesson.id === activeLessonId}
                onSelect={onLessonSelect}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
