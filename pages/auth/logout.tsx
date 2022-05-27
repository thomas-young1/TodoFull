import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const logout: NextPage = () => {
	const router = useRouter();

	const { data: session } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/auth/login");
		},
	});

	return (
		<div>
			<button onClick={() => signOut()}>Log out</button>
		</div>
	);
};

export default logout;
