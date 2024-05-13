import React from "react";
import "../../style/cardProduct.css"
import { Link } from "react-router-dom";

export default function CardProduct(props) {

    return (
        <Link to={"/product-detail/" + props.product._id} className="CardProduct">
            <img src={props.product.image} alt="" />
            <p className="card-product-name">{props.product.name}</p>
            <p className="card-product-price">${props.product.price}</p>
        </Link>
    )
}