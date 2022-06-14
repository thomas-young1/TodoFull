import { format, getWeek, isTomorrow, isAfter, isSameDay } from "date-fns";
import TaskWidget from "./TaskWidget";
import { MdEdit } from "react-icons/md";
import { BsTrashFill } from "react-icons/bs";
import Router from "next/router";
import { TodoContainer } from "../containers/TodoContainer";
import styles from "./Task.module.css";

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
export const formatDate = (date: string) => {
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

	const editTaskRedirect = () => {
		Router.push(`/edit/${task.task_id}`);
	};

	const toggleStatus = () => {
		task.status = task.status === "Incomplete" ? "Complete" : "Incomplete";
		taskPortal.updateTask(task);
	};

	// TODO: Allow tasks to be completed
	return (
		<div className={styles.taskWrapper}>
			<div className={styles.wrapper}>
				<button
					className={styles.completeButtonUnchecked}
					style={priorityClass}
					onClick={toggleStatus}
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

// TODO: subtask conditional rendering
export default Task;
