import { LoaderCircle } from "lucide-react";
import { useLoading } from "../context/LodingContext";

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="text-white text-3xl animate-pulse flex gap-x-2">
        <p className="mt-1">Loading</p>
        <LoaderCircle color="white" size={40} className="animate-spin-slow" />
      </div>
    </div>
  );
};

export default GlobalLoader;
