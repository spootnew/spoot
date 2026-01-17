
export interface NewsArticle {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  category: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  isCover?: boolean;
}

export interface Ad {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  targetNewsId: string; // Which article this ad belongs to
  phone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
}

export type ViewMode = 'magazine' | 'admin' | 'reader' | 'ad_manager';
