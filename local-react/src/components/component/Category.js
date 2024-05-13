import React from 'react'
import "../../style/Category.css"
import { Link, useParams } from 'react-router-dom'
import CardProduct from '../subcomponent/cardProduct'

export default function Category(props) {
    
    let product = props.product
    const urlParam = useParams()

    let productCat = []
    if (product) {
        for (let i = 0; i < product.length; i++) {
            if ( product[i].category === urlParam.category) {
                productCat.push(product[i])
            }
        }
        console.log(productCat);
    }

    if (urlParam.category) {
        return (
            <div className='Category' style={{marginTop: "4.5rem"}}>
                <h2>{urlParam.category}</h2>
                <p>All Product of {urlParam.category}</p>
                <div className='category-sort'>
                    <p>SORT BY:</p>
                    <Link>Product Name</Link>
                    <Link>Date</Link>
                    <Link>Price</Link>
                </div>
                <hr />
                <div className={productCat.length !== 0 ? "category-product-content": "category-product-empty"}>
                    {
                        (productCat.length !== 0 && productCat.map((item) => <CardProduct key={item._id} product={item}/>)) || 
                        <p>There are no product...</p>
                    }
                </div>
            </div>
        )
    }
}