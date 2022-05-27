import styles from "./Sidebar.module.css";
import type { tagList } from "../pages/index";
import Link from "next/link";

interface Props extends tagList {}

const Sidebar: React.FC<Props> = (props: Props) => {
	const tagObjs = props.tagList.tags.map((tag) => {
		return <Link href="/">{tag.name}</Link>;
	});

	return (
		<div className={styles.sidebar}>
			<div className={styles.heading}>Views</div>
			<div className={styles.views}>
				<a href="">Inbox</a>
				<a href="">Week</a>
				<a href="">All</a>
			</div>
			<div className={styles.heading}>Tags</div>
			<div className={styles.views}>{tagObjs}</div>
		</div>
	);
};
// TODO: Load user's tags in and style
// TODO: Make all links functional, implement different views

export default Sidebar;
