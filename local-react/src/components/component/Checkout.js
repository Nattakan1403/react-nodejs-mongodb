import React, { useContext, useEffect, useState } from "react";
import "../../style/Checkout.css"
import { userContext } from "../../contexts/Context";
import CardBasket from "../subcomponent/cardBasket";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {

    const [ user, setUser ] = useContext(userContext)
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ totalItem, setTotalItem ] = useState(0)
    const Navigate = useNavigate()

    useEffect(() => {
        let price = 0
        let item = 0
        if (user) {
            user.basket.forEach(i => {
                price += i.price * i.quantity
                item += i.quantity
            });
        }
        setTotalPrice(price)
        setTotalItem(item)
    },[user])

    const onCreateOrder = () => {
        let req = {
            userId : user.userId,
            totalPrice: totalPrice,
            totalItem: totalItem
        }
        fetch('/api/order/create', {
            method: "POST",
            body: JSON.stringify(req),
            headers: {'Content-Type':'application/json'}
        })
            .then((response) => response.json())
            .then((result) => {
                setUser(result)
                Navigate('/')
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="Checkout" style={{marginTop: "4.5rem"}}>
            <h2>Order Review</h2>
            <div className="checkout-content">
                <div className="checkout-preview">
                    {
                        user && user.basket.map((item, index) => {
                            return (
                                <div key={index}>
                                    <CardBasket product={item} />
                                    <hr style={{display: index < user.basket.length - 1 ? "block" : "none"}}/>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="checkout-card">
                    <div className="checkout-card-content">
                        <div className="checkout-card-header">
                            <h2>Order Total</h2>
                        </div>
                        <hr />
                        <div className="checkout-card-body">
                            {
                                user && user.basket.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div>
                                                <p className="checkpot-card-quantity">{item.quantity}</p>
                                                <p className="checkpot-card-name">{item.name}</p>
                                            </div>
                                            <p>${item.price}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <hr />
                        <div className="checkout-card-footer">
                            <div>
                                <p>Total</p>
                                <p>${totalPrice}</p>
                            </div>
                            <Link onClick={onCreateOrder}>PURCHASE</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}