import "../styles/app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import Signup from "./Signup";
import SessionExpired from "./SesionExpired";
import TodoApp from "./Todo";
import ErrorBoundary from "./ErrorBoundary";
import TestErrorComponent from "./TestErrorBoundary";

function App() {
  return (
    <div>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todo" element={<TodoApp />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/test" element={<TestErrorComponent />} />
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="light"
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;
