WITH RECURSIVE category_tree AS (
  SELECT 
    id, 
    name, 
    "parentCategoryId"
  FROM 
    "Category"
  WHERE 
    "parentCategoryId" IS NULL  -- Start from root categories

  UNION ALL

  SELECT 
    c.id, 
    c.name, 
    c."parentCategoryId"
  FROM 
    "Category" c
  JOIN 
    category_tree ct ON c."parentCategoryId" = ct.id
)
SELECT * FROM category_tree;
