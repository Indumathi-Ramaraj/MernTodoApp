import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteTodo, getTodo, postTodo, updateTodo } from "../action/todo";
import Cookies from "js-cookie";
import type { Todo } from "../type/todo";
import { Link } from "react-router-dom";
import { generateTimeIntervals } from "../utlis";
import { todoColumns } from "./columns";
import Modal from "./ui/Modal";
import Table from "./ui/Table";

const TodoApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState("");
  const [whatsapp, setWhatsapp] = useState(false);
  const [emailOption, setEmailOption] = useState(false);
  const [todos, setTodos] = useState<Todo>([]);
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;

  const getTodos = (id: string) => {
    getTodo(id)
      .then((res) => {
        const tasks = Array.isArray(res[0]?.toDoList) ? res[0].toDoList : [];
        setTodos(tasks);
      })
      .catch(() => {
        toast.error("Error in fetching the todo list");
      });
  };

  const addTask = () => {
    if (task.trim()) {
      postTodo(user?.id, whatsapp, emailOption, user.email, user.phoneNumber, [
        {
          title: task,
          done: false,
        },
      ])
        .then((res) => {
          toast.success("Successfully added the todo");
          setTodos(res.todo);
        })
        .catch(() => toast.error("Error in adding the todo list"));
      setTask("");
    }
  };

  const toggleDone = (id: number, title: string, done: boolean) => {
    updateTodo(user?.id, whatsapp, emailOption, user.email, user.phoneNumber, {
      id,
      done,
    })
      .then(() => {
        toast.success(
          `${
            done
              ? `Updated the title ${title} to done`
              : `Updated the title ${title} to undone`
          }`
        );
        setTodos(
          todos.map((todo) => (todo._id === id ? { ...todo, done } : todo))
        );
      })
      .catch((err) =>
        toast.error(
          `Error in updating ${title} to done. Reason:${err.response.data.error}`
        )
      );
  };

  const toggleDelete = (id: number, title: string) => {
    deleteTodo(
      user?.id,
      whatsapp,
      emailOption,
      user.email,
      user.phoneNumber,
      id
    )
      .then(() => {
        toast.success(`Successfully deleted the todo with title ${title}`);
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) =>
        toast.error(
          `Error in deleting the todo. Reason: ${err.response.data.error}`
        )
      );
  };

  useEffect(() => {
    if (user && user?.id) {
      getTodos(user?.id);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-100 flex  p-4">
      <div className="w-full p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-2xl font-bold text-center flex-1">📝 Todo App</h1>
          <Link
            onClick={() => {
              Cookies.remove("token");
              Cookies.remove("user");
            }}
            to="/login"
            className="bg-gray-400 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition font-medium cursor-pointer"
          >
            Sign out
          </Link>
        </div>
        {/* Notification */}
        <div className="flex justify-center items-center gap-x-10">
          <div className="flex justify-center items-center mb-4 gap-x-2">
            <input type="checkbox" onChange={() => setWhatsapp(!whatsapp)} />
            <label>Require whatsapp message</label>
          </div>
          <div className="flex justify-center items-center mb-4 gap-x-2">
            <input
              type="checkbox"
              onChange={() => setEmailOption(!emailOption)}
            />
            <label>Require email notification</label>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Task
        </button>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Add New Task"
        >
          <div>
            <label className="block font-medium mb-1 text-gray-700 px-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter a task title..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700 px-2">
              Description
            </label>
            <textarea
              placeholder="Enter task Description..."
              rows={3}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700 px-2">
              Due Date
            </label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-gray-700 px-2">
              Due Time
            </label>
            <select className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400">
              {generateTimeIntervals().map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full mt-4"
          >
            Add Task
          </button>
        </Modal>

        <Table data={todos} columns={todoColumns(toggleDone, toggleDelete)} />
      
      </div>
    </div>
  );
};

export default TodoApp;
