import Navbar from "./Components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Rein</h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-xl">
        Your AI-powered execution agent for{" "}
        <span className="text-foreground font-semibold">
          resolutions that stick
        </span>
      </p>
    </div>
  );
}
