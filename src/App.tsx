
import { Container } from '@mui/material'
import './App.css'

import Catalog from './features/catalog/Catalog'
import Header from './app/layout/Header'
import { Route, Routes } from 'react-router-dom'
import HomePage from './features/home/HomePage'
import ProductDetail from './features/catalog/ProductDetail'
import AboutPage from './features/about/AboutPage'
import ContactPage from './features/contact/ContactPage'

function App() {

  return (
    <>
      <Header /> 

      <Container >
        <Routes>
        <Route  path='/' Component={HomePage}/>
        <Route  path='/catalog' Component={Catalog}/>
        <Route  path='/catalog/:id' Component={ProductDetail}/>
        <Route  path='/about' Component={AboutPage}/>
        <Route  path='/contact' Component={ContactPage}/>
        </Routes>
      </Container>

    </>
  )
}

export default App
