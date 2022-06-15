import styles from "./Sidebar.module.css";
import Link from "next/link";
import { TagContainer } from "../containers/TagContainer";

const Sidebar: React.FC = () => {
	const tagPortal = TagContainer.useContainer();

	const tagObjs = tagPortal.tagList.map((tag) => {
		return (
			<Link href={`/views/tag/${tag.tag_id}`} key={tag.tag_id}>
				{tag.name}
			</Link>
		);
	});

	return (
		<div className={styles.sidebar}>
			<div className={styles.heading}>Views</div>
			<div className={styles.sub}>
				<Link href="/">
					<a>Inbox</a>
				</Link>
				<Link href="/views/all">
					<a>All</a>
				</Link>
			</div>
			<div className={styles.heading}>Tags</div>
			<div className={styles.sub}>{tagObjs}</div>
		</div>
	);
};

export default Sidebar;
