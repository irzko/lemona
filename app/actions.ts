"use server";

import { revalidateTag } from "next/cache";

const updateFilms = async () => {
  revalidateTag("films");
  return {
    message: "Cập nhật thành công",
  };
};

export { updateFilms };
