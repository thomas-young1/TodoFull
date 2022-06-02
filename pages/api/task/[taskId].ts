import { NextApiRequest, NextApiResponse } from "next";
import type { Task } from "../../index";
import { prisma } from "../../../db";

interface ExtendedApiRequest extends NextApiRequest {
	query: {
		taskId: string;
	};
	body: Task;
}

const handler = async (req: ExtendedApiRequest, res: NextApiResponse) => {
	const { taskId } = req.query;
	if (!taskId) {
		res.status(400).json({ message: "Invalid task id" });
		return;
	}

	if (req.method === "DELETE") {
		try {
			try {
				await prisma.task.delete({
					where: {
						task_id: parseInt(taskId),
					},
				});
			} catch (err) {
				console.log(err);
				res.status(400).json({
					message: "No task under this id exists",
				});
				return;
			}
			res.status(200).json({ deletedTaskId: parseInt(taskId) });
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: "Something went wrong when trying to delete task",
			});
			return;
		}
	}
	if (req.method === "PUT") {
		try {
			const updatedTask = await prisma.task.update({
				where: {
					task_id: parseInt(taskId),
				},
				data: req.body,
			});
			res.status(201).json({ updatedTask });
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong when trying to update task",
			});
		}
	}
};

export default handler;
