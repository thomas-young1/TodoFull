import styles from "./TaskViewer.module.css";
import type { tagList, taskList } from "../pages/index";
import { ChangeEvent, FormEvent, useState } from "react";

interface Props extends tagList, taskList {}

const TaskViewer: React.FC<Props> = (props: Props) => {
	const tagOpts = props.tagList.tags.map((tag) => {
		return <option value={tag.tag_id}>{tag.name}</option>;
	});

	const [form, setForm] = useState({
		name: "",
		due: "",
		tag: -1,
		priority: 0,
	});

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
		console.log(form);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await fetch("/api/task", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form),
		});
		setForm({
			name: "",
			due: "",
			tag: -1,
			priority: 0,
		});
	};

	const taskObj = props.taskList.map((task) => {
		return (
			<div>
				<h1>{task.name}</h1>
				{task.due && <h3>{task.due}</h3>}
			</div>
		);
	});

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
