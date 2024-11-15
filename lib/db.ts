import { getGSheet } from "@/lib/nogle";

const data = await getGSheet(
  "1m4aKkR43kNsNPmB1GUa1g5LI3l8SzK5iaBDH9uDERFY",
  "0"
)

interface BaseModel {
  id: number;
}

class NogleDB<T extends BaseModel> {
  private data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  findById(id: number) {
    return this.data.find((item) => item.id === id);
  }

  findMany() {
    return this.data;
  }
  
}

interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}
const products = new NogleDB<IProduct>(data.map(item => {
  return {
    id: Number(item[0]),
    name: item[1],
    price: Number(item[2]),
    image: item[3],
  }
}))



export { products };