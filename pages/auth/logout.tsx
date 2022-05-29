import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Router from "next/router";

const logout: NextPage = () => {
	useSession({
		required: true,
		onUnauthenticated() {
			Router.push("/auth/login");
		},
	});

	// TODO: Style logout
	return (
		<div>
			<button onClick={() => signOut()}>Log out</button>
		</div>
	);
};

export default logout;
