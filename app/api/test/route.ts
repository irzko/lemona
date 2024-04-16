import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDataSheet } from "@/lib/gSheet";
import { Manga } from "@prisma/client";
import { connect } from "http2";

export const GET = async (req: Request) => {
  // await prisma.genre.deleteMany();
  const tmp = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "1397060211"
  );

  await prisma.chapter.createMany({
    data: tmp.map((item) => {
      return {
        orderNumber: parseInt(item.chap),
        mangaId: 3,
        chapterHash: item.src,
      };
    }),
  });

  // const g = tmp.map((item) => {
  //   return {
  //     id: item.id,
  //     title: item.title,
  //     genre: item.genre,
  //     cover: item.cover,
  //   };
  // });

  // g.forEach(async (item) => {
  //   await prisma.manga.update({
  //     where: {
  //       id: parseInt(item.id),
  //     },
  //     data: {
  //       imageCover: item.cover,
  //     },
  //   });
  // });

  // await prisma.genre.createMany({
  //   data: g.map((item) => {
  //     return {
  //       name: item,
  //     };
  //   }),
  // });

  return NextResponse.json(
    {
      message: "OK",
      // data: g,
    },
    {
      status: 200,
    }
  );
};
