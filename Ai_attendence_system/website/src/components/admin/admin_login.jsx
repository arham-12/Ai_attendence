import React from 'react'
import { Link } from 'react-router-dom';

const admin_login = () => {
  return (
    <>
    <div className="login px-5 w-full h-screen flex flex-col justify-center items-center ">
      <div className="login-form px-5 w-full lg:w-[30%] flex flex-col justify-center border-2 border-primary rounded-lg py-5 items-center">
        <div className="heading text-2xl lg:text-4xl font-bold py-5">
          Login
        </div>
        <form className="form text-black w-full px-5 flex flex-col gap-3 justify-center items-center">
          <input
            className="px-3 py-2 border border-primary outline-none rounded-lg w-full"
            // value={inputs.username}
            // onChange={onChangeHandler}
            name="username"
            placeholder="Enter username"
            type="text"
          />
          <input
            className="px-3 py-2 border border-primary outline-none rounded-lg w-full"
            // value={inputs.password}
            // onChange={onChangeHandler}
            name="password"
            placeholder="Enter password"
            type="password"
          />
          <button
            // onClick={onSubmitHandler}
            className="w-full rounded-lg py-2 bg-primary text-white"
          >
            Login
          </button>
        </form>
        <p className="my-2 text-sm">
          Want account ?{" "}
          <Link to={"/signup"} className="text-primary font-medium">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  </>
  )
}

export default admin_login
