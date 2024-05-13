import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardProduct from '../subcomponent/cardProduct'
import "../../style/NewReleases.css"
import imgBG from "../../image/Frame3.png"

export default function NewReleases() {

    const [ newProduct, setNewProduct ] = useState()

    useEffect(() => {
        fetch('/api/product/newreleases')
            .then((response) => response.json())
            .then((result) => {
                setNewProduct(result)
            })
            .catch((err) => console.log(err))
    },[])
    console.log(newProduct);

    return (
        <div className='NewReleases' style={{marginTop: "4.5rem"}}>
            <div className='new-intro'>
                <p>FALL RELEASE</p>
                <h2>the autumn equinox</h2>
                <p>
                Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <img src={imgBG} alt="" />
            </div>
            {
                newProduct && newProduct.map((item, index) => <NewCatagory key={index} category={item.category} product={item.value}/>)
            }
        </div>
    )
}

function NewCatagory(props) {
    return (
        <div className='new-category'>
            <div className='new-category-header'>
                <h2>{props.category}</h2>
                <Link to={"/category/" + props.category}>SHOP ALL {props.category}</Link>
            </div>
            <div className={ props.product.length !== 0 ?'new-category-body':'new-category-empty' } >
                {
                    (props.product.length && props.product.map((item) => <CardProduct key={item._id} product={item} />)) ||
                    <div>There are no product...</div>
                }
            </div>
            { props.category !== "Charms" && <hr/>}
        </div>
    )
}