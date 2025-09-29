import { useEffect, useState } from "react";
import { TaskRow } from "./TaskRow";
import type { Task, Priority, Status } from "./types";
import Weather from "./weather";
import { FilterIcon } from "./FilterIcon";
import headerImg from "../assets/headerimg.png";
import { FaSearch } from "react-icons/fa"; // If using react-icons

const initialTasks: Task[] = [
  // Example tasks or fetch from storage/api
];

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("low");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<Status>("all");
  const [searchText, setSearchText] = useState("");
  const [weatherTemp, setWeatherTemp] = useState<number>(0);
  const [weatherCondition, setWeatherCondition] = useState<string>("");
  const [sortByPriority, setSortByPriority] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Example: Fetch weather for Helsingborg
    const fetchWeather = async () => {
      try {
        const apiKey = "YOUR_API_KEY";
        const city = "Helsingborg";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;
        const response = await fetch(url);
        const data = await response.json();
        setWeatherTemp(Math.round(data.main.temp));
        setWeatherCondition(data.weather[0].main); // e.g. "Rain", "Clear", "Clouds"
      } catch (error) {
        setWeatherTemp(0);
        setWeatherCondition("standard");
      }
    };
    fetchWeather();
  }, []);

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
    setEditText(task.text);
  };

  // Update Task
  const updateTask = (id: number, text: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
    setEditingId(null);
    setEditText("");
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
      <div className="w-full max-w-2xl bg-[#a9ccc7] rounded-2xl p-8 flex justify-center items-center">
        {/* Main card with black border and no color */}
        <div className="w-full max-w-xl border-2 border-black rounded-xl shadow-md p-8 ">
          {/* Header image now inside the card */}
          <img
            src={headerImg}
            alt="Today's 2DO Header"
            className="mx-auto mt-6 mb-8 w-72" // Increased mb-8 for more bottom margin
          />
          {/* Labels above the bar */}
          <div className="flex justify-between items-center mb-1 px-2">
            <span className="text-xs font-semibold text-black">
              What should we do today?
            </span>
            <span className="text-xs font-semibold text-black mr-16">
              Priority
            </span>
          </div>
          {/* Add Task Bar (input + select) */}
          <div className="flex w-full mb-4 items-center">
            <div className="flex flex-1 bg-white rounded-lg shadow-inner items-center px-2 py-2 relative">
              <input
                className="flex-1 min-w-0 max-w-[220px] p-2 rounded-l bg-white text-black placeholder-gray-400 border-none focus:outline-none"
                placeholder="To do..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <div className="relative">
                <select
                  className="p-2 pr-8 rounded bg-white text-transparent border-none appearance-none focus:outline-none"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  style={{ minWidth: "70px" }}
                >
                  <option className="text-black" value="high">
                    High
                  </option>
                  <option className="text-black" value="medium">
                    Medium
                  </option>
                  <option className="text-black" value="low">
                    Low
                  </option>
                </select>
                {/* Black triangle */}
                <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" />
                  </svg>
                </span>
              </div>
            </div>
            <button
              className="bg-[#7ba89f] text-white px-6 py-2 rounded font-bold ml-3"
              onClick={addTask}
            >
              ADD
            </button>
          </div>
          {/* Tabs and Search Row */}
          <div className="flex items-center w-full mb-4 justify-between">
            {/* Filter Buttons */}
            <div className="flex space-x-1">
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "all" ? "bg-gray-300" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "pending" ? "bg-gray-300" : ""
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "done" ? "bg-gray-300" : ""
                }`}
                onClick={() => setFilter("done")}
              >
                Done
              </button>
            </div>
            {/* Search Input + Icons (fixed width, left aligned) */}
            <div className="flex items-center justify-start w-64">
              {showSearch && (
                <input
                  className="p-1 text-xs border rounded bg-white bg-opacity-30 transition-all duration-200 mr-1"
                  style={{ width: 120 }}
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              )}
              <button
                className="p-1"
                onClick={() => setShowSearch((prev) => !prev)}
                aria-label="Toggle search"
              >
                <FaSearch className="w-5 h-5 text-gray-700" />
              </button>
              <FilterIcon
                className="w-6 h-6 ml-1"
                onClick={() => setSortByPriority((prev) => !prev)}
              />
            </div>
          </div>
          {/* Task List */}
          <div className="w-full space-y-2">
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
          {/* Weather Widget */}
          <div className="mt-8 w-full flex justify-center">
            <Weather />
          </div>
        </div>
      </div>
    </div>
  );
}
