import { useState } from "react";

const NoteModal:React.FC<{_id:string, setOpenNoteModal: React.Dispatch<React.SetStateAction<boolean>>}> = ({_id, setOpenNoteModal}) => {
  const [note, setNote] = useState<string>("");
  return (
    <div className="h-fit w-[300px] bg-gray-50  p-[30px]">
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
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
        }}
      />
      <div className="flex justify-end">
        <button
          onClick={() => {
            setOpenNoteModal(false);
          }}
          type="button"
          className="h-[40px] items-center justify-centerfont-medium text-sm px-4 py-2 focus:outline-none hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700  text-black "
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/edit/${_id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                notes: note,
              }),
            });

            await res.json();
            if (res.ok) {
              setOpenNoteModal(false);
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

export default NoteModal;
