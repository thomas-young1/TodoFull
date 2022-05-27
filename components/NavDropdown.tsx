import styles from "./NavDropdown.module.css";
import Link from "next/link";

const NavDropdown: React.FC = () => {
	return (
		<div className={styles.dropdown}>
			<ul>
				<li>
					<Link href="/settings">
						<a className={styles.link}>Settings</a>
					</Link>
				</li>
				<li>
					<Link href="/auth/logout">
						<a className={styles.link}>Log out</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default NavDropdown;
