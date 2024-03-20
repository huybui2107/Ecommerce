import { Remove, Add, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { removeBasketItemAsync, addBasketItemAsync } from '../../app/store/basket/basketThunk'
import { useAppSelector, useAppDispatch } from '../../app/store/ConfigureStore'
import { BasketItem } from '../../app/Interfaces/IBasket'


interface Props {
    items: BasketItem[];
    isBasket?: boolean;
}


const BasketTable = ({ items, isBasket = true }: Props) => {
    const { status } = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();
    return (
        <TableContainer component={Paper} sx={{ backgroundColor: 'white' }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell >Product</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center" >Quantity</TableCell>
                        <TableCell align="center">Subtotal</TableCell>
                        {isBasket &&
                            <TableCell align="center"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => (
                        <TableRow
                            key={row.productId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="center">${(row.price / 100).toFixed(2)}</TableCell>

                            <TableCell align="center">
                                {isBasket &&
                                    <LoadingButton onClick={() => dispatch(removeBasketItemAsync({ productId: row.productId, quantity: 1, name: 'rem' }))} loading={status === 'pendingRemoveItem' + row?.productId + 'rem'} color='error'>
                                        <Remove />
                                    </LoadingButton>}
                                {row.quantity}
                                {isBasket &&
                                    <LoadingButton loading={status === 'pendingAddItem' + row?.productId} onClick={() => dispatch(addBasketItemAsync({ productId: row.productId }))} color='secondary'>
                                        <Add />
                                    </LoadingButton>}
                            </TableCell>
                            <TableCell align="center">${(((row.price / 100)) * row.quantity).toFixed(2)}</TableCell>
                            {isBasket &&
                                <TableCell align="center">
                                    <LoadingButton loading={status === 'pendingRemoveItem' + row?.productId + 'del'} color='error' onClick={() => dispatch(removeBasketItemAsync({ productId: row.productId, quantity: row.quantity, name: 'del' }))}>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BasketTable