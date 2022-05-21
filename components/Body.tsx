import Sidebar from "./Sidebar";
import TaskViewer from "./TaskViewer";

import styles from "./body.module.css";

const Body: React.FC = () => {
	return (
		<div className={styles.body}>
			<Sidebar />
			<TaskViewer />
		</div>
	);
};

export default Body;
