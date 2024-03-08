
import { Box, Grid, Pagination, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import { productSelectors, setProductParams } from "../../app/store/catalog/catalogSlice";
import { fetchFilter, fetchProductsAsync } from "../../app/store/catalog/catalogThunk";
import ProductList from "./ProductList";
import { useEffect } from "react";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButton from "../../app/components/CheckboxButton";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
  { value: "name", label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price - High to low' },
  { value: 'price', label: 'Price - Low to high' }
]

export default function Catalog() {

  // const [products, setProducts] = useState<Product[]>([])
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // agent.Catalog.list().then(products => setProducts(products))
    if (!productsLoaded) {
      dispatch(fetchProductsAsync());
    }

  }, [productsLoaded, dispatch])
  useEffect(() => {
    if (!filtersLoaded) {
      dispatch(fetchFilter());
    }
  }, [dispatch, filtersLoaded])
  if (!metaData) return <div> Error...</div>

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButton
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
          />

        </Paper>

        <Paper sx={{ p: 2 }}>
          <CheckboxButton
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
          />
        </Paper>

      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <AppPagination
          metaData={metaData}
          onPageChange={(page: number) => dispatch(setProductParams({ pageNumber: page }))}

        />
      </Grid>


    </Grid>
  )
} 