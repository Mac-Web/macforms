import type { FormType } from "@/types/Form";
import NewForm from "../../create/NewForm";

function Edit({ formData }: { formData: FormType }) {
  return (
    <div className="w-200 mt-8 flex flex-col gap-y-5">
      <NewForm formData={formData} />
    </div>
  );
}

export default Edit;
