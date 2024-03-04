
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import { productSelectors } from "../../app/store/catalog/catalogSlice";
import { fetchFilter, fetchProductsAsync } from "../../app/store/catalog/catalogThunk";
import ProductList from "./ProductList";
import { useEffect } from "react";

const sortOptions = [
  { value: "name", label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price - High to low' },
  { value: 'price', label: 'Price - Low to high' }
]

export default function Catalog() {

  // const [products, setProducts] = useState<Product[]>([])
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, filtersLoaded, brands, types } = useAppSelector(state => state.catalog);
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

  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <TextField
            label='Search products'
            variant='outlined'
            fullWidth
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              {sortOptions.map(({ value, label }) => (
                <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
              ))}


            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            {brands.map(brand => (
              <FormControlLabel control={<Checkbox />} label={brand} key={brand} />
            ))}

          </FormGroup>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <FormGroup>
            {types.map(type => (
              <FormControlLabel control={<Checkbox />} label={type} key={type} />
            ))}

          </FormGroup>
        </Paper>

      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Pagination
            color="secondary"
            size="large"
            count={10}
            page={2}
          />
        </Box>
      </Grid>



    </Grid>
  )
} 