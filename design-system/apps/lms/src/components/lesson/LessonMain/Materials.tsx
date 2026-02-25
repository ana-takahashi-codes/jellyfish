import { Icon } from '@jellyfish-ds/ui/icon'
import type { Material, MaterialType } from '@/types/lesson'

const materialIconMap: Record<MaterialType, string> = {
  pdf: 'file-type-pdf',
  doc: 'file-type-doc',
  spreadsheet: 'file-type-xls',
  image: 'file-type-jpg',
  archive: 'file-zip',
  other: 'file',
}

const materialFillMap: Record<MaterialType, string> = {
  pdf: 'critical',
  doc: 'brand-primary',
  spreadsheet: 'positive',
  image: 'accent',
  archive: 'warning',
  other: 'muted',
}

interface MaterialsProps {
  materials: Material[]
}

export function Materials({ materials }: MaterialsProps) {
  if (materials.length === 0) return null

  return (
    <section className="materials" aria-labelledby="materials-heading">
      <h3 className="materials__title" id="materials-heading">
        Materiais de apoio
      </h3>
      <ul className="materials__list" role="list">
        {materials.map((material) => (
          <li key={material.id}>
            <a
              href={material.url}
              download
              className="materials__item"
              aria-label={`Baixar ${material.title}${material.size ? ` (${material.size})` : ''}`}
            >
              <span className={`materials__item-icon materials__item-icon--${material.type}`}>
                <Icon
                  name={materialIconMap[material.type]}
                  size="sm"
                  fill={materialFillMap[material.type] as Parameters<typeof Icon>[0]['fill']}
                  decorative
                />
              </span>
              <span className="materials__item-info">
                <span className="materials__item-name">{material.title}</span>
                {material.size && (
                  <span className="materials__item-size">{material.size}</span>
                )}
              </span>
              <span className="materials__item-download">
                <Icon name="download" size="sm" fill="muted" decorative />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
