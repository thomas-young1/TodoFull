import styles from "./Navbar.module.css";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import NavDropdown from "./NavDropdown";
import Link from "next/link";

type Props = {
	isTaskView: boolean;
};

const Navbar: React.FC<Props> = ({ isTaskView }: Props) => {
	const [dropdown, setDropdown] = useState(false);

	return (
		<div className={styles.navbar}>
			<Link href="/">
				<h1 className={styles.logo}>TodoFull</h1>
			</Link>
			{/* 
			{isTaskView && (
				<div className={styles.searchWrapper}>
					<AiOutlineSearch className={styles.searchIcon} />
					<input
						type="text"
						placeholder="Search"
						className={styles.search}
					/>
				</div>
			)} */}
			<div className={styles.rightButtons}>
				{/* <button className={styles.addButton}>+</button> */}
				<CgProfile
					className={styles.profile}
					onClick={() => setDropdown(!dropdown)}
				/>
				{dropdown && <NavDropdown />}
			</div>
		</div>
	);
};

export default Navbar;
