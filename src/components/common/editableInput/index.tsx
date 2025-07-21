import EditIcon from "@/assets/profile/editIcon.svg?react";
import PlusIcon from "@/assets/allContest/plus.svg?react";

function EditableInput({
  title,
  handleEdit,
}: {
  title: string;
  handleEdit: () => void;
  isDisabled?: boolean;
}) {
  return (
    <div className="mt-[16px] md:min-w-[561px]  relative">
      {
        (
          <>
            <input
              type="text"
              className={`typo-b2-semiBold   focus:outline-none rounded-[16px] bg-neutral-greys-200 px-[24px] py-[20px] w-full  pointer-events-none ${title?.length > 0 ? "text-neutral-greys-500" : "text-primary-main-500"}`}
              value={title || "Add email"}
              onChange={() => { }}
            />
            {title?.length > 0 ? (
              <EditIcon
                className="h-[24px] w-[24px] absolute right-[24px] top-[16px] z-[2] cursor-pointer"
                onClick={() => {
                  handleEdit();
                }}
              />
            ) : (
              <PlusIcon
                className="h-[24px] w-[24px] absolute right-[24px] top-[16px] z-[2] cursor-pointer text-primary-main-500"
                onClick={() => handleEdit()}
              />
            )}
          </>
        )
      }
    </div>
  );
}

export default EditableInput;
