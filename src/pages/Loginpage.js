import { useState } from "react";
import "../css/loginpage.css";
import { login } from "../methods/methods"; // Ensure login is secure on the backend
import pdlogo from "../ptdzlogo.png";

const LoginPage = () => {
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!uname || !pwd) {
      setError("Username and Password are required.");
      return;
    }

    try {
      const response = await login(uname, pwd);
      if (response.success) {
        console.log("Login successful!");
        // Redirect user or perform other actions
      } else {
        setError(response.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form-containers">
      <div className="form-logo">
        <img alt="logo" src={pdlogo} />
      </div>
      <form className="form" onSubmit={submit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input">
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
