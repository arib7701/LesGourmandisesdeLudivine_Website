export class Real {
  key?: string;
  title?: string;
  description?: string;
  partnersId?: string[];
  img?: {
    id?: string;
    url?: string;
  };
  category?: string;
  likes?: number;
  galleryId?: string[];
  date?: string;
  comments?: any[];
  haveRecipe?: {
    exist?: boolean;
    recipeLink?: string;
  };
}
