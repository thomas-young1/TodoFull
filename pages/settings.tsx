import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Router from "next/router";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { TagContainer } from "../containers/TagContainer";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "../styles/settings.module.css";

import { MdEdit } from "react-icons/md";
import { BsTrashFill } from "react-icons/bs";

const settings = () => {
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			Router.push("/auth/login");
		},
	});
	const tagPortal = TagContainer.useContainer();

	useEffect(() => {
		tagPortal.getSetTagList();
	}, []);

	let tagObjs;

	if (status === "authenticated") {
		tagObjs = tagPortal.tagList.map((tag) => {
			return (
				<div className={styles.tagCardWrapper} key={tag.tag_id}>
					<div className={styles.tagCard}>
						<p>{tag.name}</p>
						<div className={styles.interactionIcons}>
							<MdEdit className={styles.editIcon} />
							<BsTrashFill
								className={styles.trashIcon}
								onClick={() => tagPortal.deleteTag(tag)}
							/>
						</div>
					</div>
					<hr className={styles.rule} />
				</div>
			);
		});
	}

	const [form, setForm] = useState({ name: "" });

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm({ name: e.target.value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		tagPortal.addTag(form);
		setForm({ name: "" });
	};

	const deleteAccount = async () => {
		signOut();
		await fetch("/api/auth/user", {
			method: "DELETE",
		});
	};

	if (status === "loading") {
		return <></>;
	}

	return (
		<>
			<Head>
				<title>Settings - Todofull</title>
			</Head>
			<Navbar isTaskView={false} />
			<div className={styles.wrapper}>
				<h1>Settings</h1>
				<h2>Tags</h2>
				<div className={styles.tagWrapper}>{tagObjs}</div>
				<form onSubmit={handleSubmit}>
					<div className={styles.taskCreatorWrapper}>
						<button className={styles.addButton}>+</button>
						<input
							type="text"
							onChange={handleChange}
							value={form.name}
							className={styles.addName}
							placeholder="Add a tag"
						/>
					</div>
				</form>
				<h2 className={styles.accountHeader}>Account</h2>
				<button className={styles.deleteButton} onClick={deleteAccount}>
					Delete account
				</button>
			</div>
		</>
	);
};

export default settings;
