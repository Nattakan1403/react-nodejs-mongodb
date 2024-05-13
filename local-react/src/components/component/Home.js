import React from "react";
import imgCat1 from "../../image/catagory1.png"
import imgCat2 from "../../image/catagory2.png"
import imgCat3 from "../../image/catagory3.png"
import imgCat4 from "../../image/catagory4.png"
import imgCat5 from "../../image/catagory5.png"
import imgBG from "../../image/Frame1.png"
import "../../style/Home.css"
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import CardProduct from "../subcomponent/cardProduct";

export default function Home(props) {

    let product = props.product
    console.log(product);

    let category = [
        {
            name: "Necklaces",
            img: imgCat1
        },{
            name: "Earrings",
            img: imgCat2
        },{
            name: "Bracelets",
            img: imgCat3
        },{
            name: "Rings",
            img: imgCat4
        },{
            name: "Charms",
            img: imgCat5
        }
    ]

    return (
        <div className="Home" style={{marginTop: "4.5rem"}}>
            <div className="home-intro">
                <p>HOME PAGE</p>
                <h2>APOLLONAIN</h2>
                <p>
                Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
            <img src={imgBG} alt="" />
            <div className="home-category">
                <h2>Shop by category</h2>
                <p>Indulge in what we offer.</p>
                <div className="home-category-link">
                    {
                        category.map((item, index) => {
                            return (
                                <Link to={"/category/" + item.name} key={index} className="home-category-card">
                                    <img src={item.img} alt="" />
                                    <p>{item.name}</p>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className="home-allProduct">
                <div className="home-allProduct-header">
                    <h2>All Product</h2>
                    <div>
                        <input type="text" placeholder="Search..."/>
                        <button><IoSearchOutline/></button>
                    </div>
                </div>
                <div className="home-allProduct-body">
                    {
                        product && product.map((item) => <CardProduct key={item._id} product={item}/>)
                    }
                </div>
            </div>
        </div>
    )
}