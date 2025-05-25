import { useEffect, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { addTask, updateTask } from '../apis/axiosApi';
import dayjs from 'dayjs';
import type { AddTaskModal, TaskModalProps } from '../types/userTypes';

function AddTask({ show, onClose, updatedTask }: TaskModalProps) {

    const [btnDisable, setBtnDisable] = useState(false);
    const [formData, setFormData] = useState<AddTaskModal>({
        _id : '',
        title: '',
        description: '',
        priority: 'Medium',
        assignDate: dayjs(),
    });

    useEffect(() => {
        if (updatedTask && updatedTask.title) {
            setFormData({
                _id : '',
                title: updatedTask.title ?? '',
                description: updatedTask.description ?? '',
                priority: updatedTask.priority ?? 'Medium',
                assignDate: updatedTask.assignDate ? dayjs(updatedTask.assignDate) : dayjs(),
            });
        } else {
            // If not editing, reset form
            setFormData({
                _id : '',
                title: '',
                description: '',
                priority: 'Medium',
                assignDate: dayjs(),
            });
        }
    }, [updatedTask]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (newDate: dayjs.Dayjs | null) => {
        setFormData(prev => ({ ...prev, assignDate: newDate }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const finalData = {
                ...formData,
                ...(updatedTask._id && { _id: updatedTask._id }) 
            };
            setBtnDisable(true);
            const res: any = (updatedTask._id) ? await updateTask(finalData) : await addTask(formData)
            if (res.status == 201) {
                setBtnDisable(false);
                setFormData({
                    _id : '',
                    title: '',
                    description: '',
                    priority: 'Medium',
                    assignDate: dayjs(),
                })
                onClose(); // close modal


            }
        } catch (err) {
            setBtnDisable(false);
            console.error(err);
        }
    };


    if (!show) return null;

    return (
        <>
            <div className="modal show fade d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add Task</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <TextField
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    className="mb-3"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    className="mb-3"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />

                                <TextField
                                    select
                                    label="Priority"
                                    variant="outlined"
                                    fullWidth
                                    className="mb-3"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </TextField>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Assign Date"
                                        value={formData.assignDate}
                                        onChange={handleDateChange}

                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="modal-footer">
                                <button disabled={btnDisable} type="submit" className="btn btn-success">
                                    Save Task
                                </button>
                                <button disabled={btnDisable}
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}

export default AddTask;
