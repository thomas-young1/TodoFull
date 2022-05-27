import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ? process.env.GOOGLE_ID : "",
			clientSecret: process.env.GOOGLE_SECRET
				? process.env.GOOGLE_SECRET
				: "",
		}),
	],
	secret: process.env.SECRET,
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token, user }) {
			session.accessToken = token.accessToken;
			return session;
		},
	},
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
	},
	adapter: PrismaAdapter(prisma),
	jwt: {
		secret: process.env.SECRET,
	},
	session: {
		strategy: "jwt",
	},
	events: {
		createUser({ user }) {
			console.log(user);
			async function createProfile() {
				const createProfile = await prisma.profile.create({
					data: {
						user_id: user.id,
					},
				});
			}
			createProfile();
		},
	},
});
