export interface Product {
  id: string;
  code: string;
  product_name: string;
  image_url: string;
  image_small_url: string;
  image_front_url: string;
  image_ingredients_url: string;
  image_nutrition_url: string;
  categories: string;
  categories_tags: string[];
  brands: string;
  brands_tags: string[];
  quantity: string;
  ingredients_text: string;
  allergens: string;
  allergens_tags: string[];
  traces: string;
  traces_tags: string[];
  serving_size: string;
  serving_quantity: number;
  nutriscore_grade: string;
  nutriscore_score: number;
  nutriments: {
    [key: string]: number | string;
    energy: number;
    energy_unit: string;
    'energy-kcal': number;
    'energy-kcal_unit': string;
    fat: number;
    fat_unit: string;
    saturated_fat: number;
    saturated_fat_unit: string;
    carbohydrates: number;
    carbohydrates_unit: string;
    sugars: number;
    sugars_unit: string;
    fiber: number;
    fiber_unit: string;
    proteins: number;
    proteins_unit: string;
    salt: number;
    salt_unit: string;
    sodium: number;
    sodium_unit: string;
  };
  nutrient_levels: {
    fat: string;
    saturated_fat: string;
    sugars: string;
    salt: string;
  };
  nutrition_grade_fr: string;
  nova_group: number;
  nova_groups: string;
  pnns_groups_1: string;
  pnns_groups_2: string;
  labels: string;
  labels_tags: string[];
  purchase_places: string;
  countries: string;
  countries_tags: string[];
  manufacturing_places: string;
}

export interface ProductResponse {
  code: string;
  product: Product;
  status: number;
  status_verbose: string;
}

export interface SearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
  skip: number;
}

export interface Category {
  id: string;
  name: string;
  products: number;
  url: string;
}

export interface CategoryResponse {
  count: number;
  tags: Category[];
}

export type SortOption = 'name_asc' | 'name_desc' | 'grade_asc' | 'grade_desc';