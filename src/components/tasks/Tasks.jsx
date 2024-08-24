import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addTask } from "../../slice/taskSlice";
import TaskModal from "./taskModal/Task";

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const dispatch = useDispatch();

  const handleViewDetails = (task) => {
    setModalData({
      title: task.title,
      description: task.description,
      createdAt: task.createdAt
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const tasks = [
    { title: 'Task 6', description: 'Description 6', createdAt: '01/09/2021, 05:30:00' },
    // Add more tasks here...
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // write your code logic here.
      const res = await dispatch(addTask(inputTask));
      console.log("res data from add task", res);
      if (res.payload.data.success) {
        setInputTask({});
        return;
      }
    } catch (error) {
      console.error("error while adding student data", error);
    }
  };
  
  return (
    <div className="task-board">
    <div className="task-header">
      <button className="add-task-btn">Add Task</button>
      <input type="text" className="search-input" placeholder="Search..." />
      <select className="sort-select">
        <option value="recent">Sort by: Recent</option>
        <option value="oldest">Sort by: Oldest</option>
      </select>
    </div>

    <div className="columns">
      <div className="column">
        <h2 className="column-title">TODO</h2>
        <div className="task-card">
          <h3>Task 1</h3>
          <p>Description 1</p>
          <span>Created on: 01/01/2023</span>
          <div className="task-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
            <button className="view-btn">View Details</button>
          </div>
        </div>
        <div className="task-card">
          <h3>Task 2</h3>
          <p>Description 2</p>
          <span>Created on: 02/01/2023</span>
          <div className="task-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
            <button className="view-btn">View Details</button>
          </div>
        </div>
      </div>
      <div className="column">
        <h2 className="column-title">IN-PROGRESS</h2>
        <div className="task-card">
          <h3>Task 5</h3>
          <p>Description 5</p>
          <span>Created on: 05/01/2023</span>
          <div className="task-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
            <button className="view-btn" onClick={() => handleViewDetails()}>View Details</button>
          </div>
        </div>
      </div>
      <div className="column">
        <h2 className="column-title">DONE</h2>
        {tasks.map((task, index) => (
          <div className="task-card" key={index}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span>Created on: {task.createdAt}</span>
            <div className="task-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
              <button className="view-btn" onClick={() => handleViewDetails(task)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
      <TaskModal
        show={showModal}
        handleClose={handleClose}
        title={modalData.title}
        description={modalData.description}
        createdAt={modalData.createdAt}
      />
    </div>
  </div>
    // <section className="">
    //   <div className="container">
    //     <div className="col-md-6 left_box">
    //       <div className="mt-4">
    //         <form onSubmit={handleSubmit}>
    //           <div className="mb-3">
    //             <label className="form-label" htmlFor="email">
    //               Title
    //             </label>
    //             <div className="position-relative">
    //               <input
    //                 name="title"
    //                 value={inputTask?.title || ""}
    //                 onChange={handleChange}
    //                 placeholder="Enter title"
    //                 type="text"
    //                 id="title"
    //                 className="form-control bg-light border-light"
    //               />
    //             </div>
    //           </div>
    //           <div className="mb-3">
    //             <label className="form-label" htmlFor="Password">
    //               Description
    //             </label>
    //             <div className="position-relative password_box">
    //               <textarea
    //                 name="description"
    //                 value={inputTask?.description || ""}
    //                 onChange={handleChange}
    //                 placeholder="Enter description"
    //                 type="text"
    //                 id="description"
    //                 className="form-control bg-light border-light"
    //               />
    //             </div>
    //           </div>
    //           <div className="mt-2">
    //             <button type="submit" className="btn btn-primary w-100">
    //               Add Task
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  )
}

export default Tasks
