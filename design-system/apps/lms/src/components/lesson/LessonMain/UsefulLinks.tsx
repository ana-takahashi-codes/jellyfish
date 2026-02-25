import { Icon } from '@jellyfish-ds/ui/icon'
import type { UsefulLink } from '@/types/lesson'

interface UsefulLinksProps {
  links: UsefulLink[]
}

export function UsefulLinks({ links }: UsefulLinksProps) {
  if (links.length === 0) return null

  return (
    <section className="useful-links" aria-labelledby="links-heading">
      <h3 className="useful-links__title" id="links-heading">
        Links úteis
      </h3>
      <ul className="useful-links__list" role="list">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="useful-links__item"
            >
              <span className="useful-links__item-icon">
                <Icon name="link" size="sm" fill="brand-primary" decorative />
              </span>
              <span className="useful-links__item-content">
                <span className="useful-links__item-title">{link.title}</span>
                {link.description && (
                  <span className="useful-links__item-desc">{link.description}</span>
                )}
              </span>
              <span className="useful-links__item-arrow">
                <Icon name="external-link" size="sm" fill="muted" decorative />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
