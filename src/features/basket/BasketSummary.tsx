import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { currencyFormat } from "../../app/utils/util";
import { useAppSelector } from "../../app/store/ConfigureStore";


export default function BasketSummary() {
    const { basket } = useAppSelector(state => state.basket);
    const subTotal = basket?.items.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0) ?? 0;
    const deliveryFee = subTotal > 10000 ? 0 : 500;


    return (
        <TableContainer component={Paper} sx={{ mt: 0.5, width: 400, backgroundColor: 'white' }} >
            <Table sx={{}}>
                <TableBody>

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">Subtotal</TableCell>
                        <TableCell align="right">{currencyFormat(subTotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Delivery fee*</TableCell>
                        <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Total</TableCell>
                        <TableCell align="right">{currencyFormat(subTotal + deliveryFee)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" colSpan={2} >*Order over $100 quantity for free delivery</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer>
    )
}
