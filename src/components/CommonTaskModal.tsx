import { useState } from "react";
import { Task } from "./TaskTable";

const CommonTaskModal: React.FC<{
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  task?: Task;
  title: string;
}> = ({ setOpenModal, title, task }) => {
  const [addTaskObj, setAddtaskObj] = useState<Task>(
    task || {
      contactPerson: "",
      type: "",
      status: "Open",
      date: "",
      entity: "",
      notes: "",
    }
  );

  const [statusButtonSelect, setStatusButtonSelect] = useState<string>("Open");
  const [openTaskTypeOption, setOpenTaskTypeOption] = useState<boolean>(false);

  const validateTask = (task: Task): string[] => {
    const errors: string[] = [];

    if (!task.contactPerson.trim()) errors.push("Contact Person is required.");
    if (!task.type.trim()) errors.push("Task Type is required.");
    if (!task.status.trim()) errors.push("Status is required.");
    if (!task.date.trim()) errors.push("Date is required.");
    if (!task.entity.trim()) errors.push("Entity is required.");

    return errors;
  };
  return (
    <div className="h-fit w-[25rem] bg-gray-50  p-[30px]">
      <div className="flex justify-between w-full">
        <div className=" h-[40px] items-center text-black  font-medium text-xl py-2">
          {title}
        </div>
        <div className="flex">
          <button
            onClick={() => {
              setStatusButtonSelect("Open");
            }}
            type="button"
            className={`h-[40px] items-center justify-center text-white font-medium text-sm px-4 py-2 focus:outline-none
      ${
        statusButtonSelect === "Open"
          ? "bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700"
          : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
      }`}
          >
            Open
          </button>
          <button
            onClick={() => {
              setStatusButtonSelect("Closed");
            }}
            type="button"
            className={`h-[40px] items-center justify-center text-white font-medium text-sm px-4 py-2 focus:outline-none
      ${
        statusButtonSelect === "Closed"
          ? "bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700"
          : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
      }`}
          >
            Closed
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Entity Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="entityname"
            type="text"
            placeholder="Enter Entity name"
            value={addTaskObj.entity}
            onChange={(e) => {
              setAddtaskObj((prev) => ({ ...prev, entity: e.target.value }));
            }}
          />
        </div>
        <div className="mb-4 flex gap-3">
          <label
            className="flex justify-center items-center text-gray-700 font-bold mb-2 text-xl "
            htmlFor="date"
          >
            Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="date"
            placeholder="Date"
            value={addTaskObj.date}
            onChange={(e) => {
              setAddtaskObj((prev) => ({ ...prev, date: e.target.value }));
            }}
          />
        </div>
        <div className="mb-4 relative w-full">
          <button
            id="dropdownDefaultButton"
            type="button"
            className="w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 justify-between"
            onClick={() => setOpenTaskTypeOption(!openTaskTypeOption)}
          >
            {addTaskObj.type || "Task Type"}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {openTaskTypeOption && (
            <div
              id="dropdown"
              className="absolute top-full left-0 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <div
                    onClick={() => {
                      setAddtaskObj((prev) => ({ ...prev, type: "Call" }));
                      setOpenTaskTypeOption(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Call
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setAddtaskObj((prev) => ({ ...prev, type: "Meeting" }));
                      setOpenTaskTypeOption(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Meeting
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Contact person
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="entityname"
            type="text"
            placeholder="Enter Contacnt person name"
            value={addTaskObj.contactPerson}
            onChange={(e) => {
              setAddtaskObj((prev) => ({
                ...prev,
                contactPerson: e.target.value,
              }));
            }}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Notes
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notes"
            placeholder="Enter notes here (optional)"
            rows={4}
            value={addTaskObj.notes}
            onChange={(e) => {
              setAddtaskObj((prev) => ({
                ...prev,
                notes: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            setOpenModal(false);
          }}
          type="button"
          className="h-[40px] items-center justify-centerfont-medium text-sm px-4 py-2 focus:outline-none hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700  text-black "
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const errors = validateTask({
              ...addTaskObj,
              status: statusButtonSelect,
            });

            if (errors.length > 0) {
              alert(errors.join("\n"));
              return;
            }
            const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/${task ? `edit/${task._id}` : "add"}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  contactPerson: addTaskObj.contactPerson,
                  type: addTaskObj.type,
                  status: statusButtonSelect,
                  date: addTaskObj.date,
                  entity: addTaskObj.entity,
                  notes: addTaskObj.notes,
                }),
              }
            );

            await res.json();
            if (res.ok) {
              setOpenModal(false);
            }
          }}
          type="button"
          className="h-[40px] items-center justify-centerfont-medium text-sm px-4 py-2 focus:outline-none hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700  text-black "
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CommonTaskModal;
