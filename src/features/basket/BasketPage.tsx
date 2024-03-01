
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Typography } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import BasketSummary from './BasketSummary';
import { useAppDispatch, useAppSelector } from '../../app/store/ConfigureStore';
import { addBasketItemAsync, removeBasketItemAsync } from '../../app/store/basket/basketThunk';


export default function BasketPage() {
    const { basket, status } = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();
    // const [status, setStatus] = useState({
    //     loading: false,
    //     name: '',
    // });

    // const handleAddItem = (productId: number, name: string) => {
    //     setStatus({
    //         loading: true,
    //         name: name,
    //     })
    //     agent.Basket.addItem(productId)
    //         .then(basket => dispatch(setBasket(basket)))
    //         .catch(error => console.log(error))
    //         .finally(() => setStatus({
    //             loading: false,
    //             name: '',
    //         }))
    // }

    // const handleRemoveItem = (productId: number, quantity: number, name: string) => {
    //     setStatus({
    //         loading: true,
    //         name: name,
    //     })
    //     agent.Basket.removeItem(productId, quantity)
    //         .then(() => dispatch(removeItem({
    //             productId, quantity
    //         })))
    //         .catch(error => console.log(error))
    //         .finally(() => setStatus({
    //             loading: false,
    //             name: '',
    //         }))
    // }
    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell >Product</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center" >Quantity</TableCell>
                            <TableCell align="center">Subtotal</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map((row) => (
                            <TableRow
                                key={row.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">${(row.price / 100).toFixed(2)}</TableCell>

                                <TableCell align="center">
                                    <LoadingButton onClick={() => dispatch(removeBasketItemAsync({ productId: row.productId, quantity: 1, name: 'rem' }))} loading={status === 'pendingRemoveItem' + row?.productId + 'rem'} color='error'>
                                        <Remove />
                                    </LoadingButton>
                                    {row.quantity}
                                    <LoadingButton loading={status === 'pendingAddItem' + row?.productId} onClick={() => dispatch(addBasketItemAsync({ productId: row.productId }))} color='secondary'>
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="center">${(((row.price / 100)) * row.quantity).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton loading={status === 'pendingRemoveItem' + row?.productId + 'del'} color='error' onClick={() => dispatch(removeBasketItemAsync({ productId: row.productId, quantity: row.quantity, name: 'del' }))}>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display='flex' justifyContent='flex-end' >
                <Box display='flex' flexDirection='column'>
                    <BasketSummary />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, }}
                    >Checkout</Button>
                </Box>
            </Box>
        </>
    )
}
