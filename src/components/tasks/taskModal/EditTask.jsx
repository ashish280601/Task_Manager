import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../../../slice/taskSlice';

const EditTask = ({ show, handleClose, task, getData }) => {
    const [modalData, setModalData] = useState({});
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModalData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await dispatch(updateTask({ id: task._id, ...modalData }));
            if (res?.payload?.data?.success) {
                getData();  // Refresh the task list after updating
                handleClose();
            }
        } catch (error) {
            console.error("Error while updating task", error);
        }
    };

      // Populate input fields with task data when the modal opens
      useEffect(() => {
        if (task) {
            setModalData(task);
        }
    }, [task]);

    return (
        <div className={`modal ${show ? 'display-block' : 'display-none'}`}>
            <div className="modal-main">
                <h2>Edit Task</h2>
                <p>
                    <strong>Title:</strong>
                    <input
                        type="text"
                        name="title"
                        value={modalData?.title || ""}
                        onChange={handleChange}
                    />
                </p>
                <p>
                    <strong>Description:</strong>
                    <input
                        type="text"
                        name="description"
                        value={modalData?.description || ""}
                        onChange={handleChange}
                    />
                </p>
                <button onClick={handleSubmit} className="add-btn">Update</button>
                <button onClick={handleClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default EditTask;
