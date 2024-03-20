
import { Box, Button, Typography } from '@mui/material';
import BasketSummary from './BasketSummary';
import { useAppSelector } from '../../app/store/ConfigureStore';
import { useNavigate } from 'react-router-dom';
import BasketTable from './BasketTable';


export default function BasketPage() {
    const { basket } = useAppSelector(state => state.basket)

    const navigate = useNavigate();
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
            <BasketTable items={basket.items} />
            <Box display='flex' justifyContent='flex-end' >
                <Box display='flex' flexDirection='column'>
                    <BasketSummary />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, }}
                        onClick={() => navigate('/checkout')}
                    >Checkout</Button>
                </Box>
            </Box>
        </>
    )
}
