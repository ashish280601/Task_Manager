import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, getTask, updateTask } from "../../slice/taskSlice";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddTask from "./taskModal/AddTask";
import ViewTask from "./taskModal/ViewTask";
import EditTask from "./taskModal/EditTask";

const ItemTypes = {
  TASK: "task",
};

const DraggableTask = ({ task, index, moveTask, onViewDetails, onDelete, onUpdate }) => {
  const [, ref] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task._id, index },
  });

  return (
    <div ref={ref} className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span>Created on: {new Date(task.createdAt).toLocaleDateString()}</span>
      <div className="task-actions">
        <button className="view-btn" onClick={() => onViewDetails(task)}>
          View Details
        </button>
        <button className="edit-btn" onClick={() => onUpdate(task)}>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
};


const Column = ({ columnId, tasks, moveTask, onViewDetails, onDelete, onUpdate }) => {
  const [, ref] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.id, columnId),
  });

  return (
    <div ref={ref} className="column">
      <h2 className="column-title">{columnId}</h2>
      {tasks.map((task, index) => (
        <DraggableTask
          key={task._id}
          task={task}
          index={index}
          moveTask={(dragIndex, hoverIndex) => moveTask(dragIndex, columnId)}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};


const Tasks = () => {
  const [showModal, setShowModal] = useState({
    addTask: false,
    editTask: false,
    ViewTask: false,
  });

  const [taskData, setTaskData] = useState({
    Todo: [],
    "In Progress": [],
    Done: [],
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const dispatch = useDispatch();

  const handleOpen = (task) => {
    setShowModal((prev) => ({ ...prev, [task]: true }));
  };

  const handleClose = (task) => {
    setShowModal((prev) => ({ ...prev, [task]: false }));
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    handleOpen("ViewTask");
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    handleOpen("editTask");
  };

  const fetchData = async () => {
    try {
      const res = await dispatch(getTask({ searchTitle, sortBy }));
      if (res?.payload?.data?.success) {
        const allTasks = res?.payload?.data?.tasks;

        setTaskData({
          Todo: allTasks.filter((task) => task.status === "Todo"),
          "In Progress": allTasks.filter((task) => task.status === "In Progress"),
          Done: allTasks.filter((task) => task.status === "Done"),
        });
      }
    } catch (error) {
      console.error("Error while fetching tasks", error);
    }
  };

  const moveTask = async (taskId, destinationColumn) => {
    let sourceColumn, taskToMove;
    for (const [columnId, tasks] of Object.entries(taskData)) {
      const taskIndex = tasks.findIndex((task) => task._id === taskId);
      if (taskIndex !== -1) {
        sourceColumn = columnId;
        taskToMove = tasks[taskIndex];
        break;
      }
    }

    if (!sourceColumn || !taskToMove) return;

    const updatedTasks = {
      ...taskData,
      [sourceColumn]: taskData[sourceColumn].filter((task) => task._id !== taskId),
      [destinationColumn]: [
        ...taskData[destinationColumn],
        { ...taskToMove, status: destinationColumn },
      ],
    };
    setTaskData(updatedTasks);

    try {
      const res = await dispatch(updateTask({ id: taskId, status: destinationColumn }));
      if (res?.payload?.data?.success) {
          fetchData();
      } else {
        console.error("Failed to update task status");
        setTaskData({
          ...taskData,
          [sourceColumn]: [...taskData[sourceColumn], { ...taskToMove, status: sourceColumn }],
          [destinationColumn]: taskData[destinationColumn].filter((task) => task._id !== taskId),
        });
      }
    } catch (error) {
      console.error("Failed to update task status", error);
      setTaskData({
        ...taskData,
        [sourceColumn]: [...taskData[sourceColumn], { ...taskToMove, status: sourceColumn }],
        [destinationColumn]: taskData[destinationColumn].filter((task) => task._id !== taskId),
      });
    }
  };

  const handleDelete = async (taskId) => {
    // Confirm the deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      try {
        const res = await dispatch(deleteTask(taskId));
        if (res?.payload?.data.success) {
            fetchData();
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error while deleting task", error);
      }
    }
  };


  useEffect(() => {
    fetchData();
  }, [sortBy, searchTitle]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-board">
        <div className="task-header">
          <button className="add-task-btn" onClick={() => handleOpen("addTask")}>
            Add Task
          </button>
          <AddTask show={showModal.addTask} handleClose={() => handleClose("addTask")} getData={fetchData} />
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <select 
            className="sort-select" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Sort by: Recent</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
        </div>

        <div className="columns">
          {["Todo", "In Progress", "Done"].map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              tasks={taskData[columnId]}
              moveTask={(taskId) => moveTask(taskId, columnId)}
              onViewDetails={handleViewDetails}
              onDelete={handleDelete}
              onUpdate={handleEdit}
            />
          ))}
        </div>
      </div>
      <ViewTask
        show={showModal.ViewTask}
        handleClose={() => handleClose("ViewTask")}
        title={selectedTask?.title}
        description={selectedTask?.description}
        createdAt={selectedTask ? new Date(selectedTask.createdAt).toLocaleDateString() : ""}
      />
      <EditTask 
        show={showModal.editTask}
        handleClose={() => handleClose("editTask")}
        task={selectedTask}
        getData={fetchData}/>
    </DndProvider>
  );
};

export default Tasks;
