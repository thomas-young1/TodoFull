import type { NextPage } from "next";
import Body from "../components/Body";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import Router from "next/router";
import Head from "next/head";

export type tagList = {
	tagList: {
		tags: Tag[];
	};
};

export type taskList = {
	taskList: Task[];
};

export type Task = {
	task_id: number;
	name: string;
	priority: number;
	due?: string;
	description?: string;
	status: string;
	tag_id?: number;
	parent_task_id?: number;
	owner_id: string;
};

export type Tag = {
	tag_id: number;
	name: string;
	owner_id: string;
};

const Home = () => {
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			Router.push("/auth/login");
		},
	});

	if (status === "loading") {
		return <></>;
	}

	return (
		<>
			<Head>
				<title>Task Dashboard</title>
			</Head>
			<Navbar isTaskView={true} />
			<Body view="Inbox" />
		</>
	);
};

export default Home;
