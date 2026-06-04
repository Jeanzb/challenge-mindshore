export type TagSource = "manual" | "ai"

export interface ImageTag {
  id: string
  label: string
  source: TagSource
}

export interface ImageEnrichment {
  description: string
  funFacts: string[]
  historicalContext: string
  generatedAt: string
}

export interface TagSuggestionResult {
  tags: string[]
}
