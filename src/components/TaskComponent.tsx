import { useEffect, useState } from "react";
import AddTask from "./AddTask";
import TaskChecklist from "./TaskChecklist";
import { getTasks, deleteTask } from '../apis/axiosApi';
import './taskComponent.css';
import type { AddTaskModal, taskList } from "../types/userTypes";
import dayjs from 'dayjs';
import { useOutletContext } from "react-router-dom";
import { toast } from 'react-toastify';

type OutletContextType = {
    setFunctionRef: (fn: (param: string) => void) => void;
};

const TaskComponent = () => {

    const { setFunctionRef } = useOutletContext<OutletContextType>();

    const [showModal, setShowModal] = useState(false);
    const [showCkecklistwModal, setShowCkecklistwModal] = useState(false);
    const [tasks, setTasks] = useState<taskList[]>([]);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [updatedTask, setUpdatedTask] = useState<AddTaskModal[]>([])
    const [taskChecklist, setTaskChecklist] = useState<taskList[]>([])


    useEffect(() => {
        setFunctionRef(getFilterTasks);
    }, [setFunctionRef]);

    useEffect(() => {
        getTaskslist('All');
    }, [])



    const getFilterTasks = (type: string) => {
        getTaskslist(type)
    };

    const closeModal = () => {
        setIsUpdated(false)
        setShowModal(false)
        setUpdatedTask([]);
        getTaskslist('All')
    }


    const removeTask = async (i: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            try {
                const res: any = await deleteTask(tasks[i]._id);
                if (res.status = '201') {
                    toast(res.data.msg)
                    getTaskslist('All')
                }
            } catch (err) {
                toast.error('Internal server error, please try again')
                console.log(err)
            }
        } else return;
    }

    const getTaskslist = async (type: string) => {
        try {
            const res: any = await getTasks(type);
            setTasks(res.data.data)
        } catch (err) {
            setTasks([]);
            console.log(err)
        }
    }

    const getUpdatedTask = (index: number) => {
        let obj = { ...tasks[index] };

        delete (obj as any)['taskCheckLists'];

        setUpdatedTask([obj]);
        setShowModal(true)
        setIsUpdated(true)

    }

    const getTaskCheckList = (index: number) => {
        let obj = { ...tasks[index] };
        setTaskChecklist([obj])
        setShowCkecklistwModal(true)
    }



    return (

        <>
            <button className="btn btn-success" onClick={() => setShowModal(true)}>
                Add Task
            </button>
            <AddTask show={showModal} onClose={closeModal} updatedTask={isUpdated ? updatedTask[0] : { _id: '', title: '', description: '', priority: 'Medium', assignDate: dayjs() }} />
            <TaskChecklist show={showCkecklistwModal} onClose={() => {setShowCkecklistwModal(false);  getTaskslist('All')}} task={showCkecklistwModal ? taskChecklist[0] : { _id: '', title: '', description: '', priority: 'Medium', assignDate: dayjs(), taskCheckLists: [] }} />

            <div className="row mt-4" >

                {

                    tasks.length > 0 ? (

                        tasks.map((task: any, i: number) => (
                            <div className="col-md-4" key={i}>
                                <div className="custom-card">
                                    <div className="card-header">
                                        <div className="card-subtitle">Priority - {task.priority}</div>
                                        <div className="card-icons">
                                            <i className="fas fa-edit" onClick={() => getUpdatedTask(i)}></i>
                                            <i className="fas fa-trash-alt" onClick={() => removeTask(i)}></i>
                                        </div>
                                    </div>
                                    <div className="card-title">{task.title}</div>
                                    <div className="card-description">
                                        {task.description}
                                    </div>
                                    <div className="card-footer">
                                        <div className="date-text">Date: {new Date(task.assignDate).toLocaleDateString('en-CA')}</div>
                                        <button className="btn btn-warning btn-sm" onClick={() => getTaskCheckList(i)}>View Checklist</button>
                                    </div>
                                </div>
                            </div>

                        ))
                    ) : (

                        <div className="text-center mt-3">
                            <h2> No Task Available Here! </h2>
                        </div>
                    )
                }









            </div>



        </>
    );

}

export default TaskComponent