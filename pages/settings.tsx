import { GetServerSideProps, NextPage } from "next";
import { useSession, getSession } from "next-auth/react";
import Router from "next/router";
import Navbar from "../components/Navbar";
import { prisma } from "../db";
import type { tagList } from "./index";

interface Props extends tagList {}

// Style and finish features of settings page -> edit/add tags to account, delete account, change info (?)
const settings: NextPage<Props> = ({ tagList }: Props) => {
	useSession({
		required: true,
		onUnauthenticated() {
			Router.push("/auth/login");
		},
	});

	const tagObjs = tagList.tags.map((tag) => {
		return (
			<div>
				<h1>{tag.name}</h1>
			</div>
		);
	});

	return (
		<>
			<Navbar isTaskView={false} />
			<h1>Settings</h1>
			<h2>Tags</h2>
			{tagObjs}
		</>
	);
};

export default settings;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	let userId;
	let tagList;

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
		}
	}

	return {
		props: {
			tagList: tagList ? tagList : "",
		},
	};
};
