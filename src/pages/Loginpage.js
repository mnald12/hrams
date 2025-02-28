import { useState } from "react";
import "../css/loginpage.css";
import { login } from "../methods/methods";
import pdlogo from "../ptdzlogo.png";

const LoginPage = () => {
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await login(uname, pwd);
  };
  return (
    <div className="form-containers">
      <div className="form-logo">
        <img alt="logo" src={pdlogo} />
      </div>
      <form className="form" onSubmit={(e) => submit(e)}>
        <h2>Login</h2>
        <div className="input">
          <div className="inputBox">
            <label>Username :</label>
            <input
              type="text"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              placeholder="example@xyz.com"
            />
          </div>
          <div className="inputBox">
            <label>Password :</label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="******* "
            />
          </div>
          <div className="inputBox">
            <input type="submit" value="Sign in" />
          </div>
        </div>
        <p className="forget">
          Forgot Password? <a href="#sddsd">Click Here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
