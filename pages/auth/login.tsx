import { GetServerSideProps, NextPage } from "next";
import { getProviders, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Props {
	providers: {
		[provider: string]: {
			id: string;
			name: string;
			type: string;
			signinUrl: string;
			callbackUrl: string;
		};
	};
}

// TODO: Style and finalize user auth situation
const Login: NextPage<Props> = ({ providers }) => {
	const { data: session } = useSession();
	const router = useRouter();
	if (session) {
		router.push("/");
		return <></>;
	} else {
		return (
			<>
				<h1>Login</h1>
				{Object.values(providers).map((provider) => (
					<div key={provider.name}>
						<button onClick={() => signIn(provider.id)}>
							Sign in with {provider.name}
						</button>
					</div>
				))}
			</>
		);
	}
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const providers = await getProviders();
	return {
		props: { providers },
	};
};

export default Login;
