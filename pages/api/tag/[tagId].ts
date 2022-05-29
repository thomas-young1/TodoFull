import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		try {
			const { tagId } = req.query;
			const tagName = await prisma.tag.findUnique({
				where: {
					tag_id: parseInt(tagId[0]),
				},
			});
			if (tagName === undefined || tagName?.name === undefined) {
				res.status(204).json({ message: "No tag found under this id" });
			}
			res.status(200).json(tagName?.name);
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong when trying to find the tag",
			});
		}
	}
};

export default handler;
