import type { FormType } from "@/types/Form";

function Edit({ formData }: { formData: FormType }) {
  return (
    <div className="w-200 mt-8 flex flex-col gap-y-5">
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-2xl font-bold">{formData.title}</h1>
        <p className="text-gray-300">Form editing coming soon!</p>
      </div>
    </div>
  );
}

export default Edit;
