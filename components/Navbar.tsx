import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSearch } from "react-icons/ai";

const Navbar: React.FC = () => {
	return (
		<div className={styles.navbar}>
			<h1>Todofull</h1>
			<div className={styles.searchWrapper}>
				<AiOutlineSearch className={styles.searchIcon} />
				<input
					type="text"
					placeholder="Search"
					className={styles.search}
				/>
			</div>
			<div className={styles.rightButtons}>
				<button className={styles.addButton}>+</button>
				<CgProfile className={styles.profile} />
			</div>
		</div>
	);
};
// TODO: functionality of search, add, profile

export default Navbar;
