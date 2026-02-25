export type LessonStatus = 'completed' | 'current' | 'upcoming'

export type MaterialType = 'pdf' | 'doc' | 'spreadsheet' | 'image' | 'archive' | 'other'

export interface UsefulLink {
  id: string
  title: string
  url: string
  description?: string
}

export interface Material {
  id: string
  title: string
  url: string
  type: MaterialType
  size?: string
}

export interface Lesson {
  id: string
  title: string
  slug: string
  duration: string
  status: LessonStatus
  videoUrl?: string
  description?: string
  links?: UsefulLink[]
  materials?: Material[]
}

export interface CourseModule {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  slug: string
  instructor: string
  modules: CourseModule[]
}
