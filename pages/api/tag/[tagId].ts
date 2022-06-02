import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db";
import type { Tag } from "../../index";

interface ExtendedApiRequest extends NextApiRequest {
	query: {
		tagId: string;
	};
	body: Tag;
}

const handler = async (req: ExtendedApiRequest, res: NextApiResponse) => {
	const { tagId } = req.query;
	if (req.method === "GET") {
		try {
			const tagName = await prisma.tag.findUnique({
				where: {
					tag_id: parseInt(tagId),
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

	if (req.method === "DELETE") {
		try {
			await prisma.tag.delete({
				where: {
					tag_id: parseInt(tagId),
				},
			});
			res.status(200).json({ message: "Tag successfully deleted" });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong when trying to delete tag",
			});
		}
	}

	if (req.method === "PUT") {
		try {
			const updatedTag = await prisma.tag.update({
				where: {
					tag_id: parseInt(tagId),
				},
				data: req.body,
			});
			res.status(200).json({ updatedTag });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong when trying to update tag",
			});
		}
	}
};

export default handler;
