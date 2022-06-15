import { GetServerSideProps, NextPage } from "next";
import Body from "../../../components/Body";
import Navbar from "../../../components/Navbar";
import { useSession } from "next-auth/react";
import Router from "next/router";
import type { Tag } from "../..";
import { prisma } from "../../../db";
import Head from "next/head";

interface Props {
	tag: Tag;
}

const TaskListByTag = ({ tag }: Props) => {
	useSession({
		required: true,
		onUnauthenticated() {
			Router.push("/auth/login");
		},
	});

	return (
		<>
			<Head>
				<title>{`${tag.name}`} - TodoFull</title>
			</Head>
			<Navbar isTaskView={true} />
			<Body view={`Tag - ${tag.name}`} tagId={tag.tag_id} />
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { tagId } = context.query;

	if (!tagId) {
		return {
			props: {},
		};
	}

	const tag = await prisma.tag.findUnique({
		where: {
			tag_id: parseInt(tagId.toString()),
		},
	});

	if (!tag) {
		return {
			props: {},
		};
	}

	return {
		props: {
			tag,
		},
	};
};

export default TaskListByTag;
