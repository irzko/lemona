import { Category } from "@prisma/client";

export const findChildCategories = (
  categories: Category[],
  parentId: string | null
) => {
  return categories.filter(
    (category) => category.parentCategoryId === parentId
  );
};
