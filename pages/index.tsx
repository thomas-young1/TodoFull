import type { GetServerSideProps, NextPage } from "next";
import Body from "../components/Body";
import Navbar from "../components/Navbar";
import { getSession, useSession } from "next-auth/react";
import Router from "next/router";
import { prisma } from "../db";

export type tagList = {
	tagList: {
		tags: [
			{
				tag_id: number;
				name: string;
				owner_id: string;
			}
		];
	};
};

export type taskList = {
	taskList: [
		{
			task_id: number;
			name: string;
			priority: number;
			due?: string;
			description?: string;
			tag_id?: number;
			parent_task_id?: number;
			owner_id: string;
		}
	];
};

interface Props extends tagList, taskList {}

const Home: NextPage<Props> = (props: Props) => {
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
			<Navbar isTaskView={true} />
			<Body tagList={props.tagList} taskList={props.taskList} />
			<div>
				<h1>{session?.user?.email}</h1>
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	// Get list of tags and tasks from user
	let userId;
	let tagList;
	let taskListOld;
	let taskList;

	if (session && session.user && session.user.email) {
		userId = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
			select: {
				id: true,
			},
		});

		userId = userId ? userId.id : undefined;
		if (userId) {
			tagList = await prisma.profile.findUnique({
				where: {
					user_id: userId,
				},
				select: {
					tags: true,
				},
			});

			taskListOld = await prisma.profile.findUnique({
				where: {
					user_id: userId,
				},
				select: {
					tasks: true,
				},
			});
		}
	}

	tagList = tagList ? tagList : {};
	taskListOld = taskListOld ? taskListOld : {};

	if (taskListOld && taskListOld.tasks) {
		taskList = taskListOld.tasks.map((oldTask) => {
			if (oldTask.due) {
				return { ...oldTask, due: oldTask.due.toString() };
			}
			return { ...oldTask };
		});
	}

	return {
		props: {
			tagList,
			taskList,
		},
	};
};

export default Home;
