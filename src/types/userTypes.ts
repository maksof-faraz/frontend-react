import type { ReactNode } from "react";
import dayjs from 'dayjs';

export interface LoginRegister {
  email: string;
  password: string;
  username?: string;
}

export interface userInfo {
  userId: string
  email: string;
  userName: string;
  iat?: number,
  exp?: number
}


export interface ChildrenProps {
  children: ReactNode;
}

export interface AuthContextType {
  setTokenInLS: (token: string) => void;
  user: userInfo;
}

export interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  updatedTask : AddTaskModal
}



export interface AddTaskModal {
  _id : string,
  title: string,
  description: string,
  priority: string,
  assignDate: dayjs.Dayjs | null,
  createdBy? : string
}


export type SubChecklistItem = {
  subChecklist: string;
  checkedOff: boolean;
};

export interface checklistItems {
  [key: number]: SubChecklistItem[];
}

export interface taskChecklist{
  _id? : string,
  checklistName : string ,
  addTaskId : string,
  subChecklists : checklistItems[]
}

export interface subTaskChecklist{
  _id? : string,
  subChecklistName : string ,
  checklistId : string
}

export interface taskList extends AddTaskModal{
  taskCheckLists : taskChecklist[],
}

export interface TaskChecklistModalProps {
  show: boolean;
  onClose: () => void;
  task : taskList 
}