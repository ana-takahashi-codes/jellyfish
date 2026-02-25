'use client'

import { Button } from '@jellyfish-ds/ui/button'
import { Icon } from '@jellyfish-ds/ui/icon'
import { VideoPlayer } from './VideoPlayer'
import { LessonDescription } from './LessonDescription'
import { UsefulLinks } from './UsefulLinks'
import { Materials } from './Materials'
import type { Lesson, Course, CourseModule } from '@/types/lesson'

interface NextLessonInfo {
  moduleTitle: string
  lesson: Lesson
}

interface PrevLessonInfo {
  lesson: Lesson
}

interface LessonMainProps {
  course: Course
  module: CourseModule
  lesson: Lesson
  nextLesson: NextLessonInfo | null
  prevLesson: PrevLessonInfo | null
  onNextLesson: () => void
  onPrevLesson: () => void
}

export function LessonMain({
  course,
  module,
  lesson,
  nextLesson,
  prevLesson,
  onNextLesson,
  onPrevLesson,
}: LessonMainProps) {
  return (
    <main className="lesson-main" id="main-content">
      {/* Video — flush to top */}
      <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />

      <div className="lesson-main__inner">
        {/* Lesson header */}
        <header className="lesson-header">
          <div className="lesson-header__breadcrumb" aria-label="Navegação estrutural">
            <span className="lesson-header__breadcrumb-text">{course.title}</span>
            <span className="lesson-header__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="lesson-header__breadcrumb-text">{module.title}</span>
          </div>
          <h1 className="lesson-header__title">{lesson.title}</h1>
          <div className="lesson-header__meta">
            <span className="lesson-header__meta-item">
              <Icon name="clock" size="xs" fill="muted" decorative />
              {lesson.duration}
            </span>
            {lesson.status === 'completed' && (
              <span className="lesson-header__meta-item" style={{ color: 'var(--jf-color-positive-600)' }}>
                <Icon name="circle-check" size="xs" fill="positive" decorative />
                Concluída
              </span>
            )}
          </div>
        </header>

        {/* Description */}
        {lesson.description && (
          <LessonDescription description={lesson.description} />
        )}

        {/* Useful Links */}
        {lesson.links && lesson.links.length > 0 && (
          <UsefulLinks links={lesson.links} />
        )}

        {/* Materials */}
        {lesson.materials && lesson.materials.length > 0 && (
          <Materials materials={lesson.materials} />
        )}

        {/* Navigation footer */}
        <footer className="lesson-footer">
          <div className="lesson-footer__prev">
            {prevLesson && (
              <Button
                variant="ghost"
                color="neutral"
                size="md"
                startIcon="arrow-left"
                onClick={onPrevLesson}
              >
                Aula anterior
              </Button>
            )}
          </div>

          <div className="lesson-footer__next">
            {nextLesson ? (
              <>
                <span className="lesson-footer__next-label">Próxima aula</span>
                <span className="lesson-footer__next-title" title={nextLesson.lesson.title}>
                  {nextLesson.lesson.title}
                </span>
                <Button
                  variant="solid"
                  color="brand-primary"
                  size="md"
                  endIcon="arrow-right"
                  onClick={onNextLesson}
                  style={{ marginTop: 8 }}
                >
                  Avançar e concluir
                </Button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span className="lesson-footer__next-label">Você chegou ao fim do curso!</span>
                <Button
                  variant="solid"
                  color="positive"
                  size="md"
                  startIcon="trophy"
                  onClick={onNextLesson}
                >
                  Concluir curso
                </Button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </main>
  )
}
