import { format, getWeek, isTomorrow, isAfter, isSameDay } from "date-fns";
import TaskWidget from "./TaskWidget";
import { MdEdit, MdOutlineDone } from "react-icons/md";
import { BsTrashFill } from "react-icons/bs";
import Router from "next/router";
import { TodoContainer } from "../containers/TodoContainer";
import styles from "./Task.module.css";
import { useState } from "react";

export type Props = {
	task: {
		task_id: number;
		name: string;
		priority: number;
		due?: string;
		description?: string;
		status: string;
		tag_id?: number;
		parent_task_id?: number;
		owner_id: string;
	};
	tagName?: string;
};

export enum taskWidgetType {
	due = "due",
	tag = "tag",
	subtasks = "subtasks",
}

/**
 * Translates a datestring provided to plainer text
 * @param date a date string to convert to plainer text
 * @returns a plain text representation of a datestring
 */
export const formatDate = (date: string): string => {
	let dueString: string;
	const dueDate = new Date(date);
	const now = new Date();
	// if same day, return time
	if (isSameDay(dueDate, now)) {
		dueString = format(dueDate, "'Today, 'h':'mm aa");
	}
	// if next day, return tomorrow
	else if (isTomorrow(dueDate)) {
		dueString = format(dueDate, "'Tomorrow, 'h':'mm aa");
	}
	// if same week, return day
	else if (getWeek(dueDate) === getWeek(now) && isAfter(dueDate, now)) {
		dueString = format(dueDate, "EEEE', 'h':'mm aa");
	}
	// if greater than 1 week away or in the past, return date in mm/dd/yyyy format
	else {
		dueString = format(dueDate, "M'/'d'/'yyyy', 'h':'mm aa");
	}
	return dueString;
};

const Task: React.FC<Props> = ({ task, tagName }: Props) => {
	const taskPortal = TodoContainer.useContainer();

	// Format date
	let dueString;
	if (task.due) {
		dueString = formatDate(task.due);
	}

	/*
		red = #ff4343
		yellow = #ffc635
		green = #2eb27b
	*/

	let borderColor = "#000000";
	switch (task.priority) {
		case 1: {
			borderColor = "#2eb27b";
			break;
		}
		case 2: {
			borderColor = "#ffc635";
			break;
		}
		case 3: {
			borderColor = "#ff4343";
			break;
		}
	}

	const [checked, setChecked] = useState(
		task.status === "Incomplete" ? false : true
	);

	const editTaskRedirect = () => {
		Router.push(`/edit/${task.task_id}`);
	};

	const toggleStatus = () => {
		setChecked((prevChecked) => !prevChecked);
		task.status = task.status === "Incomplete" ? "Complete" : "Incomplete";
		taskPortal.updateTask(task);
	};

	return (
		<div className={styles.taskWrapper}>
			<div className={styles.wrapper}>
				<input
					type="checkbox"
					className={styles.completeButton}
					onClick={toggleStatus}
					defaultChecked={checked}
					id={task.task_id.toString()}
				></input>
				<div
					style={{
						border: `2px solid ${borderColor}`,
					}}
					className={styles.customCheckbox}
					onClick={toggleStatus}
				>
					{checked && <MdOutlineDone />}
				</div>
				<label
					htmlFor={task.task_id.toString()}
					className={styles.taskLabel}
				>
					<span>{task.name}</span>
				</label>

				{task.due && (
					<TaskWidget
						task={task}
						type={taskWidgetType.due}
						formattedDate={dueString}
						key={taskWidgetType.due}
					/>
				)}
				{task.tag_id && (
					<TaskWidget
						task={task}
						type={taskWidgetType.tag}
						tagName={tagName}
						key={taskWidgetType.tag}
					/>
				)}
				<div className={styles.interactionIcons}>
					<MdEdit
						className={styles.editIcon}
						onClick={editTaskRedirect}
					/>
					<BsTrashFill
						className={styles.trashIcon}
						onClick={() => taskPortal.deleteTask(task)}
					/>
				</div>
			</div>
			<hr className={styles.rule} />
		</div>
	);
};

export default Task;
