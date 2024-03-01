
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import { productSelectors } from "../../app/store/catalog/catalogSlice";
import { fetchProductsAsync } from "../../app/store/catalog/catalogThunk";
import ProductList from "./ProductList";
import { useEffect } from "react";



export default function Catalog() {

  // const [products, setProducts] = useState<Product[]>([])
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // agent.Catalog.list().then(products => setProducts(products))
    if (!productsLoaded) {
      dispatch(fetchProductsAsync());
    }
  }, [productsLoaded, dispatch])

  return (
    <>

      <ProductList products={products} />


    </>
  )
} 