import type { NextApiResponse, NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	if (!session || !session.user || !session.user.email) {
		res.status(401).json({ message: "There is no user signed in" });
	}

	const userId = await prisma.user.findUnique({
		where: {
			email: session?.user?.email ? session.user.email : "",
		},
		select: {
			id: true,
		},
	});

	if (req.method === "POST") {
		try {
			const { name, due, tag, priority } = req.body;
			const newTask = await prisma.task.create({
				data: {
					name: name,
					due: new Date(due),
					tag_id: parseInt(tag),
					priority: priority,
					owner_id: userId && userId.id ? userId.id : "",
				},
			});
			console.log(newTask);
			res.status(201).json({ newTask });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong while trying to create task",
			});
		}
	}
};

export default handler;
