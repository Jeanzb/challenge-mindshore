export interface ComparisonImageInput {
  nasaImageId: string
  title: string
  imageUrl: string
}

export interface ComparisonResult {
  summary: string
  similarities: string[]
  differences: string[]
  imageIds: string[]
  generatedAt: string
}
