import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import vite from "../../public/vite.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function SessionExpired() {
  const navigate = useNavigate();
  let token = Cookies.get("token") || "";

  useEffect(() => {
    const userToken = token ? JSON.parse(token) : null;

    if (!userToken) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="w-2/3 bg-white rounded-lg shadow-lg p-8">
        <img
          src={vite}
          alt="Session Expired"
          className="w-auto h-52 mb-8 mx-auto"
        />

        <h1 className="text-3xl text-gray-900 mb-4 text-center font-semibold">
          Your session has expired
        </h1>

        <p className="text-base font-normal mb-2 text-center text-gray-700">
          Oops! It seems like you've been inactive for a while. For your
          security, we've logged you out of your session.
        </p>

        <p className="text-base font-normal mb-8 text-center text-gray-700">
          Feel free to log back in whenever you're ready to continue.
        </p>

        <div className="flex justify-center items-center">
          <Link
            to="/login"
            className="bg-green-600 hover:bg-green-700 transition duration-200 rounded-lg w-100 px-4 py-1 text-white text-base font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SessionExpired;
