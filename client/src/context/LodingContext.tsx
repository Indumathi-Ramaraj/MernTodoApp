import React, { createContext, useState, useContext } from "react";
import { LoadingContextType, LoadingProviderProps } from "../type/loader";

// Provide a default value
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

// Custom hook
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
