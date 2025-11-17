import image from "@/public/nebula.jpg";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <Image
        src={image}
        alt="Nebula"
        className="w-full h-64 object-cover rounded-lg mb-8"
      />
      <h1 className="text-3xl font-black">hey!</h1>

      <h2 className="text-2xl font-semibold mb-4">Wanna see:</h2>
      <p>
        <Link href="/images" className="ml-4 text-blue-500 hover:underline">
          NASA Image and Video Library
        </Link>
      </p>
      <p>
        <Link href="/asteroids" className="ml-4 text-blue-500 hover:underline">
          NASA Asteroids - Near Earth Object Web Service
        </Link>
      </p>
    </div>
  );
}
