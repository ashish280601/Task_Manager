import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword, togglePasswordVisibility } from "../../slice/authSlice";

const ForgetPassword = ({ onLogout }) => {
  const [changePassword, setChangePassword] = useState({});
  const navigate = useNavigate();
  const dispatach = useDispatch();
  const { isLoading, togglePassword, isSession } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleTogglePassword(field) {
    dispatach(togglePasswordVisibility(field));
  }

  async function handleForgetPassword(e) {
    e.preventDefault();
    try {
      if (changePassword.newPassword !== changePassword.confirmPassword) {
        return;
      }
      const res = await dispatach(
        resetPassword({
          newPassword: changePassword.newPassword,
        })
      ).unwrap();
      console.log(res);
      // Force a page reload
      // Clear the session
      sessionStorage.removeItem("userData");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error while changing password", error);
    }
  }
  
  return (
    <>
      <section className="ForgetPassword_sec">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-md-offset-4">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="text-center">
                    <h3>
                      <i className="fa fa-lock fa-4x"></i>
                    </h3>
                    <h2 className="text-center">Forgot Password?</h2>
                    <p>You can reset your password here.</p>
                    <div className="panel-body">
                      <form
                        id="register-form"
                        role="form"
                        autocomplete="off"
                        className="form"
                        // method="post"
                        onSubmit={handleForgetPassword}
                      >
                        <div className="form-group">
                          <div className="input-group">
                            <input
                              id="email"
                              name="newPassword"
                              value={changePassword.newPassword}
                              placeholder="New password"
                              className="form-control"
                              type={
                                togglePassword.newPassword ? "text" : "Password"
                              }
                              onChange={handleChange}
                            />
                            <span
                              className="input-group-addon"
                              onClick={() =>
                                handleTogglePassword("newPassword")
                              }
                            >
                              {togglePassword.newPassword ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="2.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="bevel"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="2.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="bevel"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group">
                            <input
                              id="email"
                              name="confirmPassword"
                              value={changePassword.confirmPassword}
                              placeholder="Confirm Password"
                              className="form-control"
                              type={
                                togglePassword.confirmPassword
                                  ? "text"
                                  : "Password"
                              }
                              onChange={handleChange}
                            />
                            <span
                              className="input-group-addon"
                              onClick={() =>
                                handleTogglePassword("confirmPassword")
                              }
                            >
                              {togglePassword.confirmPassword ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="2.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="bevel"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#000000"
                                  stroke-width="2.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="bevel"
                                >
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="form-group">
                          <input
                            name="recover-submit"
                            className="btn btn-lg btn-primary btn-block"
                            value="Reset Password"
                            type="submit"
                          />
                        </div>

                        {/* <input
                          type="hidden"
                          className="hide"
                          name="token"
                          id="token"
                          value=""
                        /> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;