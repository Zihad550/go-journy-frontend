// Review-related TypeScript interfaces

export interface IReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  rider: {
    name: string;
  };
  driver: {
    _id: string;
    user: {
      name: string;
    };
    vehicle: {
      name: string;
      model: string;
    };
  };
}

export interface IFeaturedReviewsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IReview[];
}

// Extended review interface for component compatibility
export interface IReviewForComponent extends Omit<IReview, 'rider' | 'driver'> {
  id: string;
  name: string;
  role: 'rider' | 'driver';
  avatar?: string;
  review: string;
  location?: string;
  metric?: string;
  rider?: {
    name: string;
  };
  driver?: {
    _id: string;
    user: {
      name: string;
    };
    vehicle: {
      name: string;
      model: string;
    };
  };
}