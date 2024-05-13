import React, { useContext, useEffect, useState } from "react";
import imgBG from "../../image/Frame2.png"
import "../../style/Register.css"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { userContext } from "../../contexts/Context";

function Register() {

    /* useContext */
    const [user, setUser] = useContext(userContext)

    /* useState */
    const [account, setAccount] = useState("Client")
    const [allUser, setAllUser] = useState([])

    /* useForm */
    const { register, getValues, handleSubmit, formState: {errors} } = useForm()

    /* useNavigate */
    const Navigate = useNavigate()

    /* useEffect : first render */
    useEffect(() => {
        if (user !== null) {
            Navigate("/")
        } else {
            fetch('/api/profile/get')
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    setAllUser(result)
                })
                .catch((err) => console.log(err))
        }
    })

    /* function */
    const onSelectAccount = (select) => {
        setAccount(select)
    }
    const onSubmit = (data) => {
        data.profile = account
        console.log(data);

        fetch('/api/profile/register', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type':'application/json'}
        })
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                if (result === "true") {
                    alert('สร้าง account สำเร็จ')
                    Navigate("/login")
                } else {
                    alert('เกิดข้อผิดพลาดในการสร้าง account กรุณ่ลองใหม่อีกครั้ง')
                }
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="Register" style={{marginTop: "4.5rem"}}>
            <div className="regis-contain">
                <img src={imgBG} alt="" />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Sign Up</h2>
                    <div className="regis-select-account">
                        <input 
                            type="checkbox" 
                            id="client"
                            name="client"
                            checked = {account === "Client" ? true : false}
                            onChange={() => onSelectAccount("Client")}
                        />
                        <label htmlFor="client">Client</label>
                        <input 
                            type="checkbox" 
                            id="admin"
                            name="admin"
                            checked = {account === "Admin" ? true : false}
                            onChange={() => onSelectAccount("Admin")}
                        />
                        <label htmlFor="admin">Admin</label>
                        { account === "Admin" &&
                            <input
                                type="text"
                                name="PrivateCodeForAdim"
                                placeholder="Private Code for Admin"
                                {...register('PrivateCodeForAdim',{
                                    validate: (value) => {
                                        return value === "#admin1234" || "Private Code invalid."
                                    }
                                })}
                            />
                        }
                        {(account === "Admin" && errors.PrivateCodeForAdim) && <div className="err-message">* {errors.PrivateCodeForAdim.message}</div>}
                        <hr />
                    </div>
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Username"
                        {...register('username', {
                            required: {
                                value: true,
                                message: "Username is require."
                            },
                            validate: (value) => {
                                let validUsername = true
                                allUser.forEach(i => {
                                    if (value === i.username) {
                                        validUsername=false
                                    }
                                });
                                return validUsername || "This userame is already taken."
                            }
                        })}
                    />
                    { errors.username && <div className="err-message">* {errors.username.message}</div> }
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password"
                        {...register('password',{
                            required: {
                                value: true,
                                message: "Password is Require."
                            },
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long."
                            }
                        })}
                    />
                    { errors.password && <div className="err-message">* {errors.password.message}</div> }
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {
                            required: {
                                value: true,
                                message: "Comfirm Password is require."
                            },
                            validate: (value) => {
                                let password = getValues('password')
                                let validPassword = false
                                if (value === password) {
                                    validPassword = true
                                }
                                return validPassword || "Password don't match."
                            }
                        })}
                    />
                    { errors.confirmPassword && <div className="err-message">* {errors.confirmPassword.message}</div> }
                    <button type="submit">SIGN UP</button>
                    <div className="regis-login">
                        <Link to="/login">Log in</Link>
                        <span> , Already have an account?</span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register