import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {

  const host = 'http://localhost:1008'

  const [credentials, setCredentials] = useState({ name: "", dob: "", email: "", password: "", cpassword: "" })

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `${host}/api/auth/createUser`
    const { name, dob, email, password } = credentials;
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ name, dob, email, password })
    });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      //Save the auth token & redirect
      localStorage.setItem('token', json.authToken);
      props.showAlert("!!Account Created Successfully!!", "success")
      navigate("/");
    }
    else {
      props.showAlert("!Account Already Exists!", "danger")
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  return (
    <div className='container postion-relative'>
      <form onSubmit={handleSubmit} className='position-absolute start-50 translate-middle-x'>
        <h2 className='mb-4 text-dark-emphasis'>Create Your Account</h2>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" />
        </div>

        <div className="mb-3">
          <label htmlFor="dob" className="form-label">Date Of Birth</label>
          <input type="date" className="form-control" id="dob" name='dob' onChange={onChange} aria-describedby="dobHelp" />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required />
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
        </div>

        <button type="submit" className="btn btn-outline-secondary px-3 py-2">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup