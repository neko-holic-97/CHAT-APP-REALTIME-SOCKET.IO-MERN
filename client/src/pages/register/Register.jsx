import React, { useEffect, useState } from "react";
import "./_register.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../store/action/authAction";
import { useAlert } from "react-alert";
import { SUCCESS_MESSAGE_CLEAR, ERROR_CLEAR } from "../../store/types/authType";

const Register = ({ history }) => {
  const dispatch = useDispatch();

  const alert = useAlert();
  const { loading, authenticate, error, successMessage, myInfo } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const [loadImg, setLoadImg] = useState("");

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const fileHandle = (e) => {
    if (e.target.files.length !== 0) {
      setState({
        ...state,
        [e.target.name]: e.target.files[0],
      });
    }

    const reader = new FileReader();

    reader.onload = () => {
      setLoadImg(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const registerHandle = (e) => {
    e.preventDefault();

    const { userName, email, password, confirmPassword, image } = state;

    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", image);

    dispatch(userRegister(formData));
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
  }, [successMessage, error]);

  return (
    <div className="register">
      <div className="card">
        <div className="card-header">
          <h3>Register</h3>
        </div>
        <div className="card-body">
          <form onSubmit={registerHandle}>
            <div className="input">
              <div className="fileImg">
                <div className="image">
                  {loadImg ? <img src={loadImg} alt="" className="img" /> : ""}
                </div>
                <div className="file">
                  <label htmlFor="image">Add photo</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={fileHandle}
                  />
                </div>
              </div>
            </div>
            <div className="input">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="username"
                id="username"
                onChange={inputHandle}
                name="userName"
                value={state.userName}
              />
            </div>
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
                onChange={inputHandle}
                name="password"
                value={state.password}
              />
            </div>
            <div className="input">
              <label htmlFor="password">Confirm password</label>
              <input
                type="password"
                className="form-control"
                placeholder="confirm password"
                id="confirmPassword"
                onChange={inputHandle}
                name="confirmPassword"
                value={state.confirmPassword}
              />
            </div>
            <div className="button">
              <input type="submit" value="Submit" className="btn" />

              <span>
                Already have account?
                <Link to="/messenger/login" className="link">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
