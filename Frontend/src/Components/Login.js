import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';

const Login = (props) => {
    const host = 'http://localhost:1008'

    const [credentials, setCredentials] = useState({ email: "", password: "" })

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `${host}/api/auth/login`
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.

            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json)

        if (json.success) {
            //Save the auth token & redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("!!Logged in Successfully!!", "success")
            navigate("/");
        }
        else {
            props.showAlert("!Invalid Credentials!", "danger")
        }
    }


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='container'>

            <div className="postion-relative">
                <form onSubmit={handleSubmit} className='position-absolute start-50 translate-middle-x'>
                    <h2 >Login To Your Account</h2>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} />
                    </div>

                    <div className="mb-3">
                        <Link to="/forget" className='text-decoration-none'>Forgot Password?</Link>
                    </div>

                    <button type="submit" className="btn btn-outline-secondary px-3 py-2">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login