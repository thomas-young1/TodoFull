import type { GetServerSideProps, NextPage } from "next";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";
import { TodoContainer } from "../../containers/TodoContainer";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { Task } from "..";
import Datetime from "react-datepicker";
import { useSession } from "next-auth/react";
import { prisma } from "../../db";
import Head from "next/head";

import styles from "../../styles/taskEditor.module.css";
import { formatDate } from "../../components/Task";
import { TagContainer } from "../../containers/TagContainer";
import "react-datepicker/dist/react-datepicker.css";

import { AiTwotoneTag } from "react-icons/ai";
import { BiCalendarAlt } from "react-icons/bi";

type Props = {
	task: Task;
};

const EditTask = (props: Props) => {
	const { task } = props;
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/auth/login");
		},
	});

	const taskPortal = TodoContainer.useContainer();
	const tagPortal = TagContainer.useContainer();

	useEffect(() => {
		tagPortal.getSetTagList();
	}, []);

	const [form, setForm] = useState<
		Omit<Task, "parent_task_id" | "owner_id" | "task_id">
	>({
		name: task ? task.name : "",
		priority: task ? task.priority : 0,
		due: task ? task.due : "",
		description: task ? task.description : "",
		status: task ? task.status : "Incomplete",
		tag_id: task ? task.tag_id : -1,
	});

	const tagOpts = tagPortal.tagList.map((tag) => {
		return (
			<option value={tag.tag_id} key={tag.tag_id}>
				{tag.name}
			</option>
		);
	});

	const handleChange = (
		e: ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		if (e.target.name === "tag_id" || e.target.name === "priority") {
			setForm({
				...form,
				[e.target.name]: parseInt(e.target.value),
			});
		} else {
			setForm({
				...form,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleDateChange = (date: Date) => {
		setForm({ ...form, due: date.toString() });
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const submission = {
			...form,
			task_id: task.task_id,
		};

		taskPortal.updateTask(submission);
		router.push("/");
	};

	if (status === "loading") {
		return <></>;
	}

	if (!task) {
		return <h1>This task does not exist</h1>;
	}

	return (
		<>
			<Head>
				<title>Edit task</title>
			</Head>
			<Navbar isTaskView={false} />
			<div className={styles.wrapper}>
				<h1>Edit {task.name}</h1>
				<form onSubmit={handleSubmit}>
					<div className={styles.editorWrapper}>
						<input
							className={styles.addText}
							placeholder="Add a task"
							onChange={handleChange}
							name="name"
							value={form.name}
						/>
						<div className={styles.addDueWrapper}>
							<div>
								<label
									htmlFor="due"
									className={styles.addDueIconWrapper}
								>
									<BiCalendarAlt
										className={styles.addDueIcon}
									/>
								</label>
							</div>

							<Datetime
								showTimeSelect
								onChange={handleDateChange}
								value={
									form.due ? formatDate(form.due) : undefined
								}
								placeholderText="Select a due date"
								className={styles.addDue}
								name="due"
								id="due"
								autoComplete="off"
							/>
						</div>
						<div className={styles.addTagWrapper}>
							<div>
								<label
									htmlFor="tag"
									className={styles.addTagIconWrapper}
								>
									<AiTwotoneTag
										className={styles.addTagIcon}
									/>
								</label>
							</div>

							<select
								onChange={handleChange}
								name="tag_id"
								className={styles.addTag}
								value={form.tag_id}
								id="tag"
							>
								<option value={-1}>Add a tag</option>
								{tagOpts}
							</select>
						</div>

						<textarea
							className={styles.addDescription}
							placeholder="Description"
							name="description"
							onChange={handleChange}
							value={form.description}
						></textarea>
						<div className={styles.priority}>
							<span className={styles.priorityLabel}>
								Priority:
							</span>
							<div className={styles.addPriority}>
								<label>
									<input
										type="radio"
										name="priority"
										value={0}
										checked={form.priority === 0}
										onChange={handleChange}
									/>
									None
								</label>
								<label>
									<input
										type="radio"
										name="priority"
										value={1}
										checked={form.priority === 1}
										onChange={handleChange}
									/>
									Low
								</label>
								<label>
									<input
										type="radio"
										name="priority"
										value={2}
										checked={form.priority === 2}
										onChange={handleChange}
									/>
									Medium
								</label>
								<label>
									<input
										type="radio"
										name="priority"
										value={3}
										checked={form.priority === 3}
										onChange={handleChange}
									/>
									High
								</label>
							</div>
						</div>
						<button className={styles.updateButton}>Update</button>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={() => router.push("/")}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { taskId } = context.query;

	if (!taskId) {
		return {
			props: {},
		};
	}

	const request = await prisma.task.findUnique({
		where: {
			task_id: parseInt(taskId.toString()),
		},
	});

	if (!request) {
		return {
			props: {},
		};
	}

	const task = { ...request, due: request.due ? request.due.toString() : "" };

	return {
		props: { task },
	};
};

export default EditTask;
