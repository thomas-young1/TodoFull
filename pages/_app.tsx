import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { TodoContainer } from "../containers/TodoContainer";
import { TagContainer } from "../containers/TagContainer";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<TagContainer.Provider>
				<TodoContainer.Provider>
					<Component {...pageProps} />
				</TodoContainer.Provider>
			</TagContainer.Provider>
		</SessionProvider>
	);
}

export default MyApp;
