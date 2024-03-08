import { TextField, debounce } from '@mui/material'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/ConfigureStore'
import { setProductParams } from '../../app/store/catalog/catalogSlice';

const ProductSearch = () => {

    const { productParams } = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm)
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((e: any) => {
        dispatch(setProductParams({ searchTerm: e.target.value }))
    }, 1000)

    return (
        <>
            <TextField
                label='Search products'
                variant='outlined'
                fullWidth
                value={searchTerm || ''}
                onChange={
                    (e) => {
                        setSearchTerm(e.target.value)
                        debouncedSearch(e)
                    }}
            />
        </>
    )
}

export default ProductSearch