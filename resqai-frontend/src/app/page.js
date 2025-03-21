import Link from "next/link";

export default function Home() {
  return (
    <div className="homescreen flex-col">
      <h1>This is the homescreen of ResQ-ai</h1>
      <Link href={"/dashboard"}>
        <button className="mt-10 px-6 py-3 text-white font-lexend rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700">
          Get Started
        </button>
      </Link>
    </div>
  );
}
