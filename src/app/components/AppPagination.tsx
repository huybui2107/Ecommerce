import { Box, Pagination } from '@mui/material'
import { MetaData } from '../Interfaces/IPagination'

interface Props {
    metaData: MetaData;
    onPageChange: (page: number) => void;
}

const AppPagination = ({ metaData, onPageChange }: Props) => {
    const { currentPage, totalPages } = metaData;
    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => onPageChange(page)}
            />
        </Box>
    )
}

export default AppPagination