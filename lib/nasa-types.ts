export type MediaType = "image" | "video" | "audio" | (string & {});

export type LinkRel =
  | "alternate"
  | "preview"
  | "canonical"
  | "captions"
  | (string & {});

export type RenderType = "image" | "video" | (string & {});

export interface AssetLink {
  href: string;
  rel?: LinkRel;
  render?: RenderType;
  width?: number;
  height?: number;
  size?: number;
}

export interface MediaItem {
  center?: string;
  date_created?: string;
  description?: string;
  description_508?: string;
  keywords?: string[];
  media_type?: MediaType;
  nasa_id?: string;
  title?: string;
  secondary_creator?: string;
  photographer?: string;
  location?: string;
}

export interface MediaItemWithLinks extends MediaItem {
  links?: AssetLink[];
}

export interface CollectionItem {
  href: string;
  data: MediaItem[];
  links?: AssetLink[];
}

export interface SearchResponse {
  collection: {
    version?: string;
    href: string;
    items: CollectionItem[];
  };
}

export default SearchResponse;
