import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/Interfaces/IProduct";
import agent from "../../app/api/agent";
import LoadingComponent from "./LoadingComponent";

export default function ProductDetail() {
    const { id } = useParams<{ id?: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loaded, setLoaded] = useState(true);
    useEffect(() => {
        if (id) {
            agent.Catalog.detail(parseInt(id))
                .then(response => setProduct(response))
                .catch(err => console.log(err))
                .finally(() => setLoaded(false))
        }

    }, [id])

    if (loaded) return <LoadingComponent />
    if (!product) return <h3>Product not found</h3>
    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src="https://robohash.org/stefan-one" style={{ width: '100%' }} />

            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">
                    {product.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4" color='secondary'>
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}