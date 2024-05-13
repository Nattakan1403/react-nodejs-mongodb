import React, { useContext, useEffect, useState } from "react";
import "../../style/FromProduct.css"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { productContext } from "../../contexts/Context";

export default function EditProduct() {

    const { productID } = useParams()

    const [ prevData, setPrevdata ] = useState()
    const [ previewIMG, setPreviewIMG ] = useState()

    const [ product, setProduct ] = useContext(productContext)

    const [ image, setImage ] = useState()
    const [ name, setName ] = useState()
    const [ price, setPrice ] = useState()
    const [ category, setCategory ] = useState()
    const [ description, setDescription ] = useState()
    const [ detail, setDetail ] = useState()
    const [ tip, setTip ] = useState()

    const { register, setValue, handleSubmit, formState: {errors} } = useForm()

    const Navigate = useNavigate()

    useEffect(() => {
        if (product) {
            product.forEach(i => {
                if (i._id === productID) {
                    console.log(i);
                    setPrevdata(i)
                    setPreviewIMG("http://localhost:7000" + i.image)
                    setName(i.name)
                    setPrice(i.price)
                    setDescription(i.description)
                    setDetail(i.detail)
                    setTip(i.tip)
                    setCategory(i.category)
                    setImage(i.image)
                }
            })
        }
    },[product, productID])

    const onPreviewImage = (e) => {
        if (e.target.files.length !== 0) {
            setPreviewIMG(URL.createObjectURL(e.target.files[0]))
            setImage(e.target.files[0])
        } else {
            setPreviewIMG()
            setImage()
        }
    }

    const onSelectCategory = (e) => {
        if (e.target.value !== "") {
            setValue('category', e.target.value)
            setCategory(e.target.value)
        }
    }

    const onSubmit = () => {
        const formData = new FormData()
        formData.append('productId', productID)
        formData.append('name', name)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('detail', detail)
        formData.append('tip', tip)
        formData.append('category', category)
        formData.append('image', image)

        fetch('/api/product/edit', {
            method: "POST",
            body: formData
        })
            .then((response) => response.json())
            .then((result) => {
                setProduct(result)
                Navigate("/admin/home")
            })
            .catch((err) => console.log(err))
    }

    if (prevData) {
        return (
            <div className="FormProduct" style={{marginTop: "4.5rem"}}>
                <h2>Edit Product</h2>
                <p>product id : {prevData._id}</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-product-img">
                        <img src={ previewIMG } alt=""/>
                        <input 
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={onPreviewImage}
                        />
                    </div>
                    <div className="form-product-data">
                        <div className="form-product-category">
                            <label htmlFor="category">Category: </label>
                            <select name="category" id="category" defaultValue={prevData.category} onChange={onSelectCategory}>
                                <option value="" disabled>Please select category...</option>
                                <option value="Necklaces">Necklaces</option>
                                <option value="Earrings">Earrings</option>
                                <option value="Bracelets">Bracelets</option>
                                <option value="Rings">Rings</option>
                                <option value="Charms">Charms</option>
                            </select>
                        </div>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Product Name"
                            defaultValue={prevData.name}
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: "Product Name is require."
                                }
                            })}
                            onChange={(e) => setName(e.target.value)}
                        />
                        { errors.name && <div className="err-message">{errors.name.message}</div> }
                        <input 
                            type="number" 
                            name="price" 
                            placeholder="Price"
                            defaultValue={prevData.price}
                            {...register('price', {
                                required: {
                                    value: true,
                                    message: "Price is require."
                                }
                            })}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        { errors.price && <div className="err-message">{errors.price.message}</div> }
                        <input 
                            type="text" 
                            name="description" 
                            placeholder="Description"
                            defaultValue={prevData.description}
                            {...register('description', {
                                required: {
                                    value: true,
                                    message: "Description is require."
                                }
                            })}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        { errors.description && <div className="err-message">{errors.description.message}</div> }
                        <input 
                            type="text" 
                            name="detail" 
                            defaultValue={prevData.detail.join(', ')}
                            placeholder="Detail (Ex: item1, item2, item3)"
                            {...register('detail', {
                                required: {
                                    value: true,
                                    message: "Detail is require."
                                }
                            })}
                            onChange={(e) => setDetail(e.target.value)} 
                        />
                        { errors.detail && <div className="err-message">{errors.detail.message}</div> }
                        <input 
                            type="text" 
                            name="tip" 
                            placeholder="Tip & Warnning (Ex: item1, item2, item3)"
                            defaultValue={prevData.tip.join(', ')}
                            {...register('tip', {
                                required: {
                                    value: true,
                                    message: "Tip & Warnning is require."
                                }
                            })}
                            onChange={(e) => setTip(e.target.value)}
                        />
                        { errors.tip && <div className="err-message">{errors.tip.message}</div> }
                        <div className="form-product-btn">
                            <button type="submit">SUBMIT</button>
                            <Link>CANCEL</Link>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}