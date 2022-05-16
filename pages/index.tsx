import type { NextPage } from "next";
import Body from "../components/Body";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
	return (
		<>
			<Navbar />
			<Body />
		</>
	);
};

export default Home;
