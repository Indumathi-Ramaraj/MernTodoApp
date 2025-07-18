import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteTodo, getTodo, postTodo, updateTodo } from "../action/todo";
import Cookies from "js-cookie";
import type { Todo } from "../type/todo";

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo>([]);
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user && user?.id) {
      getTodo(user?.id)
        .then((res) => {
          const tasks = Array.isArray(res[0]?.toDoList) ? res[0].toDoList : [];

          setTodos(tasks);
        })
        .catch(() => {
          toast.error("Error in fetching the todo list");
        });
    }
  }, [user?.id]);

  const addTask = () => {
    if (task.trim()) {
      postTodo(user?.id, [
        {
          title: task,
          done: false,
        },
      ])
        .then((res) => {
          toast.success("Successfully added the todo");
          setTodos(res.todo.toDoList);
        })
        .catch(() => toast.error("Error in adding the todo list"));
      setTask("");
    }
  };

  const toggleDone = (id: number, title: string, done: boolean) => {
    updateTodo(user?.id, { id, done })
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
    deleteTodo(user?.id, id)
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

  console.log("todos..", todos);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 Todo App</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter a task..."
            className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm"
            >
              <span
                className={`flex-1 ${
                  todo.done ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => {
                  if (todo._id) toggleDone(todo._id, todo.title, !todo.done);
                }}
              >
                <CheckCircle
                  className={`w-5 h-5 mr-2 ${
                    todo.done ? "text-green-500" : "text-gray-400"
                  }`}
                />
              </button>
              <button
                onClick={() => {
                  if (todo._id) toggleDelete(todo._id, todo.title);
                }}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
