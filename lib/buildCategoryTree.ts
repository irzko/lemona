import { Category } from "@prisma/client";

export interface CategoryTree extends Category {
  subcategories?: CategoryTree[];
}

export default function buildCategoryTree(
  categories: Category[]
): CategoryTree[] {
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  categories.forEach((category) => {
    categoryMap.set(category.id, category);
  });

  categories.forEach((category) => {
    if (category.parentCategoryId) {
      const parent = categoryMap.get(category.parentCategoryId);
      if (parent) {
        parent.subcategories = parent.subcategories || [];
        parent.subcategories.push(category);
      } else {
        rootCategories.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}
