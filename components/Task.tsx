import styles from "./Task.module.css";
import { useEffect, useState } from "react";
import { isEqual, format, getWeek, isTomorrow } from "date-fns";
import TaskWidget from "./TaskWidget";

export type Props = {
	task: {
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

export enum taskWidgetType {
	due = "due",
	tag = "tag",
	subtasks = "subtasks",
}

const Task: React.FC<Props> = ({ task }: Props) => {
	// Get and set tag name for each task (if it has a tag)
	const [tagName, setTagName] = useState("");

	useEffect(() => {
		if (task.tag_id) {
			getTag();
		}
	}, []);

	// TODO: Instead of fetching tag names for each thing get all info at top level getServerSideProps and pass into components
	const getTag = async () => {
		const request = await fetch(`api/tag/${task.tag_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const nameOfTag = await request.json();
		setTagName(nameOfTag);
	};

	// Format date
	let dueString;
	if (task.due) {
		const dueDate = new Date(task.due);
		const now = new Date();
		// if same day, return time
		if (isEqual(dueDate, now)) {
			dueString = format(dueDate, "h':'mm aa");
		}
		// if next day, return tomorrow
		else if (isTomorrow(dueDate)) {
			dueString = "Tomorrow";
		}
		// if same week, return day
		else if (getWeek(dueDate) === getWeek(now)) {
			dueString = format(dueDate, "EEEE");
		}
		// if next week, return next week
		else if (getWeek(dueDate) === getWeek(now) + 1) {
			dueString = "Next week";
		}
		// if greater than 1 week away or in the past, return date in mm/dd/yyyy format
		else {
			dueString = format(dueDate, "M'/'d'/'yyyy");
		}
	}

	let priorityClass = {};
	switch (task.priority) {
		case 1: {
			priorityClass = { border: "2px solid #2EB27B" };
			break;
		}
		case 2: {
			priorityClass = { border: "2px solid #FFC635" };
			break;
		}
		case 3: {
			priorityClass = { border: "2px solid #FF4343" };
			break;
		}
	}

	// TODO: Allow tasks to be completed, add status attribute to task database (how tf did I miss that)
	return (
		<div className={styles.wrapper}>
			<button
				className={styles.completeButton}
				style={priorityClass}
			></button>
			<span>{task.name}</span>
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
		</div>
	);
};

// TODO: subtask conditional rendering
export default Task;
