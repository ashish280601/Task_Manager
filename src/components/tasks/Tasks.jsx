import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTask, updateTaskStatus } from "../../slice/taskSlice";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ViewTask from "./taskModal/ViewTask";
import AddModal from "./taskModal/TaskModal";

const ItemTypes = {
  TASK: "task",
};

const DraggableTask = ({ task, index, moveTask, onViewDetails }) => {
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
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>
    </div>
  );
};


const Column = ({ columnId, tasks, moveTask, onViewDetails }) => {
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

  const fetchData = async () => {
    try {
      const res = await dispatch(getTask({}));
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
      const res = await dispatch(updateTaskStatus({ id: taskId, status: destinationColumn }));
      if (res?.payload?.data?.success) {
        setTimeout(() => {
          fetchData();
        }, 1000);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-board">
        <div className="task-header">
          <button className="add-task-btn" onClick={() => handleOpen("addTask")}>
            Add Task
          </button>
          <AddModal show={showModal.addTask} handleClose={() => handleClose("addTask")} getData={fetchData} />
          <input type="text" className="search-input" placeholder="Search..." />
          <select className="sort-select">
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
    </DndProvider>
  );
};

export default Tasks;
