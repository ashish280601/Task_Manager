import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Tasks = () => {
  const [addTask, setAddTask] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { togglePassword, isLoading } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // write your code logic here.
      const res = await dispatch(addInstructorData(inputData));
      console.log("res data from add task", res);
      if (res.payload.data.data.success) {
        fetchInstructorData();
        setinputData({});
        return;
      }
    } catch (error) {
      console.error("error while adding student data", error);
    }
  };
  
  return (
    <section className="">
      <div className="container">
        <div className="col-md-6 left_box">
          <div className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Title
                </label>
                <div className="position-relative">
                  <input
                    name="title"
                    value={addTask?.title || ""}
                    onChange={handleChange}
                    placeholder="Enter title"
                    type="text"
                    id="title"
                    className="form-control bg-light border-light"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="Password">
                  Description
                </label>
                <div className="position-relative password_box">
                  <textarea
                    name="description"
                    value={addTask?.description || ""}
                    onChange={handleChange}
                    placeholder="Enter description"
                    type="text"
                    id="description"
                    className="form-control bg-light border-light"
                  />
                </div>
              </div>
              <div className="mt-2">
                <button type="submit" className="btn btn-primary w-100">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Tasks
