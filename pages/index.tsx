import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <nav>
        <Link href="/about">
          <a>About</a>
        </Link>
      </nav>
    </>
  );
};

export default Home;
