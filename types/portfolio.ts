export type BlockType = 'INTRO' | 'EXPERIENCE' | 'PROJECTS' | 'CERTIFICATES' | 'CONTACT'

export interface Block {
  id: string
  portfolioId: string
  type: BlockType
  order: number
  content: any
  createdAt?: Date
  updatedAt?: Date
}

export interface IntroBlock {
  title: string
  subtitle: string
  description: string
  profileImage?: string
}

export interface ExperienceItem {
  id: string
  title: string
  company: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  location?: string
}

export interface ExperienceBlock {
  title: string
  items: ExperienceItem[]
}

export interface Project {
  id: string
  title: string
  description: string
  url: string
  image?: string
  technologies: string[]
  featured: boolean
}

export interface ProjectsBlock {
  title: string
  description: string
  projects: Project[]
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  url?: string
  image?: string
}

export interface CertificatesBlock {
  title: string
  certificates: Certificate[]
}

export interface ContactBlock {
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Theme {
  palette: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink'
  font: 'inter' | 'playfair' | 'jetbrains' | 'roboto'
  background: 'gradient' | 'solid' | 'pattern'
}

export interface Portfolio {
  id: string
  userId: string
  subdomainSlug: string
  visibility: 'PUBLIC' | 'PRIVATE'
  privateToken?: string
  theme: Theme
  blocks: Block[]
}