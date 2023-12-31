import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    //password2: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password /*password2*/ } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <>
      <section className="heading">
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="name"
              className="form-control"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={handleChange}
            />
          </div>
          {/*          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={handleChange}
            />
  </div>*/}
          <div className="form-group">
            <button disabled={loading} type="submit" className="btn btn-block">
              {loading ? "Loading..." : "Sign up"}
            </button>
          </div>
          <OAuth />
        </form>
        <div className="form-group">
          <Link to="/sign-in">
            <p>
              I have an account?{" "}
              <span style={{ color: "blue", textDecoration: "underline" }}>
                Click here
              </span>
            </p>
            <p style={{ color: "red" }}>{error && "Something went wrong"}</p>
          </Link>
        </div>
      </section>
    </>
  );
};

export default SignUp;
