import styles from "./TaskViewer.module.css";

const TaskViewer: React.FC = () => {
	return (
		<div className={styles.taskWrapper}>
			<h3>Inbox</h3>
			<form className={styles.addTask}>
				<button className={styles.addButton}>+</button>
				<input className={styles.addText} placeholder="Add a task" />
				<input type="datetime-local" />
				<select>
					<option value="">Tag 1</option>
					<option value="">Tag 2</option>
					<option value="">Tag 3</option>
				</select>
			</form>
		</div>
	);
};

export default TaskViewer;
