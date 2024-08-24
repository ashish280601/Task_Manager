import React from 'react';
import './TaskModal.css';

const TaskModal = ({ show, handleClose, title, description, createdAt }) => {
    return (
        <div className={`modal ${show ? 'display-block' : 'display-none'}`}>
            <div className="modal-main">
                <h2>Task Details</h2>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Created at:</strong> {createdAt}</p>
                <button onClick={handleClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default TaskModal;
