import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteTodo,
  getTodo,
  postTodo,
  updateTodo,
  searchQuery,
} from "../action/todo";
import Cookies from "js-cookie";
import type { QueryType, Todo } from "../type/todo";
import { Link } from "react-router-dom";
import { generateTimeIntervals } from "../utlis";
import { todoColumns } from "./columns";
import Modal from "./ui/Modal";
import Table from "./ui/Table";
import { Button } from "./ui/Button";
import { Send } from "lucide-react";
import { useLoading } from "../context/LodingContext";
import { userType } from "../type/signup";

const telegramUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";

const todoInitialState = {
  title: "",
  description: "",
  dueDate: "",
  dueTime: "",
};

const queryResultInitialState = {
  view: false,
  value: "",
  result: {
    data: [{ title: "", done: false, dueTime: "", dueDate: "" }],
    message: "",
  },
};

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * TodoApp component provides the main interface for managing a user's todo list.
 *
 * Features:
 * - Displays a welcome message with the user's name.
 * - Allows users to sign out and navigate to the login page.
 * - Provides options to enable WhatsApp, email, and Telegram notifications.
 * - Includes a modal for adding new tasks with fields for title, description, due date, and due time.
 * - Displays a table of todos with options to mark tasks as done, undone, or delete them.
 * - Fetches todos upon component mount using the authenticated user's ID.
 * - Handles task additions, updates, deletions, and error notifications through toast messages.
 * - Integrates Search query functionality for additional features.
 */

const TodoApp = () => {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [task, setTask] = useState(todoInitialState);
  const [whatsapp, setWhatsapp] = useState(false);
  const [emailOption, setEmailOption] = useState(false);
  const [telegramOption, setTelegramOption] = useState(false);
  const [todos, setTodos] = useState<Todo>([]);
  const [queryData, setQueryData] = useState<QueryType>(
    queryResultInitialState
  );
  const userString = Cookies.get("user");
  const user: userType = userString ? JSON.parse(userString) : null;

  const { setIsLoading } = useLoading();

  const getTodos = (id: string) => {
    setIsLoading(true);
    getTodo(id)
      .then((res) => {
        const tasks = Array.isArray(res[0]?.toDoList) ? res[0].toDoList : [];
        setTodos(tasks);
      })
      .catch(() => {
        toast.error("Error in fetching the todo list");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addTask = () => {
    setIsLoading(true);
    if (task.title.trim()) {
      postTodo(
        user?.id,
        whatsapp,
        emailOption,
        telegramOption,
        user.email,
        user.phoneNumber,
        [
          {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            done: false,
          },
        ]
      )
        .then((res) => {
          toast.success("Successfully added the todo");
          setTodos(res.todo);
        })
        .catch(() => toast.error("Error in adding the todo list"))
        .finally(() => {
          setIsLoading(false);
          setTask(todoInitialState);
        });
    }
  };

  const toggleDone = (id: number, title: string, done: boolean) => {
    setIsLoading(true);
    updateTodo(
      user?.id,
      whatsapp,
      emailOption,
      telegramOption,
      user.email,
      user.phoneNumber,
      user.telegramChatId,
      {
        id,
        done,
      }
    )
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
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleDelete = (id: number, title: string) => {
    setIsLoading(true);
    deleteTodo(
      user?.id,
      whatsapp,
      emailOption,
      telegramOption,
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
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (user && user?.id) {
      getTodos(user?.id);
    }
  }, [user?.id]);

  const searchData = (data: string) => {
    setIsLoading(true);
    searchQuery(data)
      .then((response) => {
        setQueryData((prev) => {
          return { ...prev, result: response };
        });
      })
      .catch(() => {
        toast.error("Error fetching search response:");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full p-10 bg-white rounded-lg">
      <div className="flex justify-center items-center mb-4">
        <div className="flex flex-col mx-auto">
          <h1 className="text-3xl font-bold text-center">
            Welcome {user?.name}
          </h1>
          <h1 className="text-2xl font-bold text-center mt-4">📝 Todo App</h1>
        </div>
        <div className="flex-col justify-center items-center"></div>
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
        <div className="flex justify-center items-center mb-4 gap-x-2 mt-4">
          <input type="checkbox" onChange={() => setWhatsapp(!whatsapp)} />
          <label>Require whatsapp notification</label>
        </div>
        <div className="flex justify-center items-center mb-4 gap-x-2 mt-4">
          <input
            type="checkbox"
            onChange={() => setEmailOption(!emailOption)}
          />
          <label>Require email notification</label>
        </div>
        <div className="flex justify-center items-center mb-4 gap-x-2 mt-4">
          <input
            type="checkbox"
            checked={telegramOption}
            onChange={() => {
              if (!user?.telegramChatId) {
                toast.warning(
                  <span>
                    Please link your to telegram and enable notifications.
                    <a
                      href={`https://t.me/${telegramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Send className="w-4 h-4" />
                      Link to Telegram
                    </a>
                    <span className="ml-1">Click</span>{" "}
                    <p className="font-semibold">/start</p>
                    <span className="ml-1">
                      Send your email ID (same as registered) to the bot.
                    </span>
                  </span>
                );
              } else setTelegramOption(!telegramOption);
            }}
          />
          <label>Require Telegram notification &nbsp;</label>
        </div>

        <Button
          onClick={() =>
            setQueryData({
              view: true,
              value: "",
              result: queryResultInitialState.result,
            })
          }
          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          GPT
        </Button>
      </div>

      <Modal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        title="Add New Task"
      >
        <div>
          <label className="block font-medium mb-1 text-gray-700 px-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter a task title..."
            value={task.title}
            onChange={(e) =>
              setTask((prev) => {
                return { ...prev, title: e.target.value };
              })
            }
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            name="title"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700 px-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Enter task Description..."
            rows={3}
            value={task.description}
            onChange={(e) =>
              setTask((prev) => {
                return { ...prev, description: e.target.value };
              })
            }
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700 px-2">
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            value={task.dueDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setTask((prev) => {
                return { ...prev, dueDate: e.target.value };
              })
            }
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700 px-2">
            Due Time
          </label>
          <select
            name="dueTime"
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
            value={task.dueTime}
            onChange={(e) =>
              setTask((prev) => {
                return { ...prev, dueTime: e.target.value };
              })
            }
          >
            {generateTimeIntervals().map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          disabled={!task.title && !task.description}
          onClick={() => {
            if (task.title && task.description) {
              addTask();
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Task
        </Button>
      </Modal>

      <Modal
        open={queryData.view}
        onClose={() => setQueryData(queryResultInitialState)}
        title="Search"
      >
        <div className="flex flex-col justify-center items-center gap-y-4 p-4">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setQueryData((prev: QueryType) => {
                return {
                  ...prev,
                  value: e.target.value,
                  result: queryResultInitialState.result,
                };
              })
            }
          />
          {queryData.result && (
            <>
              <div className="font-medium text-base text-center text-blue-700">
                {queryData.result.message}
              </div>

              <div className="text-gray-700">
                {queryData.result.data.length > 0 &&
                  queryData.result.data[0].title.length > 0 &&
                  queryData.result.data.map((item, index) => {
                    const showNA = new Date(item.dueDate).getFullYear() <= 2000;
                    return (
                      <div
                        key={index}
                        className="mb-2"
                        dangerouslySetInnerHTML={{
                          __html: `Task <b>${item.title}</b> is ${
                            item.done ? "completed" : "incomplete"
                          } ${showNA ? "" : `due on ${item.dueDate}`} ${
                            item.dueTime ? `at ${item.dueTime}` : ""
                          } .`,
                        }}
                      ></div>
                    );
                  })}
              </div>
            </>
          )}
          <div className="flex gap-x-4">
            <Button
              onClick={() => setQueryData(queryResultInitialState)}
              variant="outline"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                searchData(queryData.value);
              }}
            >
              Sumbit
            </Button>
          </div>
        </div>
      </Modal>

      <Table
        data={todos}
        columns={todoColumns(toggleDone, toggleDelete)}
        setNewModalOpen={setNewModalOpen}
      />
    </div>
  );
};

export default TodoApp;
