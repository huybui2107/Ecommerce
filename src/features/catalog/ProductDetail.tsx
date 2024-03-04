/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/ConfigureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../../app/store/basket/basketThunk";
import { productSelectors } from "../../app/store/catalog/catalogSlice";
import { fetchProductAsync } from "../../app/store/catalog/catalogThunk";

export default function ProductDetail() {
    const { basket, status } = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const product = useAppSelector(state => productSelectors.selectById(state, id))
    const { status: statusCatalog } = useAppSelector(state => state.catalog)
    // const [product, setProduct] = useState<Product | null>(null);
    // const [loaded, setLoaded] = useState(true);
    const [quantity, setQuantity] = useState(0)
    const item = basket?.items.find(i => i.productId === product?.id);
    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if (id) {
            //     agent.Catalog.detail(parseInt(id))
            //         .then(response => setProduct(response))
            //         .catch(err => console.log(err))
            //         .finally(() => setLoaded(false))
            if (!product) dispatch(fetchProductAsync(parseInt(id)))
        }


    }, [id, item, dispatch, product])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (event: any) => {
        if (event.target.value >= 0) {
            setQuantity(parseInt(event.target.value));
        }

    }
    const handleUpdateCart = () => {

        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            // agent.Basket.addItem(product?.id!, updatedQuantity)
            //     .then(basket => dispatch(setBasket(basket)))
            //     .catch(error => console.log(error))
            //     .finally(() => setSubmitted(false));
            dispatch(addBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }))
        } else {
            const updatedQuantity = item.quantity - quantity;
            // agent.Basket.removeItem(product?.id!, updatedQuantity)
            //     .then(() => dispatch(removeItem({
            //         productId: product?.id!, quantity: updatedQuantity
            //     })))
            //     .catch(error => console.log(error))
            //     .finally(() => setSubmitted(false));
            dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }))
        }
    }

    if (statusCatalog.includes('pending')) return <LoadingComponent />
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
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={(e) => handleInputChange(e)}
                            label="Quantity in Cart"
                            type="number"
                            value={quantity}
                            variant='outlined'
                            fullWidth
                        />


                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} sx={{ height: '55px' }} color="primary" size="large" variant="contained" fullWidth loading={status.includes('pending')} onClick={handleUpdateCart}>
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}