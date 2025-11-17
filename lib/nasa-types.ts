// NASA Image and Video Library API Types
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
  href?: string;
  orig?: string;
  thumbnail?: string;
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

// NASA NEO (Near-Earth Object) API Types

export interface NeoFeedResponse {
  links: {
    next?: string;
    previous?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: Record<
    string,
    {
      links: { self: string };
      id: string;
      neo_reference_id: string;
      name: string;
      nasa_jpl_url: string;
      absolute_magnitude_h: number;
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
        meters: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
        miles: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
        feet: {
          estimated_diameter_min: number;
          estimated_diameter_max: number;
        };
      };
      is_potentially_hazardous_asteroid: boolean;
      close_approach_data: {
        close_approach_date: string;
        close_approach_date_full: string;
        epoch_date_close_approach: number;
        relative_velocity: {
          kilometers_per_second: string;
          kilometers_per_hour: string;
          miles_per_hour: string;
        };
        miss_distance: {
          astronomical: string;
          lunar: string;
          kilometers: string;
          miles: string;
        };
        orbiting_body: string;
      }[];
      is_sentry_object: boolean;
      sentry_data?: string;
    }[]
  >;
}
