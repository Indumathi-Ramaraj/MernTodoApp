import { Dispatch, SetStateAction, ReactNode } from "react";

export interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export interface LoadingProviderProps {
  children: ReactNode;
}
