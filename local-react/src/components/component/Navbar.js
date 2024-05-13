import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../style/Navbar.css"
import { IoHeartOutline, IoBagHandleOutline, IoPersonCircleOutline, IoClose } from "react-icons/io5";
import { userContext } from "../../contexts/Context";
import CardProduct from "../subcomponent/cardProduct";
import CardBasket from "../subcomponent/cardBasket";

export default function Navbar() {
    /* useContext */
    const [user, setUser] = useContext(userContext)

    /* --- variable --- */
    const category = ["Necklaces", "Earrings", "Bracelets", "Rings", "Charms"]
    
    /* --- State --- */
    const [openNav, setOpenNav] = useState("")
    const [ totalBasket, setTotalBasket ] = useState(0)

    /* useLocation */
    let location = useLocation()
    let locationPath = location.pathname

    /* --- function --- */
    useEffect(() => {
        setOpenNav("")
    }, [locationPath])

    useEffect(() => {
        console.log(user);
        let sum = 0
        if (user && user.basket) {
            user.basket.forEach(i => {
                sum += i.quantity 
            })
            setTotalBasket(sum)
        }
    }, [user])

    const onToggleNav = (nav) => {
        if (openNav !== nav) {
            setOpenNav(nav)
        } else {
            setOpenNav("")
        }
    }
    
    const onLogout = () => {
        fetch('/api/profile/logout')
            .then((response) => response.text())
            .then((result) => {
                if (result === "true") {
                    setUser(null)
                    alert("logout สำเร็จ")
                } else {
                    alert("logout ไม่สำเร็จ")
                }
            })
            .catch((err) => console.log(err))

        setOpenNav("")
    }

    return (
        <div className="Navbar">
            <div className="nav-container">
                <div className="nav-menu">
                    <Link 
                        onClick={() => onToggleNav("category")} 
                        style={{color: openNav === "category" ? "#B18165" : "#525252"}}
                    >
                        JEWELRY
                    </Link>
                    <Link to="/new-releases">NEW RELEASES</Link>
                </div>
                <div className="nav-home">
                    <Link to="/">A P O L L O N I A N</Link>
                </div>
                <div className="nav-account">
                    <div className={user ? "nav-account-close" : "nav-account-open"}>
                        <Link to="/login">LOGIN</Link>
                        <Link to="/register">SIGN UP</Link>
                    </div>
                    <div className={(user && user.profile === "Client") ? "nav-account-open" : "nav-account-close"}>
                        <Link onClick={() => onToggleNav("like")}><IoHeartOutline style={{fontSize: "1.25rem"}}/></Link>
                        <Link onClick={() => onToggleNav("basket")}><IoBagHandleOutline style={{fontSize: "1.25rem"}}/></Link>
                        <Link onClick={() => onToggleNav("Client")} ><IoPersonCircleOutline style={{fontSize: "1.25rem"}}/></Link>
                    </div>
                    <div className={(user && user.profile === "Admin") ? "nav-account-open" : "nav-account-close"}>
                        <Link 
                            onClick={() => onToggleNav("Admin")} 
                            style={{
                                color: openNav === "Admin" ? "#B18165" : "#525252",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'end'
                            }}
                        ><IoPersonCircleOutline style={{fontSize: "1.25rem"}}/><span style={{marginLeft: '0.25rem'}}>ADMIN</span></Link>
                    </div>
                </div>
            </div>

            <div className={openNav === "category" ? "nav-open-action" : "nav-close-action"}>
                <div className="nav-category">
                    {
                        category.map((item, index) => <Link to={"/category/" + item} key={index}>{item}</Link>)
                    }
                </div>
            </div>

            <div className={openNav === "like" ? "nav-open-action" : "nav-close-action"}>
                <div className="nav-like">
                    <div className="nav-like-content">
                        <div className="nav-like-header">
                            <div>
                                <IoHeartOutline style={{fontSize: "1.25rem"}}/>
                                <h2>My Favorites</h2>
                            </div>
                            <Link onClick={() => onToggleNav("like")}><IoClose style={{fontSize: "1.5rem"}}/></Link>
                        </div>
                        <div className={user && user.like.length !== 0 ? "nav-like-body" : "nav-like-body-empty"}>
                            {
                                user && user.like.map((item,index) => <CardProduct key={index} product={item}/>)
                            }
                            {
                                (user && user.like.length === 0) && <div>Your favorite is currently empty...</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={openNav === "basket" ? "nav-open-action" : "nav-close-action"}>
                <div className="nav-basket">
                    <div className="nav-basket-content">
                        <div className="nav-basket-header">
                            <div>
                                <IoBagHandleOutline style={{fontSize: "1.5rem"}}/>
                                <h2>In My Bag</h2>
                            </div>
                            <Link onClick={() => onToggleNav("basket")}><IoClose style={{fontSize: "1.5rem"}}/></Link>
                        </div>
                        <div className="nav-basket-body">
                            {
                                user && user.basket.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <CardBasket product={item}/>
                                            <hr style={{display: index < user.basket.length - 1 ? "block" : "none"}}/>
                                        </div>
                                    )
                                })
                            }
                            { user && user.basket.length === 0 && <div style={{padding: "50% 0%", textAlign: "center"}}>Your bag is currently empty...</div> }
                        </div>
                        <div className="nav-basket-footer">
                            <Link to="/checkout">CHECKOUT {"(" + totalBasket + ")"}</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={openNav === "Client" ? "nav-open-action" : "nav-close-action"}>
                    <div className="nav-client">
                        <Link to="/order">Order</Link>
                        <Link onClick={onLogout}>Log out</Link>
                    </div>
            </div>

            <div className={openNav === "Admin" ? "nav-open-action" : "nav-close-action"}>
                    <div className="nav-admin">
                        <Link to="/admin/home">Admin</Link>
                        <Link onClick={onLogout}>Log out</Link>
                    </div>
            </div>
        </div>
    )
}