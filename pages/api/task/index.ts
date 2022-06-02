import type { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { Task } from "../../index";
import { prisma } from "../../../db";

interface ExtendedApiRequest extends NextApiRequest {
	body: Task;
}

const handler: NextApiHandler = async (
	req: ExtendedApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session || !session.user || !session.user.email) {
		res.status(401).json({ message: "There is no user signed in" });
		return;
	}

	const userId = await prisma.user.findUnique({
		where: {
			email: session?.user?.email ? session.user.email : "",
		},
		select: {
			id: true,
		},
	});

	if (!userId || !userId.id) {
		res.status(400).json({ message: "No user found with current email" });
		return;
	}

	if (req.method === "GET") {
		try {
			const request = await prisma.profile.findUnique({
				where: {
					user_id: userId.id,
				},
				select: {
					tasks: true,
				},
			});
			const userTasks = request?.tasks;
			res.status(200).json({ userTasks });
		} catch (err) {
			res.status(500).json({
				message:
					"Something went wrong when trying to find user's tasks",
			});
		}
	}

	if (req.method === "POST") {
		try {
			const {
				name,
				priority,
				due,
				description,
				status,
				tag_id,
				parent_task_id,
			} = req.body;
			const newTask = await prisma.task.create({
				data: {
					name: name,
					priority: priority,
					due: due ? new Date(due) : undefined,
					description: description || undefined,
					status: status || undefined,
					tag_id: tag_id !== -1 ? tag_id : undefined,
					parent_task_id: parent_task_id || undefined,
					owner_id: userId.id,
				},
			});
			res.status(201).json({ newTask });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong while trying to create task",
			});
		}
	}
};

export default handler;
