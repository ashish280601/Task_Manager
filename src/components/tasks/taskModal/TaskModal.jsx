import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from "../../../slice/taskSlice";

import './TaskModal.css';

const TaskModal = ({ show, handleClose, getData }) => {
    const [modalData, setModalData] = useState({});
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModalData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // write your code logic here.
            const res = await dispatch(addTask(modalData));
            console.log("res data from add task", res);
            if (res?.payload?.data?.success) {
                setModalData({});
                handleClose();
               setTimeout(() => {
                getData();
               },1000)
                return;
            }
        } catch (error) {
            console.error("error while adding student data", error);
        }
    };
    
    return (
        <div className={`modal ${show ? 'display-block' : 'display-none'}`}>
            <div className="modal-main">
                <h2>Add Task</h2>
                <p><strong>Title:</strong> <input type='text' name='title' value={modalData?.title || ""} onChange={handleChange} />
                </p>
                <p><strong>Description:</strong> <input type='text' name='description' value={modalData?.description || ""} onChange={handleChange} /></p>
                <button onClick={handleSubmit} className="add-btn">Submit</button>
                <button onClick={handleClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default TaskModal;
