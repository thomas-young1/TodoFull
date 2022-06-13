import styles from "./TaskViewer.module.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Task from "./Task";
import { TagContainer } from "../containers/TagContainer";
import { TodoContainer } from "../containers/TodoContainer";
import type { Tag, Task as TaskProps } from "../pages";
import Datetime from "react-datepicker";
import { formatDate } from "./Task";

import "react-datepicker/dist/react-datepicker.css";

const TaskViewer: React.FC = () => {
	const tagPortal = TagContainer.useContainer();
	const taskPortal = TodoContainer.useContainer();

	const getSetUserTasks = async () => {
		const request = await fetch("/api/task", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		const userTasks: TaskProps[] = response.userTasks;

		taskPortal.setTaskList(userTasks);
	};

	const getSetUserTags = async () => {
		const request = await fetch("/api/tag", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		const userTags: Tag[] = response.userTags;
		tagPortal.setTagList(userTags);
	};

	useEffect(() => {
		getSetUserTasks();
		getSetUserTags();
	}, []);

	const tagOpts = tagPortal.tagList.map((tag) => {
		return (
			<option value={tag.tag_id} key={tag.tag_id}>
				{tag.name}
			</option>
		);
	});

	const createTaskElement = (task: TaskProps): JSX.Element => {
		if (task.tag_id) {
			const tagId = task.tag_id;
			let tagName;
			for (const tag of tagPortal.tagList) {
				if (tag.tag_id === tagId) {
					tagName = tag.name;
				}
			}
			return <Task task={task} key={task.task_id} tagName={tagName} />;
		}

		return <Task task={task} key={task.task_id} />;
	};

	const taskObj = taskPortal.taskList.map((task) => {
		return createTaskElement(task);
	});

	const [form, setForm] = useState<
		Omit<TaskProps, "parent_task_id" | "owner_id" | "task_id">
	>({
		name: "",
		priority: 0,
		due: undefined,
		description: undefined,
		status: "Incomplete",
		tag_id: -1,
	});

	const handleChange = (
		e: ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		if (e.target.name === "tag_id" || e.target.name === "priority") {
			setForm({
				...form,
				[e.target.name]: parseInt(e.target.value),
			});
		} else {
			setForm({
				...form,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleDateChange = (date: Date) => {
		setForm({ ...form, due: date.toString() });
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		taskPortal.addTask(form);

		setForm({
			name: "",
			priority: 0,
			due: undefined,
			description: "",
			status: "Incomplete",
			tag_id: -1,
		});
	};

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
				<Datetime
					showTimeSelect
					onChange={handleDateChange}
					value={form.due ? formatDate(form.due) : undefined}
					placeholderText="Select a due date"
					className={styles.addDue}
					name="due"
				/>
				<select
					onChange={handleChange}
					name="tag_id"
					className={styles.addTag}
					value={form.tag_id}
				>
					<option disabled value={-1}>
						Add a tag
					</option>
					{tagOpts}
				</select>
				<textarea
					className={styles.addDescription}
					placeholder="Description"
					name="description"
					onChange={handleChange}
					value={form.description}
				></textarea>
				<div className={styles.priority}>
					<span className={styles.priorityLabel}>Priority:</span>
					<div className={styles.addPriority}>
						<label>
							<input
								type="radio"
								name="priority"
								value={0}
								checked={form.priority === 0}
								onChange={handleChange}
							/>
							None
						</label>
						<label>
							<input
								type="radio"
								name="priority"
								value={1}
								checked={form.priority === 1}
								onChange={handleChange}
							/>
							Low
						</label>
						<label>
							<input
								type="radio"
								name="priority"
								value={2}
								checked={form.priority === 2}
								onChange={handleChange}
							/>
							Medium
						</label>
						<label>
							<input
								type="radio"
								name="priority"
								value={3}
								checked={form.priority === 3}
								onChange={handleChange}
							/>
							High
						</label>
					</div>
				</div>
			</form>
			<div></div>
		</div>
	);
};

export default TaskViewer;
