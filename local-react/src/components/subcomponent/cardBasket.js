import React, { useContext, useState } from "react";
import { IoTrashOutline, IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import "../../style/cardBasket.css"
import { Link } from "react-router-dom";
import { userContext } from "../../contexts/Context";

export default function CardBasket(props) {

    const [ user, setUser ] = useContext(userContext)

    const onDelBasket = () => {
        let req = {
            userId: user.userId,
            productId: props.product._id
        }
        fetch("/api/product/delete/basket", {
            method: "POST",
            body: JSON.stringify(req),
            headers: {'Content-Type':'application/json'}
        })
            .then((response) => response.json())
            .then((result) => {
                setUser(result)
            })
            .catch((err) => console.log(err))
    }

    const onChangeQuantity = (operator) => {
        if ( operator === "minus" && props.product.quantity === 1) {
            onDelBasket()
        } else {
            let req = {
                userId: user.userId,
                productId: props.product._id,
                quantity: ( operator === "minus" ? props.product.quantity - 1 : props.product.quantity +1 )
            }
            fetch('/api/product/upadate/quantity', {
                method: "POST",
                body: JSON.stringify(req),
                headers: {'Content-Type':'application/json'}
            })
                .then((response) => response.json())
                .then((result) => {
                    setUser(result)
                })
                .catch((err) => console.log(err))
        }
    }

    return (
        <div className="CardBasket">
            <Link to={"/product-detail/" + props.product._id}>
                <img src={props.product.image} alt="" />
            </Link>
            <div className="card-basket-data">
                <div className="card-basket-name">
                    <Link to={"/product-detail/" + props.product._id}>{props.product.name}</Link>
                    <Link onClick={onDelBasket}><IoTrashOutline style={{fontSize: "1.2rem"}}/></Link>
                </div>
                <p className="card-basket-price">${props.product.price}</p>
                <div className="card-basket-quantity">
                    <Link onClick={() => onChangeQuantity("minus")}><IoRemoveCircleOutline style={{fontSize: "1.5rem"}}/></Link>
                    <p>{props.product.quantity}</p>
                    <Link onClick={() => onChangeQuantity("plus")}><IoAddCircleOutline style={{fontSize: "1.5rem"}}/></Link>
                </div>
            </div>
        </div>
    )
}