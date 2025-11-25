import { useState, useRef, useEffect } from "react";
import { TaskRow } from "./TaskRow";
import type { Task, Priority } from "./types";
import Weather from "./weather";
import { FilterIcon } from "./FilterIcon";
import headerImg from "../assets/headerimg.png";
import { FaSearch } from "react-icons/fa";

const initialTasks: Task[] = [
  // Example tasks or fetch from storage/api
];

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("low");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [searchText, setSearchText] = useState("");
  const [sortByPriority, setSortByPriority] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        console.error("Failed to load tasks from localStorage");
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        priority: newPriority,
        status: "pending",
      },
    ]);
    setNewTask("");
    setNewPriority("low");
  };

  // Toggle Complete
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "pending" ? "done" : "pending" }
          : task
      )
    );
  };

  // Delete Task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start Editing
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
  };

  // Update Task
  const updateTask = (id: number, text: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
    setEditingId(null);
  };

  // Filtered & Searched Tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "pending") return task.status === "pending";
      if (filter === "done") return task.status === "done";
      return true; // "all"
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase())
    );

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const displayedTasks = sortByPriority
    ? [...filteredTasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
    : filteredTasks;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#e0f0ec] py-16">
      {/* Outer card with darker green */}
      <div className="w-full max-w-xl bg-[#a6ccbf] rounded-2xl p-8 flex justify-center items-center">
        {/* Main card with black border and no color */}
        <div className="w-full max-w-lg border-2 border-black p-6 ">
          {/* Header image now inside the card */}
          <img
            src={headerImg}
            alt="Today's 2DO Header"
            className="mx-auto mt-1 mb-8 w-72" // Increased mb-8 for more bottom margin
          />
          {/* Labels above the bar */}
          <div className="flex justify-between items-center mb-1 px-2">
            <span className="text-xs font-semibold text-black">
              What should we do today?
            </span>
            <span className="text-xs font-semibold text-black mr-19">
              Priority
            </span>
          </div>
          {/* Add Task Bar (input + select) */}
          <div className="flex w-full mb-4 items-center">
            <div className="flex bg-[#f5f7ed] rounded-lg shadow-inner items-center px-2 py-1 flex-1 relative">
              <input
                className="min-w-0 max-w-[220px] p-2 rounded-l #fcf6ee text-black placeholder-gray-400 border-none focus:outline-none bg-transparent"
                placeholder="To do..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <div className="flex-1" />
              {/* Priority select and triangle grouped together at the end */}
              <div className="relative flex items-center">
                <select
                  ref={selectRef}
                  className="p-2 pr-8 rounded bg-[#f5f7ed] text-transparent focus:text-black border-none appearance-none focus:outline-none"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  style={{ minWidth: "70px" }}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <span
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={() => {
                    if (selectRef.current) {
                      selectRef.current.focus();
                      selectRef.current.click(); // This will open the dropdown in most browsers
                    }
                  }}
                  tabIndex={0}
                  aria-label="Open priority select"
                  role="button"
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" />
                  </svg>
                </span>
              </div>
            </div>
            <button
              className="bg-[#70938b] text-white text-lg px-4 h-full rounded-md ml-3"
              onClick={addTask}
              style={{ minHeight: "44px" }}
            >
              ADD
            </button>
          </div>
          {/* Tabs and Search Row */}
          <div className="flex items-center w-full mb-1 h-12">
            {/* Filter Buttons */}
            <div className="flex space-x-1">
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "all" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "pending" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "done" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("done")}
              >
                Done
              </button>
            </div>
            {/* Spacer to push search and filter icon to the right */}
            <div className="flex-1"></div>
            {/* Search Input + Icons */}
            <div className="flex items-center">
              {showSearch && (
                <input
                  className="p-1 text-xs rounded bg-[#d8e0d2] border-none focus:outline-none transition-all duration-200 mr-1"
                  style={{ width: 120 }}
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              )}
              <button
                className="p-1 cursor-pointer"
                onClick={() => setShowSearch((prev) => !prev)}
                aria-label="Toggle search"
              >
                <FaSearch
                  className="text-[#273532]"
                  style={{ width: "18px", height: "18px" }} // 10% smaller than 20px
                />
              </button>
            </div>
            {/* Filter Icon aligned right and centered */}
            <div className="flex items-center h-full ml-1 mr-4">
              <FilterIcon
                className="w-6 h-6"
                onClick={() => setSortByPriority((prev) => !prev)}
              />
            </div>
          </div>
          {/* Task List */}
          <div className="w-full space-y-2 mb-15">
            {displayedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onUpdate={updateTask}
                editingId={editingId}
              />
            ))}
          </div>

          {/* Dotted line separator */}
          <div className="my-6 mx-1">
            <hr className="border-dotted border-t-2 border-gray-400" />
          </div>

          {/* Weather Widget */}
          <div className="mt-4 w-full flex justify-center">
            <Weather />
          </div>
        </div>
      </div>
    </div>
  );
}
