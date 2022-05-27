import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../db";
import bcrypt from "bcrypt";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		try {
			const data = req.body.form;

			const salt = await bcrypt.genSalt();
			const hashedPass = await bcrypt.hash(data.password, salt);

			// console.log(
			// 	"email:",
			// 	data.email,
			// 	"hashed pass:",
			// 	hashedPass,
			// 	"compare:",
			// 	realPass
			// );
			const user = await prisma.user.create({
				data: {
					email: data.email,
					password: hashedPass,
				},
			});

			res.status(200).json(user);
		} catch (error) {
			console.log(error);
			res.status(500);
		}
	}
}
