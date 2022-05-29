import styles from "./TaskViewer.module.css";
import type { tagList, taskList } from "../pages/index";
import { ChangeEvent, FormEvent, useState } from "react";
import Task from "./Task";

interface Props extends tagList, taskList {}

type taskProps = {
	newTask: {
		task_id: number;
		name: string;
		priority: number;
		due?: string;
		description?: string;
		tag_id?: number;
		parent_task_id?: number;
		owner_id: string;
	};
};

const TaskViewer: React.FC<Props> = (props: Props) => {
	const tagOpts = props.tagList.tags.map((tag) => {
		return (
			<option value={tag.tag_id} key={tag.tag_id}>
				{tag.name}
			</option>
		);
	});

	const taskObj = props.taskList.map((task) => {
		return <Task task={task} key={task.task_id} />;
	});

	const [form, setForm] = useState({
		name: "",
		due: "",
		tag: -1,
		priority: 0,
	});

	const [taskList, setTaskList] = useState(taskObj);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newTask = await fetch("/api/task", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form),
		});
		const newTaskData: taskProps = await newTask.json();
		setForm({
			name: "",
			due: "",
			tag: -1,
			priority: 0,
		});
		console.log("New Task:", newTaskData);
		setTaskList((prevTaskList) => [
			...prevTaskList,
			<Task
				task={newTaskData.newTask}
				key={newTaskData.newTask.task_id}
			/>,
		]);
		console.log("Task list:", taskList);
	};

	// TODO: Change create task interface, make similar to design of tasks already made and add ways to create description, priority, subtasks (?) on main level
	return (
		<div className={styles.taskWrapper}>
			<h3>Inbox</h3>
			{taskObj}
			<form className={styles.addTask} onSubmit={handleSubmit}>
				<button className={styles.addButton} type="submit">
					+
				</button>
				<input
					className={styles.addText}
					placeholder="Add a task"
					onChange={handleChange}
					name="name"
					value={form.name}
				/>
				<input
					type="datetime-local"
					onChange={handleChange}
					name="due"
					value={form.due}
					className={styles.addDue}
				/>
				<select
					onChange={handleChange}
					name="tag"
					className={styles.addTag}
					defaultValue="addATag"
				>
					<option disabled value="addATag">
						Add a tag
					</option>
					{tagOpts}
				</select>
			</form>
		</div>
	);
};

export default TaskViewer;
