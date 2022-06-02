import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { Tag } from "../../index";
import { prisma } from "../../../db";
import { getSession } from "next-auth/react";

interface ExtendedApiRequest extends NextApiRequest {
	body: Tag;
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
					tags: true,
				},
			});
			const userTags = request?.tags;
			res.status(200).json({ userTags });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong when trying to find user's tags",
			});
		}
	}

	if (req.method === "POST") {
		try {
			const tag = req.body;

			const newTag = await prisma.tag.create({
				data: {
					name: tag.name,
					owner_id: userId && userId.id ? userId.id : "",
				},
			});
			res.status(201).json({ newTag });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong while trying to create task",
			});
		}
	}
};

export default handler;
