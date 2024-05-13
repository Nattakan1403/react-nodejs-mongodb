import React, { useContext, useEffect, useRef, useState } from "react";
import "../../style/Login.css"
import imgBG from "../../image/Frame1.png"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { userContext } from "../../contexts/Context";

export default function Login() {

    /* useContext */
    const [user, setUser] = useContext(userContext)

    /* useRef */
    const remember = useRef()

    /* useState */
    const [alluser, setAllUser] = useState([])

    /* useForm */
    const { register, getValues, handleSubmit, formState: {errors} } = useForm()

    /* useNavigate */
    let Navigate = useNavigate()

    /* useEffect : first render */
    useEffect(() => {
        if (user !== null) {
            Navigate("/")
        } else (
            fetch('/api/profile/get')
                .then((response) => response.json())
                .then((result) => {
                    setAllUser(result)
                })
                .catch((err) => console.log(err))
        )
    },[])

    /* function */
    const onSubmit = (data) => {
        data.remember = remember.current.checked 
        console.log(data);
        fetch('/api/profile/login', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type':'application/json'}
        })
            .then((response) => response.json())
            .then((result) => {
                alert(`เข้าสู่ระบบสำเร็จ username: ${result.username}`)
                setUser(result)
                Navigate("/")
            })
            .catch((err) => {
                console.log(err);
                alert("เข้าสู้ระบบไม่สำเร็จ")
            })
    }

    return (
        <div className="Login" style={{marginTop: "4.5rem"}}>
            <div className="login-contain">
                <img src={imgBG} alt="" />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Login</h2>
                    <input 
                        type="text" 
                        placeholder="Username"
                        name="username"
                        {...register('username', {
                            required: {
                                value: true,
                                message: "Username is require."
                            }
                        })}
                    />
                    { errors.username && <div className="err-message">* {errors.username.message}</div> }
                    <input 
                        type="password" 
                        placeholder="Passsword"
                        name="password"
                        {...register('password', {
                            required: {
                                value: true,
                                message: "Password is require."
                            },
                            validate: (value) => {
                                let validLogin = false
                                let username = getValues('username')
                                alluser.forEach(i => {
                                    if (username === i.username && value === i.password) {
                                        validLogin = true
                                    }
                                })
                                return validLogin || "incorrect username or password. Please try again."
                            }
                        })}
                    />
                    { errors.password && <div className="err-message">* {errors.password.message}</div> }
                    <div className="login-remember">
                        <input 
                            type="checkbox" 
                            id="remember"
                            name="remember"
                            ref={remember}
                        />
                        <label htmlFor="remember">Remember Me?</label>
                    </div>
                    <button type="submit">Login</button>
                    <div className="login-regis">
                        <Link to="/register">Sign Up</Link>
                        <span> , Don't have an account?</span>
                    </div>
                </form>
            </div>
        </div>
    )
}