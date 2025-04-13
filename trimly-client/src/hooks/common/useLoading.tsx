import { createContext, useState, useContext } from "react";

const LoadingContext = createContext<{
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  isSpinnerLoading: boolean;
  startSpinnerLoading: () => void;
  stopSpinnerLoading: () => void;
  setLoadingState: (state: boolean) => void;
} | null>(null);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const startSpinnerLoading = () => setIsSpinnerLoading(true);
  const stopSpinnerLoading = () => setIsSpinnerLoading(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const setLoadingState = (state: boolean) => setIsLoading(state);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoading,
        stopLoading,
        isSpinnerLoading,
        startSpinnerLoading,
        stopSpinnerLoading,
        setLoadingState,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
