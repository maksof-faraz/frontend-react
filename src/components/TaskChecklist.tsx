import { useEffect, useState } from 'react';
import { addTaskchecklist } from '../apis/axiosApi';
import './TaskChecklist.css';
import Checkbox from '@mui/material/Checkbox';
import type { checklistItems, taskChecklist, TaskChecklistModalProps, SubChecklistItem } from '../types/userTypes';
import { toast } from 'react-toastify';

function TaskChecklist({ show, onClose, task }: TaskChecklistModalProps) {

    const [btnDisable, setBtnDisable] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [accordions, setAccordions] = useState<string[]>([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [addingItemIndex, setAddingItemIndex] = useState(null);
    const [itemInputs, setItemInputs] = useState('');

    const [checklistItems, setChecklistItems] = useState<checklistItems>({}); // 

    useEffect(() => {
        setExpandedIndex(null)
        if (task && task.taskCheckLists.length > 0) {

            console.log(task.taskCheckLists)
            let updatedItems: checklistItems = {};
            task.taskCheckLists.forEach((ele, i) => {
                console.log(ele.checklistName)
                setAccordions(prevItems => [...prevItems, ele.checklistName])
                updatedItems[i] = ele.subChecklists as SubChecklistItem[];
            })
            setChecklistItems(updatedItems)


        } else {
            setAccordions([])
            setChecklistItems({})
        }

    }, [task]);

    const handleCreateClick = () => {
        setIsEditing(true);
    };

    const handleAddChecklist = () => {
        if (inputValue.trim()) {
            setAccordions([...accordions, inputValue.trim()]);
            setInputValue('');
            setIsEditing(false);
        }
    };

    const toggleAccordion = (index: any) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        setAddingItemIndex(null); // close input if toggling
    };

    const handleShowAddItemInput = (index: any) => {
        setAddingItemIndex(index);
        setItemInputs('');
    };

    const handleAddChecklistItem = (index: any) => {
        if (!itemInputs.trim()) return;
        const newItem = itemInputs.trim();
        const updatedItems: checklistItems = { ...checklistItems };
        if (!updatedItems[index]) {
            updatedItems[index] = [];
        }

        updatedItems[index].push({ subChecklist: newItem, checkedOff: false });
        setChecklistItems(updatedItems);
        setItemInputs('');
        setAddingItemIndex(null);
    };


    const setCheckedOff = async (index: number, i: number, isChecked: boolean) => {
        const obj: { subChecklist: string, checkedOff: boolean } = checklistItems[index][i]
        obj['checkedOff'] = !isChecked;

        checklistItems[index][i] = obj
        setChecklistItems({
            ...checklistItems,
            [`${index}`]: [...checklistItems[index]]
        })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let checkListArray: taskChecklist[] = [];

            accordions.forEach((item, i) => {
                checkListArray.push({
                    checklistName: item,
                    addTaskId: task._id,
                    subChecklists: checklistItems[i] ?? []
                })
            })

            setBtnDisable(true);
            const res: any = await addTaskchecklist(checkListArray)
            if (res.status == 201) {
                setBtnDisable(false);
                toast(res.data.msg)
                onClose(); // close modal
            }


        } catch (err) {
            toast.error('Internal server error, please try again')
            setBtnDisable(false);
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
                                <h5 className="modal-title">{task.title}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                ></button>

                            </div>
                            <div className="modal-body">
                                <div className="checklist-container">
                                    {isEditing ? (
                                        <>
                                            <input
                                                className="checklist-input"
                                                type="text"
                                                placeholder="Enter checklist title..."
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                            />
                                            <button className="add-button" onClick={handleAddChecklist}>Add</button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="checklist-title">Add Checklist</span>
                                            <span className="create-icon" onClick={handleCreateClick}>➕</span>
                                        </>
                                    )}
                                </div>

                                <div className="accordion-list">
                                    {accordions.map((title: any, index: any) => (
                                        <div key={index} className="accordion-item">
                                            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                                <span>{title}</span>
                                                <span>{expandedIndex === index ? '▲' : '▼'}</span>
                                            </div>
                                            <div
                                                className={`accordion-content ${expandedIndex === index ? 'expanded' : ''}`}
                                            >
                                                <div className="checklist-items">
                                                    {(checklistItems[index] || []).map((item: { subChecklist: string, checkedOff: boolean }, i: number) => {
                                                        const isChecked = item.checkedOff;

                                                        return (
                                                            <div key={i} className="checklist-item">
                                                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                                    <Checkbox
                                                                        sx={{ width: 28, height: 28, padding: 0 }}
                                                                        color="primary"
                                                                        checked={isChecked}

                                                                        onChange={() => setCheckedOff(index, i, isChecked)}

                                                                    />
                                                                    <label
                                                                        style={{ marginLeft: 8 }}
                                                                        className={isChecked ? 'checked-label' : ''}
                                                                    >
                                                                        {item.subChecklist}
                                                                    </label>
                                                                </div>
                                                                <span
                                                                    className="delete-icon"
                                                                    onClick={() => {
                                                                        const updated = { ...checklistItems };
                                                                        updated[index] = updated[index].filter((_: { subChecklist: string, checkedOff: boolean }, j: number) => j !== i);
                                                                        setChecklistItems(updated);
                                                                    }}
                                                                >
                                                                    🗑️
                                                                </span>
                                                            </div>
                                                        );
                                                    })}

                                                </div>

                                                {addingItemIndex === index ? (
                                                    <div style={{ marginTop: 10, display: 'flex' }}>
                                                        <input
                                                            className="checklist-input"
                                                            type="text"
                                                            placeholder="Enter item..."
                                                            value={itemInputs}
                                                            onChange={(e) => setItemInputs(e.target.value)}
                                                        />
                                                        <button className="add-button" onClick={() => handleAddChecklistItem(index)}>Add</button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="add-content-line"
                                                        onClick={() => handleShowAddItemInput(index)}
                                                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: 10 }}
                                                    >
                                                        <span style={{ marginRight: 8, fontSize: 18, color: '#2563eb' }}>➕</span>
                                                        <span>Add Content</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button disabled={btnDisable || accordions.length == 0} type="submit" className="btn btn-success">
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

        </>
    );
}

export default TaskChecklist;
