export interface IContentStats {
  total: number;
  published: number;
  draft: number;
}

export interface IBlogStats extends IContentStats {
  byCategory: Array<{ category: string; count: number }>;
}

export interface IEventStats extends IContentStats {
  upcoming: number;
  past: number;
  featured: number;
}

export interface ICareerStats {
  total: number;
  active: number;
  expired: number;
}

export interface IContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}

export interface IMediaStats {
  total: number;
  images: number;
  documents: number;
  pdfs: number;
  totalSize: number;
  totalSizeFormatted: string;
}

export interface IResourceStats extends IContentStats {
  byCategory: Array<{ category: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  topDownloads: Array<{
    id: string;
    title: string;
    downloads: number;
  }>;
}

export interface IUserStats {
  total: number;
  admins: number;
  users: number;
  active: number;
  inactive: number;
}

export interface ICategoryStats {
  total: number;
  withBlogs: number;
  withResources: number;
}

export interface IRecentActivity {
  blogs: Array<{
    id: string;
    title: string;
    createdAt: Date;
    author: string;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    status: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    startDate: Date;
    status: string;
  }>;
  users: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    createdAt: Date;
  }>;
}

export interface IDashboardOverview {
  blogs: IBlogStats;
  events: IEventStats;
  careers: ICareerStats;
  contacts: IContactStats;
  media: IMediaStats;
  resources: IResourceStats;
  users: IUserStats;
  categories: ICategoryStats;
}

export interface IDashboardAnalytics {
  contentTrends: {
    monthly: Array<{
      month: string;
      blogs: number;
      events: number;
      resources: number;
    }>;
  };
  engagement: {
    topResources: Array<{
      id: string;
      title: string;
      downloads: number;
    }>;
    recentContacts: number;
    activeUsers: number;
  };
}
