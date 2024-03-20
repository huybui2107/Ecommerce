

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';

import { styled } from '@mui/system';
import { useFormContext } from 'react-hook-form';
import AppTextInput from '../AppTextInput';

const FormGrid = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function PaymentForm() {

    const { control } = useFormContext();



    // const handleCardNumberChange = (event: { target: { value: string } }) => {
    //     const value = event.target.value.replace(/\D/g, '');
    //     const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    //     if (value.length <= 16) {
    //         // setCardNumber(formattedValue);
    //     }
    // };

    // const handleCvvChange = (event: { target: { value: string } }) => {
    //     const value = event.target.value.replace(/\D/g, '');
    //     if (value.length <= 3) {
    //         // setCvv(value);
    //     }
    // };

    // const handleExpirationDateChange = (event: { target: { value: string } }) => {
    //     const value = event.target.value.replace(/\D/g, '');
    //     const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
    //     if (value.length <= 4) {
    //         // setExpirationDate(formattedValue);
    //     }
    // };

    return (
        <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 3,
                        height: { xs: 300, sm: 350, md: 375 },
                        width: '100%',
                        borderRadius: '20px',
                        border: '1px solid ',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">Credit card</Typography>
                        <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
                    </Box>
                    <SimCardRoundedIcon
                        sx={{
                            fontSize: { xs: 48, sm: 56 },
                            transform: 'rotate(90deg)',
                            color: 'text.secondary',
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: 1,
                        }}
                    >
                        <FormGrid>
                            <FormLabel htmlFor="card-number" required>
                                Card number
                            </FormLabel>
                            <AppTextInput name='cardNumber' lable='Card Number' control={control} />
                        </FormGrid>
                        <FormGrid >
                            <FormLabel htmlFor="cvv" required>
                                CVV
                            </FormLabel>
                            <AppTextInput name='ccv' lable='CCV' control={control} />
                        </FormGrid>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormGrid sx={{ flexGrow: 1 }}>
                            <FormLabel htmlFor="card-name" required>
                                Name
                            </FormLabel>
                            <AppTextInput name='nameOnCard' lable='Name on card' control={control} />
                        </FormGrid>
                        <FormGrid sx={{ flexGrow: 1 }}>
                            <FormLabel htmlFor="card-expiration" required>
                                Expiration date
                            </FormLabel>

                            <AppTextInput name='expireDate' lable='Expire Date' control={control} />
                        </FormGrid>
                    </Box>
                </Box>
                <FormControlLabel
                    control={<Checkbox name="saveCard" />}
                    label="Remember credit card details for next time"
                />
            </Box>
        </Stack>
    );
}