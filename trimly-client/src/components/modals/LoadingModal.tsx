import { useLoading } from "../../hooks/common/useLoading";
import TrimlyLogo from "/logo.svg";

const LoadingUi = ({ isDarkMode = true }) => {
  const letters = ["T", "r", "i", "m", "l", "y"];

  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center opacity-60 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src={TrimlyLogo}
          className="h-12 w-12 text-[#FF5722] animate-bounce"
        />
        <div className="flex items-center">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } opacity-0 animate-bidirectionalFadeIn`}
              style={{
                animationDelay: `${index * 300}ms`,
                animationFillMode: "forwards",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div
          className={`w-16 h-1 mt-2 rounded-full overflow-hidden ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div className="w-full h-full bg-[#FF5722] animate-loading"></div>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  @keyframes bidirectionalFadeIn {
    0%, 100% {
      opacity: 0;
      transform: translateY(10px);
    }
    40% {
      opacity: 1;
      transform: translateY(0);
    }
    60% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-bidirectionalFadeIn {
    animation: bidirectionalFadeIn 4s infinite;
  }

  .animate-loading {
    animation: loading 1s infinite;
  }
`;
document.head.appendChild(style);

export default LoadingUi;
