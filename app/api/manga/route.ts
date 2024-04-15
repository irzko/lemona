import { getDataSheet } from "@/lib/gSheet";

export async function GET() {
  const data = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "0"
  );

  return Response.json(data);
}
