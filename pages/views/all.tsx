import { NextPage } from "next";
import Navbar from "../../components/Navbar";
import Body from "../../components/Body";
import Head from "next/head";

const all: NextPage = () => {
	return (
		<>
			<Head>
				<title>All tasks - TodoFull</title>
			</Head>
			<Navbar isTaskView={true} />
			<Body view="All" />
		</>
	);
};

export default all;
