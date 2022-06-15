import { GetServerSideProps, NextPage } from "next";
import { getProviders, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../../styles/login.module.css";
import { FcGoogle } from "react-icons/fc";
import Head from "next/head";

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

const Login: NextPage<Props> = ({ providers }: Props) => {
	const { data: session } = useSession();
	const router = useRouter();
	if (session) {
		router.push("/");
		return <></>;
	} else {
		return (
			<>
				<Head>
					<title>Todofull</title>
				</Head>
				<div className={styles.wrapper}>
					<div className={styles.leftColumn}>
						<h1>Welcome to Todofull</h1>
					</div>
					<div className={styles.rightColumn}>
						<h3>
							Increase your productivity today with a free account
						</h3>
						{Object.values(providers).map((provider) => (
							<div key={provider.name}>
								<button
									className={styles.googleButton}
									onClick={() => signIn(provider.id)}
								>
									<FcGoogle className={styles.googleIcon} />
									Continue with {provider.name}
								</button>
							</div>
						))}
					</div>
				</div>
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
