import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../db";

const handler: NextApiHandler = async (
	req: NextApiRequest,
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
					tasks: {
						where: {
							status: "Incomplete",
						},
					},
				},
			});
			const activeTasks = request?.tasks;
			res.status(200).json({ activeTasks });
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message:
					"Something went wrong when trying to request active tasks",
			});
		}
	}
};

export default handler;
