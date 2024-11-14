import { getGSheet } from "@/lib/nogle";

const data = await getGSheet(
  "1m4aKkR43kNsNPmB1GUa1g5LI3l8SzK5iaBDH9uDERFY",
  "0"
)


const products = data.map(item => {
  return {
    id: item[0],
    name: item[1],
    price: parseInt(item[2]),
    image: item[3],
  }
})



export { products };