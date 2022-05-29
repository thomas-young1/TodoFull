import { Props as taskProps, taskWidgetType } from "./Task";
import { BiCalendarAlt, BiSubdirectoryRight } from "react-icons/bi";
import { AiTwotoneTag } from "react-icons/ai";
import styles from "./TaskWidget.module.css";

interface Props extends taskProps {
	type: taskWidgetType;
	tagName?: string;
	formattedDate?: string;
}

const TaskWidget: React.FC<Props> = (props: Props) => {
	return (
		<div>
			{/* If has due date, show due info */}
			{props.type === taskWidgetType.due && props.formattedDate && (
				<div className={styles.wrapper}>
					<BiCalendarAlt className={styles.icon} />
					<span>{props.formattedDate}</span>
				</div>
			)}

			{/* If has tag, show tag info */}
			{props.type === taskWidgetType.tag && props.tagName && (
				<div className={styles.wrapper}>
					<AiTwotoneTag className={styles.icon} />
					<span>{props.tagName}</span>
				</div>
			)}

			{/* If has subtasks, show subtask info */}
			{props.type === taskWidgetType.subtasks && <BiSubdirectoryRight />}
		</div>
	);
};

export default TaskWidget;
