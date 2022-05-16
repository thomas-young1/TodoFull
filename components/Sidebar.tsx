import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
	return (
		<div className={styles.sidebar}>
			<div className={styles.heading}>Views</div>
			<div className={styles.views}>
				<a href="">Inbox</a>
				<a href="">Week</a>
				<a href="">All</a>
			</div>
			<div className={styles.heading}>Tags</div>
		</div>
	);
};
// TODO: Load user's tags in and style
// TODO: Make all links functional, implement different views
// TODO: add search icon within bar

export default Sidebar;
