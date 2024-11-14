import { getGSheet } from "@/lib/nogle";

const products = await getGSheet(
  "1m4aKkR43kNsNPmB1GUa1g5LI3l8SzK5iaBDH9uDERFY",
  "0"
)

export { products };