
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import { useFormContext } from 'react-hook-form';
import AppTextInput from '../AppTextInput';
import AppCheckbox from '../AppCheckbox';

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function AddressForm() {
    const { control } = useFormContext();
    return (
        <Grid container spacing={3} width={600}>
            <FormGrid item xs={12} >
                <FormLabel htmlFor="first-name" required>
                    First name
                </FormLabel>
                <AppTextInput control={control} name='fullName' lable='Full name' />
            </FormGrid>


            <FormGrid item xs={12}>
                <FormLabel htmlFor="address1" required>
                    Address line 1
                </FormLabel>
                <AppTextInput control={control} name='address1' lable='Address 1' />

            </FormGrid>
            <FormGrid item xs={12}>
                <FormLabel htmlFor="address2">Address line 2</FormLabel>
                <AppTextInput control={control} name='address2' lable='Address 2' />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="city" required>
                    City
                </FormLabel>
                <AppTextInput control={control} name='city' lable='city' />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="state" required>
                    State
                </FormLabel>
                <AppTextInput control={control} name='state' lable='state' />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="zip" required>
                    Zip / Postal code
                </FormLabel>
                <AppTextInput control={control} name='zip' lable='zip' />
            </FormGrid>
            <FormGrid item xs={6}>
                <FormLabel htmlFor="country" required>
                    Country
                </FormLabel>
                <AppTextInput control={control} name='country' lable='country' />
            </FormGrid>
            <FormGrid item xs={12}>
                <AppCheckbox name='saveAddress' label='Save this as the default address' control={control} />
            </FormGrid>
        </Grid>
    );
}