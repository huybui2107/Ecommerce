/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '../store/ConfigureStore';
import { signOut } from '../store/account/accountSlice';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function SignedInMenu() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.account)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>


            <Tooltip title="Open settings" onClick={handleClick} sx={{ marginLeft: 20 }}>
                <IconButton sx={{ p: 0, ml: 3 }}>
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>{user?.email.charAt(0).toUpperCase()}</Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={() => {
                    dispatch(signOut())
                    navigate('/')
                }}>Logout</MenuItem>
            </Menu>
        </>
    );
}