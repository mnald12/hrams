import { useContext, useState } from "react";
import "../css/loginpage.css";
import { login } from "../methods/methods";
import pdlogo from "../ptdzlogo.png";
import { DataContext } from "../App";

const LoginPage = () => {
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const { setIsLogin } = useContext(DataContext);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!uname || !pwd) {
      setError("Username and Password are required.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }

    try {
      const response = await login(uname, pwd);
      if (response) {
        setIsLogin(true);
        sessionStorage.setItem("isLogin", JSON.stringify(true));
      } else {
        setError("Invalid credentials");
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <div className="form-containers">
      <div className="form-logo">
        <img alt="logo" src={pdlogo} />
      </div>
      <form className="form" onSubmit={submit}>
        <h2>Login</h2>
        <div className="input">
          {error && (
            <p style={{ color: "red" }} className="error-message">
              {error}
            </p>
          )}
          <div className="inputBox">
            <label>Username:</label>
            <input
              type="text"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              placeholder="example@xyz.com"
              autoComplete="off"
            />
          </div>
          <div className="inputBox">
            <label>Password:</label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="*******"
              autoComplete="off"
            />
          </div>
          <div className="inputBox">
            <input type="submit" value="Sign in" />
          </div>
        </div>
        <p className="forget">
          Forgot Password? <a href="#reset">Click Here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
