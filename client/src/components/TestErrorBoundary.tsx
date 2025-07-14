// components/TestErrorComponent.tsx
import { useEffect } from "react";

const TestErrorComponent = () => {
  useEffect(() => {
    throw new Error("Test error thrown intentionally!");
  }, []);

  return <div>This will never render</div>;
};

export default TestErrorComponent;
