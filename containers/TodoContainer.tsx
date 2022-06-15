import { useState } from "react";
import type { Task } from "../pages/index";
import { createContainer } from "unstated-next";

const sortTasks = (tasks: Task[]): Task[] => {
	const noDueTasks = tasks.filter((task) => !task.due);
	const dueTasks = tasks.filter((task) => task.due);

	const sortedTasks = dueTasks.sort((a, b) => {
		if (a.due && b.due) {
			const date1 = new Date(a.due);
			const date2 = new Date(b.due);
			if (date1.getTime() < date2.getTime()) return -1;
			else if (date1.getTime() > date2.getTime()) return 1;
			else return 0;
		}
		return 0;
	});
	return sortedTasks.concat(noDueTasks);
};

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
			prevTaskList.push(newTaskData.newTask);
			return sortTasks(prevTaskList);
		});
		return newTaskData.newTask;
	};

	const updateTask = async (task: Omit<Task, "owner_id">): Promise<Task> => {
		const fixedTask = {
			...task,
			due: task.due ? new Date(task.due) : undefined,
		};

		const request = await fetch(`/api/task/${task.task_id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(fixedTask),
		});

		const updatedTaskData = await request.json();
		const updatedTask: Task = updatedTaskData.updatedTask;

		setTaskList((prevTaskList) => {
			const updatedIndex = prevTaskList.findIndex(
				(taskElement) => taskElement.task_id === updatedTask.task_id
			);
			prevTaskList[updatedIndex] = updatedTask;
			return sortTasks(prevTaskList);
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

	const getSetTaskList = async (): Promise<void> => {
		const request = await fetch("/api/task", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		const userTasks: Task[] = response.userTasks;

		console.log("GETSET");

		setTaskList(sortTasks(userTasks));
	};

	const getSetActiveTaskList = async (): Promise<void> => {
		const request = await fetch("/api/task/active", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		const activeTasks: Task[] = response.activeTasks;

		setTaskList(sortTasks(activeTasks));
	};

	const getSetTaskListByTag = async (tagId: number): Promise<void> => {
		const request = await fetch(`/api/task/tag/${tagId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		const tasksByTag: Task[] = response.tasksByTag[0].tasks;

		setTaskList(sortTasks(tasksByTag));
	};

	return {
		taskList,
		setTaskList,
		addTask,
		updateTask,
		deleteTask,
		getSetTaskList,
		getSetActiveTaskList,
		getSetTaskListByTag,
	};
};

export const TodoContainer = createContainer(useTodos);
