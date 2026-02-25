import type { Course } from '@/types/lesson'

export const mockCourse: Course = {
  id: '1',
  title: 'Next.js do Zero ao Deploy',
  slug: 'nextjs-do-zero-ao-deploy',
  instructor: 'Ana Takahashi',
  modules: [
    {
      id: 'm1',
      title: 'Fundamentos do Next.js',
      lessons: [
        {
          id: 'l1',
          title: 'Introdução ao Next.js e App Router',
          slug: 'introducao-ao-nextjs',
          duration: '18:42',
          status: 'completed',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: `
            Nesta aula, vamos explorar os fundamentos do Next.js 14 e entender como o App Router
            revolucionou a forma como construímos aplicações React. Você vai aprender sobre o
            sistema de roteamento baseado em arquivos, componentes de servidor e cliente, e como
            aproveitar ao máximo as novas funcionalidades do framework.
          `,
          links: [
            {
              id: 'link1',
              title: 'Documentação oficial do Next.js',
              url: 'https://nextjs.org/docs',
              description: 'Referência completa da API e guias de uso',
            },
            {
              id: 'link2',
              title: 'App Router Migration Guide',
              url: 'https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration',
              description: 'Guia para migrar do Pages Router para o App Router',
            },
          ],
          materials: [
            {
              id: 'mat1',
              title: 'Slides da Aula 01',
              url: '#',
              type: 'pdf',
              size: '2.4 MB',
            },
            {
              id: 'mat2',
              title: 'Código fonte da aula',
              url: '#',
              type: 'archive',
              size: '156 KB',
            },
          ],
        },
        {
          id: 'l2',
          title: 'Componentes de Servidor e Cliente',
          slug: 'componentes-servidor-cliente',
          duration: '24:15',
          status: 'completed',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: `
            Entenda a diferença fundamental entre Server Components e Client Components no Next.js.
            Aprenda quando usar cada tipo e como eles se complementam para criar aplicações
            performáticas e interativas.
          `,
        },
        {
          id: 'l3',
          title: 'Roteamento com App Router',
          slug: 'roteamento-app-router',
          duration: '31:08',
          status: 'current',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: `
            Mergulhe fundo no sistema de roteamento do App Router. Vamos cobrir rotas dinâmicas,
            grupos de rotas, layouts aninhados, páginas de loading e error boundaries.
            Ao final dessa aula você vai dominar completamente a estrutura de arquivos do Next.js.
          `,
          links: [
            {
              id: 'link3',
              title: 'Roteamento - Documentação',
              url: 'https://nextjs.org/docs/app/building-your-application/routing',
              description: 'Aprenda todos os conceitos de roteamento do App Router',
            },
          ],
          materials: [
            {
              id: 'mat3',
              title: 'Slides da Aula 03',
              url: '#',
              type: 'pdf',
              size: '3.1 MB',
            },
            {
              id: 'mat4',
              title: 'Diagrama de Rotas',
              url: '#',
              type: 'image',
              size: '890 KB',
            },
            {
              id: 'mat5',
              title: 'Exercícios Práticos',
              url: '#',
              type: 'doc',
              size: '245 KB',
            },
          ],
        },
        {
          id: 'l4',
          title: 'Data Fetching e Caching',
          slug: 'data-fetching-caching',
          duration: '28:33',
          status: 'upcoming',
        },
        {
          id: 'l5',
          title: 'Streaming e Suspense',
          slug: 'streaming-suspense',
          duration: '22:19',
          status: 'upcoming',
        },
      ],
    },
    {
      id: 'm2',
      title: 'Estilização e UI',
      lessons: [
        {
          id: 'l6',
          title: 'CSS Modules e Tailwind no Next.js',
          slug: 'css-modules-tailwind',
          duration: '19:47',
          status: 'upcoming',
        },
        {
          id: 'l7',
          title: 'Componentes com Design System',
          slug: 'design-system-componentes',
          duration: '35:12',
          status: 'upcoming',
        },
        {
          id: 'l8',
          title: 'Animações com Framer Motion',
          slug: 'animacoes-framer-motion',
          duration: '26:44',
          status: 'upcoming',
        },
      ],
    },
    {
      id: 'm3',
      title: 'Backend e Deploy',
      lessons: [
        {
          id: 'l9',
          title: 'API Routes e Server Actions',
          slug: 'api-routes-server-actions',
          duration: '41:22',
          status: 'upcoming',
        },
        {
          id: 'l10',
          title: 'Banco de Dados com Supabase',
          slug: 'banco-dados-supabase',
          duration: '38:55',
          status: 'upcoming',
        },
        {
          id: 'l11',
          title: 'Deploy na VPS com CyberPanel',
          slug: 'deploy-vps-cyberpanel',
          duration: '44:08',
          status: 'upcoming',
        },
      ],
    },
  ],
}

export function findLesson(courseSlug: string, lessonSlug: string) {
  if (mockCourse.slug !== courseSlug) return null

  for (const module of mockCourse.modules) {
    const lessonIndex = module.lessons.findIndex((l) => l.slug === lessonSlug)
    if (lessonIndex !== -1) {
      const lesson = module.lessons[lessonIndex]

      // Find next lesson
      let nextLesson: { moduleTitle: string; lesson: typeof lesson } | null = null
      if (lessonIndex < module.lessons.length - 1) {
        nextLesson = {
          moduleTitle: module.title,
          lesson: module.lessons[lessonIndex + 1],
        }
      } else {
        // Look in next module
        const moduleIndex = mockCourse.modules.indexOf(module)
        if (moduleIndex < mockCourse.modules.length - 1) {
          const nextModule = mockCourse.modules[moduleIndex + 1]
          if (nextModule.lessons.length > 0) {
            nextLesson = {
              moduleTitle: nextModule.title,
              lesson: nextModule.lessons[0],
            }
          }
        }
      }

      // Find prev lesson
      let prevLesson: { lesson: typeof lesson } | null = null
      if (lessonIndex > 0) {
        prevLesson = { lesson: module.lessons[lessonIndex - 1] }
      } else {
        const moduleIndex = mockCourse.modules.indexOf(module)
        if (moduleIndex > 0) {
          const prevModule = mockCourse.modules[moduleIndex - 1]
          const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
          if (lastLesson) prevLesson = { lesson: lastLesson }
        }
      }

      return { course: mockCourse, module, lesson, nextLesson, prevLesson }
    }
  }
  return null
}

export function getLessonProgress(course: Course): { completed: number; total: number } {
  let completed = 0
  let total = 0
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      total++
      if (lesson.status === 'completed') completed++
    }
  }
  return { completed, total }
}
