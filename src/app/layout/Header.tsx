
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import { Badge, List, ListItem } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';
import { useAppSelector } from '../store/ConfigureStore';


const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' }
]

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' }
]







function Header() {
  const { basket } = useAppSelector(state => state.basket)

  const itemCount = basket?.items.reduce((itemCount, item) => itemCount + item.quantity, 0)

  return (
    <AppBar position="static" sx={{ marginBottom: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Ecommerce
          </Typography>




          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <List sx={{ display: 'flex', flexDirection: 'row ' }}>
              {midLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={{ color: 'inherit', typography: 'h6' }}
                >
                  {title}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <IconButton component={Link} to="/basket" size='large' sx={{ color: 'inherit' }}>
              <Badge badgeContent={itemCount} color='secondary'>
                <ShoppingCart />
              </Badge>
            </IconButton>
            <List sx={{ display: 'flex', flexDirection: 'row ' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={{ color: 'inherit', typography: 'h6' }}
                >
                  {title}
                </ListItem>
              ))}
            </List>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;