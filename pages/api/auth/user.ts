import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../db";
import { signOut } from "next-auth/react";

const handler: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session || !session.user || !session.user.email) {
		res.status(401).json({ message: "There is no user signed in" });
		return;
	}

	if (req.method === "DELETE") {
		await prisma.user.delete({
			where: {
				email: session.user.email,
			},
		});
		res.status(200).json({ message: "User deleted successfully" });
	}
};

export default handler;
