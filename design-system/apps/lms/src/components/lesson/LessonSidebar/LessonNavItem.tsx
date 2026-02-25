'use client'

import { Icon } from '@jellyfish-ds/ui/icon'
import type { Lesson } from '@/types/lesson'

interface LessonNavItemProps {
  lesson: Lesson
  courseSlug: string
  isActive: boolean
  onSelect: (lesson: Lesson) => void
}

function StatusIndicator({ status }: { status: Lesson['status'] }) {
  if (status === 'completed') {
    return (
      <span
        className="lesson-nav-item__indicator lesson-nav-item__indicator--completed"
        aria-label="Lição concluída"
      >
        <Icon name="check" size="xs" fill="on-brand-primary" decorative />
      </span>
    )
  }

  if (status === 'current') {
    return (
      <span
        className="lesson-nav-item__indicator lesson-nav-item__indicator--current"
        aria-label="Lição atual"
      >
        <Icon name="player-play" size="xs" fill="on-brand-primary" decorative />
      </span>
    )
  }

  return (
    <span
      className="lesson-nav-item__indicator lesson-nav-item__indicator--upcoming"
      aria-label="Lição pendente"
    />
  )
}

export function LessonNavItem({ lesson, isActive, onSelect }: LessonNavItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(lesson)}
      className={[
        'lesson-nav-item',
        isActive ? 'lesson-nav-item--current' : '',
        lesson.status === 'completed' ? 'lesson-nav-item--completed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-current={isActive ? 'page' : undefined}
    >
      <StatusIndicator status={isActive ? 'current' : lesson.status} />
      <span className="lesson-nav-item__content">
        <span className="lesson-nav-item__title">{lesson.title}</span>
        <span className="lesson-nav-item__duration">{lesson.duration}</span>
      </span>
    </button>
  )
}
