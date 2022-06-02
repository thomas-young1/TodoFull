import styles from "./TaskViewer.module.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Task from "./Task";
import { TagContainer } from "../containers/TagContainer";
import { TodoContainer } from "../containers/TodoContainer";
import type { Tag, Task as TaskProps } from "../pages";
import { isBefore, isAfter } from "date-fns";

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
		const tagId = task.tag_id;

		if (task.tag_id) {
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
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		taskPortal.addTask(form);

		setForm({
			name: "",
			priority: 0,
			due: undefined,
			description: undefined,
			status: "Incomplete",
			tag_id: -1,
		});
	};

	// TODO: Change create task interface, add ways to create description, priority, subtasks (?) on main level
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
					defaultValue="-1"
				>
					<option disabled value="-1">
						Add a tag
					</option>
					{tagOpts}
				</select>
			</form>
		</div>
	);
};

export default TaskViewer;
