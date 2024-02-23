
import { Product } from "../../app/Interfaces/IProduct"
import agent from "../../app/api/agent";
import ProductList from "./ProductList";
import { useEffect, useState } from "react";



export default function Catalog() {

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    agent.Catalog.list().then(products => setProducts(products))
  }, [])

  return (
    <>

      <ProductList products={products} />


    </>
  )
} 