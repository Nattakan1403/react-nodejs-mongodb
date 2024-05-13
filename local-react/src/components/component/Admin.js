import React, { useContext, useEffect, useState } from "react";
import "../../style/Admin.css"
import { Link, useParams, useNavigate } from "react-router-dom"
import { orderContext, productContext } from "../../contexts/Context";

export default function Admin(props) {

    let order = props.order
    let user = props.user

    const Navigate = useNavigate()

    const { content } = useParams()

    if (user && user.profile === "Admin") {
        return (
            <div className="Admin" style={{marginTop: "4.5rem"}}>
                <div className="admin-contain">
                    <h2>Admin</h2>
                    <p>user id: {user.userId}</p>
                    <div className="admin-nav">
                        <Link to="/admin/home">Admin</Link>
                        <Link to="/admin/order">Order</Link>
                        <Link to="/admin/history">History</Link>
                    </div>
                    <hr />
                    <div className="admin-content">
                        {
                            ( content === "home" && <AdminHomePage/> ) ||
                            ( content === "order" && <AdminOrderPage/> ) ||
                            ( content === "history" && <AdminHistoryPage order={order}/> ) 
                        }
                    </div>
                </div>
            </div>
        )
    } else if (user && user.profile !== "Admin") {
        alert("เกิดข้อผิดพลาด")
    } else {
        Navigate('/login')
    }
}
function AdminHomePage() {
    /* --- variable --- */
    const category = ["All category", "Necklaces", "Earrings", "Bracelets", "Rings", "Charms"]

    const [ product, setProduct ] = useContext(productContext)
    const [ showProd, setShowProd ] = useState()

    useEffect(() => {
        setShowProd(product)
    },[product])

    const onShowOfCategory = (category) => {
        if (category === "All category") {
            setShowProd(product)
        } else {
            let item = []
            for (let i = 0; i < product.length; i++) {
                if (product[i].category === category) {
                    item.push(product[i])
                }
            }
            setShowProd(item)
        }
    }

    const onDeleteProduct = (productId) => {
        fetch('/api/product/del/' + productId)
            .then((response) => response.json())
            .then((result) => {
                setProduct(result)
            })
            .catch((err) => console.log(err))
    }
    
    if (showProd) {
        return (
            <div className="AdminHomePage">
                <div className="admin-filter">
                    <div>
                        { category.map((item, index) => <Link key={index} onClick={() => onShowOfCategory(item)}>{item}</Link>) }
                    </div>
                </div>
                <div className="admin-product">
                    <div className="admin-product-header">
                        <h2>All Product</h2>
                        <Link to="/admin/add-product">ADD PRODUCT</Link>
                    </div>
                    <div className={showProd.length !== 0 ? "admin-product-content": "admin-product-content-empty"}>
                        {
                            showProd.length !== 0 && showProd.map((item) => {
                                return (
                                    <div key={item._id} className="admin-product-card">
                                        <img src={"http://localhost:7000" + item.image} alt="" />
                                        <p>{item.name}</p>
                                        <p>${item.price}</p>
                                        <div>
                                            <Link to={"/admin/edit-product/" + item._id} className="admin-product-edit">EDIT</Link>
                                            <Link onClick={() => onDeleteProduct(item._id)} className="admin-product-del">DELETE</Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            showProd.length === 0 && <div>Product is currently empty...</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
function AdminOrderPage() {

    const [ order, setOrder ] = useContext(orderContext)

    const onSuccessOrder = (productId) => {
        fetch('/api/order/success', {
            method: "POST",
            body: JSON.stringify({productId: productId}),
            headers: {'Content-Type':'application/json'}
        })
            .then((response) => response.json())
            .then((result) => {
                setOrder(result)
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className={ order.length !== 0 ? "AdminOrderPage" : "AdminOrderPage-empty"}>
            {
                order.length !== 0 && order
                    .filter((item) => item.status === "In Progress")
                    .map((item) => {
                    return (
                        <div className="order-admin-card">
                            <div className="order-admin-header">
                                <h2>Order</h2>
                                <p>#{item._id}</p>
                            </div>
                            <hr />
                            <div className="order-admin-body">
                                <p>Customer Name : {item.customer}</p>
                                <p>{item.totalItem} Items :</p>
                                {
                                    item.order.map((item) => {
                                        return (
                                            <div className="order-admin-item">
                                                <div>
                                                    <p className="order-admin-quantity">{item.quantity}</p>
                                                    <p className="order-admin-name">{item.name}</p>
                                                </div>
                                                <p>${item.price}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <hr />
                            <div className="order-admin-footer">
                                <div>
                                    <p>Total</p>
                                    <p>${item.totalPrice}</p>
                                </div>
                                <Link onClick={() => onSuccessOrder(item._id)}>SUCCESS</Link>
                            </div>
                        </div>
                    )
                })
            }
            {
                order.length === 0 && <div>Order is currently empty...</div>
            }
        </div>
    )
}
function AdminHistoryPage(props) {
    return (
        <div className="AdminHistoryPage">
            <table>
                <tr>
                    <th>Order No.</th>
                    <th>Customer Name</th>
                    <th>Product</th>
                    <th>Tatal Item</th>
                    <th>Tatal Price</th>
                    <th>Date</th>
                </tr>

                {
                    props.order.length !== 0 && props.order.map((item) => {
                        let content 
                        if (item.status === "Success") {
                            content = (
                                <tr>
                                    <td>{item._id}</td>
                                    <td>{item.customer}</td>
                                    <td>
                                        {
                                            item.order.map((item) => {
                                                return (
                                                    <div>
                                                        <img src={item.image} alt="" />
                                                        <div>
                                                            <p>{item.quantity}</p>
                                                            <p>{item.name}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </td>
                                    <td>{item.totalItem}</td>
                                    <td>{item.totalPrice}</td>
                                    <td>{item.Date}</td>
                                </tr>
                            )
                        }
                        return content
                    })
                }
            </table>
            {
                props.order.length === 0 && <div style={{marginTop: '2rem', textAlign: 'center'}}>History is currently empty...</div>
            }
        </div>
    )
}