import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/component/Home';
import Navbar from './components/component/Navbar';
import Register from './components/component/Register';
import Login from './components/component/Login';
import { userContext, productContext, orderContext } from './contexts/Context';
import Admin from './components/component/Admin';
import AddProduct from './components/component/AddProduct';
import EditProduct from './components/component/EditProduct';
import Category from './components/component/Category';
import ProductDetail from './components/component/ProductDetail';
import NewReleases from './components/component/NewReleases';
import Checkout from './components/component/Checkout';
import Order from './components/component/Order';

function App() {

  /* State */
  const [user, setUser] = useState() 
  const [product, setProduct] = useState()
  const [order, setOrder] = useState()

  /* useEffect */
  useEffect(() => {
    fetch('/api/profile/sesion')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUser(result)
      })
      .catch((err) => console.log(err))
    
    fetch('/api/product/get')
      .then((response) => response.json())
      .then((result) => {
        setProduct(result)
      })
      .catch((err) => console.log(err))
    
    fetch('/api/order/get')
      .then((response) => response.json())
      .then((result) => {
        setOrder(result)
      })
      .catch((err) => console.log(err))

  },[])

  return (
    <div className="App">
      <userContext.Provider value={[user, setUser]}>
        <productContext.Provider value={[product, setProduct]}>
          <orderContext.Provider value={[order, setOrder]}>
            <BrowserRouter>
              <Navbar/>
              <Routes>
                <Route path='/' element={<Home product={product}/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/admin/:content' element={<Admin user={user} order={order}/>}/>
                <Route path='/admin/add-product' element={<AddProduct/>}/>
                <Route path='/admin/edit-product/:productID' element={<EditProduct/>}/>
                <Route path='/category/:category' element={<Category product={product}/>}/>
                <Route path='/product-detail/:productID' element={<ProductDetail/>}/>
                <Route path='/new-releases' element={<NewReleases/>}/>
                <Route path='/checkout' element={<Checkout/>}/>
                <Route path='/order' element={<Order user={user}/>}/>
              </Routes>
            </BrowserRouter>
          </orderContext.Provider>
        </productContext.Provider>
      </userContext.Provider>
    </div>
  );
}

export default App;
