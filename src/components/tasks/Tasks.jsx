import React, { useState } from "react";


import ViewTask from "./taskModal/ViewTask";
import AddNEdit from "./taskModal/AddNEditTask";

const Tasks = () => {
  const [showModal, setShowModal] = useState({
    addTask: false,
    editTask: false,
    ViewTask: false
  });

  const handleOpen = (task) => {
    if(task === 'add'){
      setShowModal({addTask:true});
    }else if(task === 'edit'){
      setShowModal({editTask:true})
    }else{
      setShowModal({ViewTask:true})
    }
  };

  const handleClose = (task) => {
    if(task === 'add'){
      setShowModal({addTask:false});
    }else if(task === 'edit'){
      setShowModal({editTask:false})
    }else{
      setShowModal({ViewTask:false})
    }
  };
  console.log("showModal", showModal);
  
  const tasks = [
    { title: 'Task 6', description: 'Description 6', createdAt: '01/09/2021, 05:30:00' },
    // Add more tasks here...
  ];
  
  return (
    <div className="task-board">
    <div className="task-header">
      <button className="add-task-btn" onClick={() => handleOpen('add')}>Add Task</button>
      <AddNEdit 
        show={showModal.addTask}
        handleClose={handleClose}
      />
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
            <button className="view-btn" onClick={() => handleOpen('views')}>View Details</button>
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
              <button className="view-btn" onClick={() => handleOpen(task)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
      <ViewTask
        show={showModal.ViewTask}
        handleClose={handleClose}
      />
    </div>
  </div>
  )
}

export default Tasks
