import React, { useContext, useState } from "react";
import "../../style/FromProduct.css"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { productContext } from "../../contexts/Context";

export default function AddProduct() {

    const { register, setValue, handleSubmit, formState: {errors} } = useForm()

    const [ product, setProduct ] = useContext(productContext)

    const [ previewIMG, setPreviewIMG] = useState()

    const [ file, setFile ] = useState()
    const [ name, setName ] = useState()
    const [ price, setPrice ] = useState()
    const [ category, setCategory ] = useState()
    const [ description, setDescription ] = useState()
    const [ detail, setDetail ] = useState()
    const [ tip, setTip ] = useState()

    const Navigate = useNavigate()

    const onPreviewImage = (e) => {
        if (e.target.files.length !== 0) {
            setPreviewIMG(URL.createObjectURL(e.target.files[0]))
            setFile(e.target.files[0])
        } else {
            setPreviewIMG()
            setFile()
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
        formData.append('name', name)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('detail', detail)
        formData.append('tip', tip)
        formData.append('category', category)
        formData.append('image', file)

        fetch('/api/product/add', {
            method: "POST",
            body: formData
        })
            .then((response) => response.json())
            .then((result) => {
                setProduct(result)
                Navigate('/admin/home')
            })
            .catch((err) => console.log(err)) 
    }

    return (
        <div className="FormProduct" style={{marginTop: "4.5rem"}}>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-product-img">
                    <img src={previewIMG} alt=""/>
                    <input 
                        type="file"
                        accept="image/*"
                        name="image"
                        {...register('image', {
                            required: {
                                value: true,
                                message: "Image is require."
                            }
                        })}
                        onChange={onPreviewImage}
                    />
                    { errors.image && <div className="err-message">{errors.image.message}</div> }
                </div>
                <div className="form-product-data">
                    <div className="form-product-category">
                        <label htmlFor="category">Category: </label>
                        <select name="category" id="category" defaultValue={""} onChange={onSelectCategory}>
                            <option value="" disabled>Please select category...</option>
                            <option value="Necklaces">Necklaces</option>
                            <option value="Earrings">Earrings</option>
                            <option value="Bracelets">Bracelets</option>
                            <option value="Rings">Rings</option>
                            <option value="Charms">Charms</option>
                        </select>
                        <input
                            type="hidden"
                            name="category"
                            {...register('category', {
                                required: {
                                    value: true,
                                    message: "Category is require."
                                }
                            })}
                        />
                        { errors.category && <span className="err-message">{errors.category.message}</span> }
                    </div>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Product Name"
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