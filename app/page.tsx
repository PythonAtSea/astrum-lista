import GridImage from "@/components/grid-image";
import image from "@/public/nebula.jpg";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <GridImage
        image={image}
        className="mb-8"
        credit="ESA Hubble"
        creditUrl="https://esahubble.org/images/heic1509a/"
        useColor={true}
      />
      <h1 className="text-3xl font-black">hey!</h1>
      <Link href="/images" className="text-blue-500 hover:underline">
        space images
      </Link>
    </div>
  );
}
