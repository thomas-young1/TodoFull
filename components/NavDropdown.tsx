import styles from "./NavDropdown.module.css";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
					<a className={styles.link} onClick={() => signOut()}>
						Log out
					</a>
				</li>
			</ul>
		</div>
	);
};

export default NavDropdown;
