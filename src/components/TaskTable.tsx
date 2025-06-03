"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonTaskModal from "./CommonTaskModal";
import NoteModal from "./NoteModal";

export interface Task {
  _id?: string;
  contactPerson: string;
  date: string;
  entity: string;
  status: string;
  type: string;
  notes?: string;
  createdTime?: string;
}

const initialTask: Task = {
  _id: "",
  contactPerson: "",
  date: "",
  entity: "",
  status: "",
  type: "",
  notes: "",
  createdTime: "",
};

const createEmptyFilterRecord = (): Record<keyof Task, string[]> => {
  return Object.keys(initialTask).reduce((acc, key) => {
    acc[key as keyof Task] = [];
    return acc;
  }, {} as Record<keyof Task, string[]>);
};

const TaskTable = () => {
  const [data, setData] = useState<Task[] | null>(null);
  const [filteredData, setFilteredData] = useState<Task[] | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openStatusTaskId, setOpenStatusTaskId] = useState<string>("");

  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [dropdownOpenColumn, setDropdownOpenColumn] = useState<
    keyof Task | null
  >(null);

  const [columnFilters, setColumnFilters] = useState<
    Record<keyof Task, string[]>
  >(createEmptyFilterRecord());
  const [activeFilters, setActiveFilters] = useState<
    Record<keyof Task, string[]>
  >(createEmptyFilterRecord());

  const fetchData = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}`);
    const tasks: Task[] = response.data;

    setData(tasks);
    setFilteredData(tasks);

    const filters = createEmptyFilterRecord();
    for (const key in filters) {
      const k = key as keyof Task;
      filters[k] = [...new Set(tasks.map((task) => task[k]))].filter(
        Boolean
      ) as string[];
    }
    setColumnFilters(filters);
  };

  useEffect(() => {
    fetchData();
  }, [openAddModal, openEditModal, openNoteModal, openStatusTaskId]);

  useEffect(() => {
    if (data) {
      let filtered = [...data];

      for (const [key, values] of Object.entries(activeFilters) as [
        keyof Task,
        string[]
      ][]) {
        if (values.length > 0) {
          filtered = filtered.filter((task) =>
            values.includes(task[key] ?? "")
          );
        }
      }

      if (sortColumn) {
        filtered.sort((a, b) => {
          const aVal = a[sortColumn] ?? "";
          const bVal = b[sortColumn] ?? "";

          if (aVal === bVal) return 0;
          return sortDirection === "asc"
            ? aVal > bVal
              ? 1
              : -1
            : aVal < bVal
            ? 1
            : -1;
        });
      }

      setFilteredData(filtered);
    }
  }, [data, activeFilters, sortColumn, sortDirection]);

  const deleteTask = async (taskId: string) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE}/delete/${taskId}`);
    await fetchData();
  };

  const renderHeaderWithFilter = (label: string, key: keyof Task) => (
    <th className="px-6 py-3 relative">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => {
          if (sortColumn === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
          } else {
            setSortColumn(key);
            setSortDirection("asc");
          }
        }}
      >
        <span>{label}</span>
        <div className="flex flex-col text-gray-500 ml-1">
          <span
            className={`leading-3 ${
              sortColumn === key && sortDirection === "asc"
                ? "text-black font-bold"
                : ""
            }`}
          >
            ▲
          </span>
          <span
            className={`leading-3 ${
              sortColumn === key && sortDirection === "desc"
                ? "text-black font-bold"
                : ""
            }`}
          >
            ▼
          </span>
        </div>

        {key !== "notes" && (
          <svg
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpenColumn((prev) => (prev === key ? null : key));
            }}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={`h-4 w-4 ml-2 transition-colors ${
              activeFilters[key]?.length ? "text-gray-800" : "text-gray-400"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {dropdownOpenColumn === key && key !== "notes" && (
        <div className="absolute z-10 mt-2">
          <FilterPopOver
            options={columnFilters[key]}
            heading={label}
            selected={activeFilters[key]}
            onApply={(values) => {
              setActiveFilters((prev) => ({ ...prev, [key]: values }));
              setDropdownOpenColumn(null);
            }}
            onClose={() => setDropdownOpenColumn(null)}
          />
        </div>
      )}
    </th>
  );

  return (
    <div>
      <div className="h-[80px] w-full bg-gray-400 px-6 flex items-center">
        <button
          onClick={() => setOpenAddModal(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2"
        >
          + Add Task
        </button>
      </div>
      <div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 bg-gray-50">
            <tr>
              {renderHeaderWithFilter("Date", "date")}
              {renderHeaderWithFilter("Entity", "entity")}
              {renderHeaderWithFilter("Task Type", "type")}
              {renderHeaderWithFilter("Time", "createdTime")}
              {renderHeaderWithFilter("Contact Person", "contactPerson")}
              {renderHeaderWithFilter("Notes", "notes")}
              {renderHeaderWithFilter("Status", "status")}
              <th className="px-6 py-3">Edit</th>
              <th className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((taskObj) => (
              <tr key={taskObj._id} className="bg-gray-100 border-b">
                <td className="px-6 py-4">{taskObj.date}</td>
                <td className="px-6 py-4">{taskObj.entity}</td>
                <td className="px-6 py-4">{taskObj.type}</td>
                <td className="px-6 py-4">{taskObj.createdTime}</td>
                <td className="px-6 py-4">{taskObj.contactPerson}</td>
                <td className="px-6 py-4 max-w-[300px] truncate">
                  {taskObj.notes?.length ? (
                    taskObj.notes
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedTask(taskObj);
                        setOpenNoteModal(true);
                      }}
                      className="text-blue-700 underline"
                    >
                      Add Notes
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    onClick={() => {
                      setSelectedTask(taskObj);
                      setOpenStatusTaskId(taskObj._id as string);
                    }}
                    className="text-orange-700 cursor-pointer"
                  >
                    {taskObj.status}
                  </button>
                  {openStatusTaskId === taskObj._id && (
                    <div className="absolute top-full left-0 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <div
                            onClick={async () => {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_API_BASE}/edit/${taskObj._id}`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    status: "Open",
                                  }),
                                }
                              );

                              await res.json();
                              if (res.ok) {
                                setOpenStatusTaskId("");
                              }
                            }}
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Open
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={async () => {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_API_BASE}/edit/${taskObj._id}`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    status: "Close",
                                  }),
                                }
                              );

                              await res.json();
                              if (res.ok) {
                                setOpenStatusTaskId("");
                              }
                            }}
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Close
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
                <td
                  className="px-6 py-4 text-blue-600 cursor-pointer"
                  onClick={() => {
                    setSelectedTask(taskObj);
                    setOpenEditModal(true);
                  }}
                >
                  Edit
                </td>
                <td
                  className="px-6 py-4 text-red-600 cursor-pointer"
                  onClick={() => deleteTask(taskObj._id as string)}
                >
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <CommonTaskModal setOpenModal={setOpenAddModal} title="New Task" />
        </div>
      )}
      {openEditModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <CommonTaskModal
            setOpenModal={setOpenEditModal}
            title="Edit Task"
            task={selectedTask}
          />
        </div>
      )}
      {openNoteModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <NoteModal
            setOpenNoteModal={setOpenNoteModal}
            _id={selectedTask._id as string}
          />
        </div>
      )}
    </div>
  );
};

const FilterPopOver = ({
  options,
  heading,
  selected,
  onApply,
  onClose,
}: {
  options: string[];
  heading: string;
  selected: string[];
  onApply: (vals: string[]) => void;
  onClose: () => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selected);

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="w-48 p-3 bg-white rounded-lg shadow border">
      <div className="flex justify-between items-center mb-2">
        <h6 className="text-sm font-medium">{heading}</h6>
        <button onClick={onClose} className="text-xs text-gray-500">
          ✕
        </button>
      </div>
      <div className="max-h-48 overflow-auto">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 mb-1 text-sm"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <button
        onClick={() => onApply(selectedOptions)}
        className="mt-2 w-full text-white bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default TaskTable;
