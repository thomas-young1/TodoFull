import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";

const Navbar: React.FC = () => {
	return (
		<div className={styles.navbar}>
			<h1>Todofull</h1>
			<input type="text" placeholder="Search" className={styles.search} />
			<div className={styles.rightButtons}>
				<button className={styles.addButton}>+</button>
				<CgProfile className={styles.profile} />
			</div>
		</div>
	);
};
// TODO: functionality of search, add, profile

export default Navbar;
