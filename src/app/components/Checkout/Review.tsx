
import { Box } from '@mui/material';
import BasketSummary from '../../../features/basket/BasketSummary';
import BasketTable from '../../../features/basket/BasketTable';
import { useAppSelector } from '../../store/ConfigureStore';


export default function Review() {
    const { basket } = useAppSelector(state => state.basket);
    return (
        <>
            {basket &&
                <BasketTable items={basket.items} isBasket={false} />}
            <Box display='flex' justifyContent='flex-end' sx={{ mb: 2 }}>
                <Box display='flex' flexDirection='column' color='white'>
                    <BasketSummary />
                </Box>
            </Box>

        </>
    );
}