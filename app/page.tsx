import { getSession } from "@/lib/auth";
import Hero from "@/components/layout/Hero";
import Btn from "@/components/ui/Btn";
import Image from "next/image";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
      <Hero
        title="Welcome to MacForms!"
        description="A simple and easy to use form creation tool with a ton of features"
      />
      <Btn
        text={session ? "Get started" : "Sign in"}
        link={session ? "/create" : "https://macweb.app/?redirect=macforms"}
        styles={"block mb-10"}
        primary
      />
      <div className="flex flex-col gap-y-10 pb-10">
        <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
          <Image
            src="https://macweb.app/logo.png"
            alt="Placeholder image"
            width={200}
            height={200}
          />
          <div className="flex flex-col gap-y-5">
            <h2 className="text-white font-bold text-2xl">
              Cool section title 1
            </h2>
            <p className="text-gray-300">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
              distinctio error aspernatur quisquam ex natus nobis ducimus quis!
              A quasi at omnis velit consectetur sit perspiciatis labore commodi
              explicabo exercitationem?
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
          <div className="flex flex-col gap-y-5">
            <h2 className="text-white font-bold text-2xl">
              Cool section title 2
            </h2>
            <p className="text-gray-300">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
              distinctio error aspernatur quisquam ex natus nobis ducimus quis!
              A quasi at omnis velit consectetur sit perspiciatis labore commodi
              explicabo exercitationem?
            </p>
          </div>
          <Image
            src="https://macweb.app/logo.png"
            alt="Placeholder image"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
