// import { useState } from 'react';
// import Checkbox from '@mui/material/Checkbox';
// import './App.css';

// const App = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [inputValue, setInputValue] = useState('');
//   const [accordions, setAccordions] = useState<any>([]);
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [addingItemIndex, setAddingItemIndex] = useState(null);
//   const [itemInputs, setItemInputs] = useState('');
//   const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

//   const [checklistItems, setChecklistItems] = useState<any>({}); // { index: ['Task 1', 'Task 2'] }

//   const handleCreateClick = () => {
//     setIsEditing(true);
//   };

//   const handleAddChecklist = () => {
//     if (inputValue.trim()) {
//       setAccordions([...accordions, inputValue.trim()]);
//       setInputValue('');
//       setIsEditing(false);
//     }
//   };

//   const toggleAccordion = (index: any) => {
//     setExpandedIndex(expandedIndex === index ? null : index);
//     setAddingItemIndex(null); // close input if toggling
//   };

//   const handleShowAddItemInput = (index: any) => {
//     setAddingItemIndex(index);
//     setItemInputs('');
//   };

//   const handleAddChecklistItem = (index: any) => {
//     if (!itemInputs.trim()) return;
//     const newItem = itemInputs.trim();
//     const updatedItems: any = { ...checklistItems };
//     if (!updatedItems[index]) {
//       updatedItems[index] = [];
//     }
//     updatedItems[index].push(newItem);
//     setChecklistItems(updatedItems);
//     setItemInputs('');
//     setAddingItemIndex(null);
//   };
//   return (


//     <div className="checklist-inner-wrapper">
//       <h2 className="main-title">Task Name</h2>
//       <div className="checklist-container">
//         {isEditing ? (
//           <>
//             <input
//               className="checklist-input"
//               type="text"
//               placeholder="Enter checklist title..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//             />
//             <button className="add-button" onClick={handleAddChecklist}>Add</button>
//           </>
//         ) : (
//           <>
//             <span className="checklist-title">Add Checklist</span>
//             <span className="create-icon" onClick={handleCreateClick}>➕</span>
//           </>
//         )}
//       </div>

//       <div className="accordion-list">
//         {accordions.map((title: any, index: any) => (
//           <div key={index} className="accordion-item">
//             <div className="accordion-header" onClick={() => toggleAccordion(index)}>
//               <span>{title}</span>
//               <span>{expandedIndex === index ? '▲' : '▼'}</span>
//             </div>
//             <div
//               className={`accordion-content ${expandedIndex === index ? 'expanded' : ''}`}
//             >
//               <div className="checklist-items">
//                 {(checklistItems[index] || []).map((item : string, i : number) => {
//                   const isChecked = checkedItems[`${index}-${i}`] || false;

//                   return (
//                     <div key={i} className="checklist-item">
//                       <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
//                         <Checkbox
//                           sx={{ width: 28, height: 28, padding: 0 }}
//                           color="primary"
//                           checked={isChecked}
//                           onChange={() => {
//                             setCheckedItems({
//                               ...checkedItems,
//                               [`${index}-${i}`]: !isChecked
//                             });
//                           }}
//                         />
//                         <label
//                           style={{ marginLeft: 8 }}
//                           className={isChecked ? 'checked-label' : ''}
//                         >
//                           {item}
//                         </label>
//                       </div>
//                       <span
//                         className="delete-icon"
//                         onClick={() => {
//                           const updated = { ...checklistItems };
//                           updated[index] = updated[index].filter((_ : string, j : number) => j !== i);
//                           setChecklistItems(updated);

//                           // Also clean up checkedItems
//                           const key = `${index}-${i}`;
//                           const updatedChecked = { ...checkedItems };
//                           delete updatedChecked[key];
//                           setCheckedItems(updatedChecked);
//                         }}
//                       >
//                         🗑️
//                       </span>
//                     </div>
//                   );
//                 })}

//               </div>

//               {/* Input to add new item */}
//               {addingItemIndex === index ? (
//                 <div style={{ marginTop: 10, display: 'flex' }}>
//                   <input
//                     className="checklist-input"
//                     type="text"
//                     placeholder="Enter item..."
//                     value={itemInputs}
//                     onChange={(e) => setItemInputs(e.target.value)}
//                   />
//                   <button className="add-button" onClick={() => handleAddChecklistItem(index)}>Add</button>
//                 </div>
//               ) : (
//                 <div
//                   className="add-content-line"
//                   onClick={() => handleShowAddItemInput(index)}
//                   style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: 10 }}
//                 >
//                   <span style={{ marginRight: 8, fontSize: 18, color: '#2563eb' }}>➕</span>
//                   <span>Add Content</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>

//   );
// };

// export default App;

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AuthForm from './components/authForm';
import TaskComponent from './components/TaskComponent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  const router = createBrowserRouter([
    {
      path: "/loginRegister",
      element: <AuthForm />
    },
    {
      path: "/dashboard",
      element: (
        < ProtectedRoute >
          <AppLayout />
        </ProtectedRoute >
      ),
      children: [
        {
          path: "",
          element: <TaskComponent />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/loginRegister" replace />,
    },
  ])


  return <RouterProvider router={router} />;
}

export default App;


