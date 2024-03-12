
import { Container } from '@mui/material'
import './App.css'

import Catalog from './features/catalog/Catalog'
import Header from './app/layout/Header'
import { Route, Routes } from 'react-router-dom'
import HomePage from './features/home/HomePage'
import ProductDetail from './features/catalog/ProductDetail'
import AboutPage from './features/about/AboutPage'
import ContactPage from './features/contact/ContactPage'
import BasketPage from './features/basket/BasketPage'
import { useEffect, useState } from 'react'
import { getCookie } from './app/utils/util'
import agent from './app/api/agent'
import LoadingComponent from './features/catalog/LoadingComponent'
import CheckoutPage from './features/checkout/CheckoutPage'
import { useAppDispatch } from './app/store/ConfigureStore'
import { setBasket } from './app/store/basket/basketSlice'
import Login from './features/account/Login'
import Register from './features/account/Register'


function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const buyerId = getCookie('buyerId');
    console.log(JSON.stringify(buyerId));
    if (buyerId) {
      agent.Basket.getBasket()
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch])

  if (loading) return <LoadingComponent message='Initialising app...' />
  return (
    <>
      <Header />

      <Container >
        <Routes>
          <Route path='/' Component={HomePage} />
          <Route path='/catalog' Component={Catalog} />
          <Route path='/catalog/:id' Component={ProductDetail} />
          <Route path='/about' Component={AboutPage} />
          <Route path='/contact' Component={ContactPage} />
          <Route path='/basket' Component={BasketPage} />
          <Route path='/checkout' Component={CheckoutPage} />
          <Route path='/login' Component={Login} />
          <Route path='/register' Component={Register} />
        </Routes>
      </Container>

    </>
  )
}

export default App
