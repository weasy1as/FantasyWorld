import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-8">
        Welcome to Fantasy World
      </h1>
      <p className="text-center mt-4">Your ultimate fantasy football hub</p>
      <div className="flex justify-center mt-8">
        <Image
          src="/football.png"
          alt="Football"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
    </div>
  );
}
