export type ListItemProps = {
  title: string;
  body: string;
  backgroundColor: string;
  rating: number;
  onPress: () => void;
};

export type Post = {
  userId: number;
  id: number;
  backgroundColor: string;
  title: string;
  body: string;
  rating?: number;
};

export type RatingModalProps = {
  visible: boolean;
  onClose: () => void;
  onFinishRating: (rating: number) => void;
};
