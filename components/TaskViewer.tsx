import styles from "./TaskViewer.module.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Task from "./Task";
import { TagContainer } from "../containers/TagContainer";
import { TodoContainer } from "../containers/TodoContainer";
import type { Tag, Task as TaskProps } from "../pages";
import Datetime from "react-datepicker";
import { formatDate } from "./Task";
import { AiTwotoneTag } from "react-icons/ai";
import { BiCalendarAlt } from "react-icons/bi";

import "react-datepicker/dist/react-datepicker.css";

type Props = {
	view: string;
	tagId?: number;
};

const TaskViewer: React.FC<Props> = ({ view, tagId }: Props) => {
	const tagPortal = TagContainer.useContainer();
	const taskPortal = TodoContainer.useContainer();

	useEffect(() => {
		if (view === "All") {
			taskPortal.getSetTaskList();
		}
		if (view === "Inbox") {
			taskPortal.getSetActiveTaskList();
		}
		if (tagId && view.substring(0, 3) === "Tag") {
			taskPortal.getSetTaskListByTag(tagId);
		}
		tagPortal.getSetTagList();
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
			<h1>{view}</h1>
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
				<div className={styles.addDueWrapper}>
					<div>
						<label
							htmlFor="due"
							className={styles.addDueIconWrapper}
						>
							<BiCalendarAlt className={styles.addDueIcon} />
						</label>
					</div>
					<Datetime
						showTimeSelect
						onChange={handleDateChange}
						value={form.due ? formatDate(form.due) : undefined}
						placeholderText="Add a due date"
						className={styles.addDue}
						name="due"
						autoComplete="off"
						id="due"
					/>
				</div>

				<div className={styles.addTagWrapper}>
					<div>
						<label
							htmlFor="tag"
							className={styles.addTagIconWrapper}
						>
							<AiTwotoneTag className={styles.addTagIcon} />
						</label>
					</div>
					<select
						onChange={handleChange}
						name="tag_id"
						className={styles.addTag}
						value={form.tag_id}
						id="tag"
					>
						<option value={-1}>Add a tag</option>
						{tagOpts}
					</select>
				</div>

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
