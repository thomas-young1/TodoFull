import Sidebar from "./Sidebar";
import TaskViewer from "./TaskViewer";
import styles from "./body.module.css";
import type { tagList, taskList } from "../pages/index";

interface Props extends tagList, taskList {}

const Body: React.FC<Props> = (props: Props) => {
	return (
		<div className={styles.body}>
			<Sidebar tagList={props.tagList} />
			<TaskViewer tagList={props.tagList} taskList={props.taskList} />
		</div>
	);
};

export default Body;
