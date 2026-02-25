interface LessonDescriptionProps {
  description: string
}

export function LessonDescription({ description }: LessonDescriptionProps) {
  return (
    <section className="lesson-description" aria-labelledby="desc-heading">
      <h3 className="lesson-description__title" id="desc-heading">
        Sobre esta aula
      </h3>
      <p className="lesson-description__body">{description.trim()}</p>
    </section>
  )
}
