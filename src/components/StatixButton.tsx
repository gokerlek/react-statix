import React from "react";

interface StatixButtonProps {
  onClick: () => void;
}

export const StatixButton: React.FC<StatixButtonProps> = ({ onClick }) => {
  return (
    <button
      data-testid="statix-button"
      onClick={onClick}
      style={{
        position: "fixed",
        backgroundColor: "white",
        bottom: "12px",
        right: "12px",
        width: "50px",
        height: "50px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 10000000,
        padding: "5px",
      }}
    >
        <svg
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <g id="rotating-group">
                    <path
                        d="M1.34391 26.0377L8.87169 18.9046C8.34648 17.8841 8.05 16.7267 8.05 15.5C8.05 14.6485 8.19286 13.8303 8.45593 13.0682L1.34098 6.434C1.02131 6.13593 0.5 6.36262 0.5 6.7997V25.6748C0.5 26.1138 1.02526 26.3397 1.34391 26.0377Z"
                        fill="black"
                    />
                    <path
                        d="M15.5 8.05C16.6959 8.05 17.8261 8.3318 18.8276 8.83261L26.0145 1.34627C26.3196 1.02846 26.0943 0.5 25.6538 0.5H6.11285C5.66963 0.5 5.44555 1.03396 5.75603 1.35026L12.82 8.5466C13.6516 8.22585 14.5553 8.05 15.5 8.05Z"
                        fill="black"
                    />
                    <path
                        d="M22.95 15.5C22.95 16.4683 22.7653 17.3934 22.4292 18.2421L30.6561 26.0377C30.9747 26.3397 31.5 25.6748 31.5 25.6748V6.36728C31.5 5.92519 30.9684 5.70061 30.6514 6.00882L22.7332 13.7086C22.8749 14.2824 22.95 14.8824 22.95 15.5Z"
                        fill="black"
                    />
                    <path
                        d="M15.5 22.95C16.4343 22.95 17.3284 22.778 18.1524 22.464L26.0145 30.6537C26.3196 30.9715 26.0943 31.5 25.6538 31.5H6.34622C5.90567 31.5 5.68043 30.9715 5.98552 30.6537L13.6126 22.7088C14.2154 22.8662 14.8479 22.95 15.5 22.95Z"
                        fill="black"
                    />
                </g>

                <path
                    d="M18 9.5L12 16.5833H15.4286L14.2857 22L20 14.4167H16.5714L18 9.5Z"
                    fill="black"
                >
                    <animate
                        attributeName="opacity"
                        values="0.5;1;0.5"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                </path>
            </g>
        </svg>
    </button>
  );
};
