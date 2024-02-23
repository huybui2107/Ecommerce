
import { Grid, } from "@mui/material";
import { Product } from "../../app/Interfaces/IProduct";
import ProductCard from "./ProductCard";


interface Props {
    products: Product[];

}
export default function ProductList({ products }: Props) {
    return (
        <Grid container spacing={2}>
            {products.map(product => (
                <Grid item lg={3} key={product.id}>
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>
    )
}