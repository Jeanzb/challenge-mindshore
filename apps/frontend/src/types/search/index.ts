export interface NasaImage {
  nasaImageId: string
  title: string
  description: string
  dateCreated: string
  keywords: string[]
  imageUrl: string
  thumbnailUrl: string
  center: string
  photographer: string
}

export interface NasaSearchResult {
  items: NasaImage[]
  totalHits: number
  page: number
  pageSize: number
}

export interface SearchFilters {
  q: string
  dateFrom: string
  dateTo: string
  rover: string
  camera: string
  mission: string
  page: number
}

export interface SemanticSearchInterpretation {
  q: string
  dateFrom: string
  dateTo: string
  rover: string
  camera: string
  mission: string
  rationale: string
}

export interface SemanticSearchResult extends NasaSearchResult {
  interpretation: SemanticSearchInterpretation
}
