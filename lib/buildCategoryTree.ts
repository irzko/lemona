interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  childs?: Category[];
}

export default function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  categories.forEach((category) => {
    categoryMap.set(category.id, category);
  });

  categories.forEach((category) => {
    const parent = categoryMap.get(category.parentCategoryId);
    if (parent) {
      parent.childs = parent.childs || [];
      parent.childs.push(category);
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}
