import React, { useEffect, useState } from "react";
import "../../style/Order.css"

export default function Order(props) {
    const [ order, setOrder ] = useState()

    useEffect(() => {
        if (props.user.username) {
            let url = '/api/order/get/' + props.user.username
            fetch( url )
                .then((respones) => respones.json())
                .then((result) => {
                    console.log(result);
                    setOrder(result)
                })
        }
    },[props.user.username])

    return (
        <div className="Order" style={{marginTop: "4.5rem"}}>
            <h2>My Order</h2>
            <hr />
            <div className="order-content-card">
                {
                    order && order.map((item, index) => {
                        return (
                            <div className="order-card" key={index}>
                                <div className="order-card-header">
                                    <h2>Order</h2>
                                    <p>#{item._id}</p>
                                    <p>Status: <span style={{color: item.status === "In Progress" ? "#B18165" : "#5d8d6f"}}>{item.status}</span></p>
                                </div>
                                <hr />
                                <div className="order-card-body">
                                    {
                                        item.order.map((item, index) => {
                                            return (
                                            <div className="order-product-item" key={index}>
                                                <div>
                                                    <p className="order-product-quantity">{item.quantity}</p>
                                                    <p className="order-product-name">{item.name}</p>
                                                </div>
                                                <p>${item.price}</p>
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                                <hr />
                                <div className="order-card-footer">
                                    <p>Total</p>
                                    <p>${item.totalPrice}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
