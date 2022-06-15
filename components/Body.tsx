import Sidebar from "./Sidebar";
import TaskViewer from "./TaskViewer";
import styles from "./body.module.css";

type Props = {
	view: string;
	tagId?: number;
};

const Body: React.FC<Props> = ({ view, tagId }: Props) => {
	return (
		<div className={styles.body}>
			<Sidebar />
			{tagId ? (
				<TaskViewer view={view} tagId={tagId} />
			) : (
				<TaskViewer view={view} />
			)}
		</div>
	);
};

export default Body;
