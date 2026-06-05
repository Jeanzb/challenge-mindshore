export type ImageTag = {
  id: string;
  name: string;
  isAiGenerated: boolean;
};

export type AddTagToImageRequest = {
  name: string;
  isAiGenerated: boolean;
};

export type TagSuggestions = {
  tags: readonly string[];
};
