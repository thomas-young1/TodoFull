import { useState } from "react";
import type { Task } from "../pages/index";
import { createContainer } from "unstated-next";

export const useTodos = () => {
	const [taskList, setTaskList] = useState<Task[]>([]);

	const addTask = async (
		task: Omit<Task, "owner_id" | "task_id">
	): Promise<Task> => {
		const request = await fetch("/api/task", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(task),
		});
		const newTaskData = await request.json();
		setTaskList((prevTaskList) => {
			return [...prevTaskList, newTaskData.newTask];
		});
		return newTaskData.newTask;
	};

	const updateTask = async (task: Task): Promise<Task> => {
		const request = await fetch(`/api/task/${task.task_id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(task),
		});
		const updatedTaskData = await request.json();
		const updatedTask: Task = updatedTaskData.updatedTask;
		setTaskList((prevTaskList) => {
			const updatedIndex = prevTaskList.findIndex(
				(taskElement) => taskElement.task_id === updatedTask.task_id
			);
			prevTaskList[updatedIndex] = updatedTask;
			return prevTaskList;
		});
		return updatedTask;
	};

	const deleteTask = async (task: Task): Promise<void> => {
		const request = await fetch(`/api/task/${task.task_id}`, {
			method: "DELETE",
		});
		const { deletedTaskId } = await request.json();
		setTaskList((prevTaskList) => {
			return prevTaskList.filter(
				(task) => task.task_id !== deletedTaskId
			);
		});
	};

	return {
		taskList,
		setTaskList,
		addTask,
		updateTask,
		deleteTask,
	};
};

export const TodoContainer = createContainer(useTodos);
