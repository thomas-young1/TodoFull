import { useState } from "react";
import type { Tag } from "../pages/index";
import { createContainer } from "unstated-next";

export const useTags = () => {
	const [tagList, setTagList] = useState<Tag[]>([]);

	const addTag = async (
		tag: Omit<Tag, "tag_id" | "owner_id">
	): Promise<Tag> => {
		const request = await fetch("/api/tag", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tag),
		});
		const response = await request.json();
		const newTag: Tag = response.newTag;
		setTagList((prevTagList) => {
			return [...prevTagList, newTag];
		});
		return newTag;
	};

	const updateTag = async (tag: Tag): Promise<Tag> => {
		setTagList((prevTagList) => {
			const filteredList = prevTagList.filter(
				(tagElement) => tagElement.tag_id !== tag.tag_id
			);
			return [...filteredList, tag];
		});

		const request = await fetch(`/api/tag/${tag.tag_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(tag),
		});
		return await request.json();
	};

	const deleteTag = async (tag: Tag): Promise<void> => {
		setTagList((prevTagList) => {
			return prevTagList.filter(
				(tagElement) => tagElement.tag_id !== tag.tag_id
			);
		});

		await fetch(`api/tag/${tag.tag_id}`, {
			method: "DELETE",
		});
	};

	const getSetTagList = async () => {
		const request = await fetch("/api/tag", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const response = await request.json();
		const userTags: Tag[] = response.userTags;
		setTagList(userTags);
	};

	return {
		tagList,
		setTagList,
		addTag,
		updateTag,
		deleteTag,
		getSetTagList,
	};
};
export const TagContainer = createContainer(useTags);
