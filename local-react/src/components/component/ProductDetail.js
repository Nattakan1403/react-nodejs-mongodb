import React, { useContext, useEffect, useState } from "react";
import "../../style/ProductDetail.css"
import { Link, useParams } from "react-router-dom";
import { IoHeartOutline, IoChevronDownOutline, IoHeartSharp } from "react-icons/io5";
import { userContext } from "../../contexts/Context";

export default function ProductDetail() {

    let { productID } = useParams()
    const [ productDetail, setProductDetail ] = useState()
    const [ dropdown, setDropdown ] = useState("")
    const [ like, setLike ] = useState(false)
    const [ basket, setBasket ] = useState(false)
    

    const [ user, setUser ] = useContext(userContext)

    useEffect(() => {
        // action : like
        let productLike = false
        if (user && user.like) {
            user.like.forEach(i => {
                if (i._id === productID) {
                    productLike = true
                }
            })
        }
        if (productLike === true) {
            setLike(true)
        } else {
            setLike(false)
        }
        // action : basket
        let productBasket = false
        if (user && user.basket) {
            user.basket.forEach(i => {
                if (i._id === productID) {
                    productBasket = true
                }
            })
        }
        if (productBasket === true) {
            setBasket(true)
        } else {
            setBasket(false)
        }
    },[user, productID])

    useEffect(() => {
        fetch("/api/product/get/" + productID)
            .then((response) => response.json())
            .then((result) => {
                setProductDetail(result)
            })
            .catch((err) => console.log(err))
    },[productID])

    const onToggleDropDown = (content) => {
        if (content !== dropdown) {
            setDropdown(content)
        } else {
            setDropdown("")
        }
    }

    const onActionProduct = (action) => {
        if (user !== null) {
            let req = {
                productID : productDetail._id,
                userID : user.userId,
                action: action
            }
            fetch('/api/product/action', {
                method: "POST",
                body: JSON.stringify(req),
                headers: {'Content-Type':'application/json'}
            })
                .then((response) => response.json())
                .then((result) => {
                    setUser(result)
                })
        } else {
            alert('กรุณา login')
        }
    }
    
    if (productDetail) {
        return(
            <div className="ProductDetail" style={{marginTop: "4.5rem"}}>
                <div className="pdDetail-content">
                    <img src={"http://localhost:7000" + productDetail.image} alt="" />
                    <div className="pdDettail-data">
                        <Link>BACK TO SELECTION</Link>
                        <div className="pdDettail-data-name">
                            <h2>{productDetail.name}</h2>
                            <Link onClick={() => onActionProduct("like")}>
                                {
                                    (like === true && <IoHeartSharp style={{fontSize: "1.75rem", color: '#B18165'}}/>) ||
                                    <IoHeartOutline style={{fontSize: "1.75rem"}} />
                                }
                            </Link>
                        </div>
                        <p className="pdDettail-data-price">${productDetail.price}</p>
                        <p className="pdDettail-data-description">{productDetail.description}</p>
                        <button 
                            onClick={() => onActionProduct("basket")} 
                            className={ basket ? "pdDetail-add-basket" : ""}
                        >
                            { basket ? "ADDED" : "ADD TO BAG" }
                        </button>
                        <div className="pdDettail-data-dropdown">
                            <div 
                                className="pdDettail-btn-dropdown" 
                                onClick={() => onToggleDropDown("detail")}
                                style={{color: dropdown === "detail" ? "#B18165" : "black"}}
                            >
                                <p>DETAILS</p>
                                <IoChevronDownOutline/>
                            </div>
                            <div className={ dropdown === "detail" ? "pdDettail-dropdown-show" : "pdDettail-dropdown-close" }>
                                {
                                    productDetail.detail.map((item, index) => <li key={index}>{item}</li>)
                                }
                            </div>
                            <div 
                                className="pdDettail-btn-dropdown" 
                                onClick={() => onToggleDropDown("tip")}
                                style={{color: dropdown === "tip" ? "#B18165" : "black"}}
                            >
                                <p>TIPS & WARNNINGS</p>
                                <IoChevronDownOutline/>
                            </div>
                            <div className={ dropdown === "tip" ? "pdDettail-dropdown-show" : "pdDettail-dropdown-close" }>
                                {
                                    productDetail.tip.map((item, index) => <li key={index}>{item}</li>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}