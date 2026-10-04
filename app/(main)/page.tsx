import { getSession } from "@/lib/auth";
import { FaChartColumn, FaListCheck } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";
import Hero from "@/components/layout/Hero";
import Btn from "@/components/ui/Btn";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
      <Hero
        title="Welcome to MacForms!"
        description="A simple and easy to use form creation tool with a ton of features"
      />
      <div className="flex gap-x-5 mb-10">
        <Btn
          text={session ? "Get started" : "Sign in"}
          link={
            session
              ? "/create"
              : process.env.NEXT_PUBLIC_ROOT_DOMAIN + "?redirect=macforms"
          }
          styles="py-1.5"
          primary
        />
        <Btn
          text="Learn more"
          link="https://github.com/Mac-Web/macforms" //TODO: change to actual macweb.app/apps/macforms url
          styles="py-1.5"
          blank
        />
      </div>
      <div className="flex flex-col gap-y-10 pb-10">
        <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
          <FaListCheck size={200} />
          <div className="flex flex-col gap-y-5">
            <h2 className="text-black dark:text-white font-bold text-2xl">
              Easily create customizable forms
            </h2>
            <p className="text-black dark:text-gray-300">
              MacForms has a lot of features and customization options for you
              to customize your forms, including multiple choice, multi select,
              short answer, and long answer questions, as well as settings for
              publishing forms, assigning quizzes/correct answers, inviting
              collaborators to edit them, and changing the form&apos;s
              presentation.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
          <div className="flex flex-col gap-y-5">
            <h2 className="text-black dark:text-white font-bold text-2xl">
              View response statistics at a glance
            </h2>
            <p className="text-black dark:text-gray-300">
              You can view each question&apos;s response distribution, key
              statistics information, and each individual answer to effectively
              explore the results. The histogram and distribution graphs also
              help you visualize all the data easily. MacForms also supports
              exporting data as CSV files to make sharing and analyzing results
              easier.
              {/* TODO: add export to csv */}
            </p>
          </div>
          <FaChartColumn size={200} />
        </div>
        <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
          <FaGlobe size={200} />
          <div className="flex flex-col gap-y-5">
            <h2 className="text-black dark:text-white font-bold text-2xl">
              Simple and intuitive interface
            </h2>
            <p className="text-black dark:text-gray-300">
              MacForms has a simple and intuivie UI layout that&apos;s both
              aesthetically pleasing and easy to use, with smooth visual
              animations and transition effects. The website also supports both
              light and dark modes, as well as a fully responsive design
              that&apos;s accessible and functional on all screen sizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
