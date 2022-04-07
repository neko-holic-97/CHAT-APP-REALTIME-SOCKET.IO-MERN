import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./_login.scss";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../store/action/authAction";
import { useAlert } from "react-alert";
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from "../../store/types/authType";

const Login = ({ history }) => {
  const dispatch = useDispatch();

  const alert = useAlert();
  const { authenticate, error, successMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const login = (e) => {
    e.preventDefault();

    dispatch(userLogin(state));
  };

  useEffect(() => {
    if (authenticate) {
      history.push("/");
    }
    if (successMessage) {
      alert.success(successMessage);
      dispatch({ type: SUCCESS_MESSAGE_CLEAR });
    }
    if (error) {
      error.map((err) => alert.error(err));
      dispatch({ type: ERROR_CLEAR });
    }
  }, [successMessage, error, authenticate, history, alert, dispatch]);

  return (
    <div className="login">
      <div className="card">
        <div className="card-header">
          <h3>Login</h3>
        </div>
        <div className="card-body">
          <form onSubmit={login}>
            <div className="input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email"
                id="email"
                name="email"
                onChange={inputHandle}
                value={state.email}
              />
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="password"
                id="password"
                name="password"
                onChange={inputHandle}
                value={state.password}
              />
            </div>

            <div className="button">
              <input type="submit" value="Login" className="btn" />

              <span>
                <Link to="/messenger/register" className="link">
                  Create an account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
