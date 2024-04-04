import React, { useState, useRef, useEffect } from "react";

interface LimitStringWithUrlProps {
  string: string;
  maxChars: number;
}

const LimitStringWithUrl: React.FC<LimitStringWithUrlProps> = (props) => {
  const { string, maxChars } = props;

  function isURL(str: string): boolean {
    const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(str);
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const modalOverlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === modalOverlayRef.current) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const modalStyles: React.CSSProperties = {
    display: "block",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
  };

  const modalContentStyles: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    borderRadius: "5px",
  };

  const closeStyles: React.CSSProperties = {
    position: "absolute",
    color: "#F21414",
    top: "-8px",
    right: "-8px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    cursor: "pointer",
    fontSize: "30px",
  };

  const displayText =
    string.length > maxChars ? (
      isURL(string) ? (
        <a
          href={string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1479F2]"
        >
          {string.slice(0, maxChars) + "..."}
        </a>
      ) : (
        <span onClick={handleOpenModal} style={{ cursor: "pointer" }}>
          {string.slice(0, maxChars) + "..."}
        </span>
      )
    ) : isURL(string) ? (
      <a href={string} target="_blank" rel="noopener noreferrer">
        {string}
      </a>
    ) : (
      <span>{string}</span>
    );

  return (
    <span>
      {displayText}
      {isModalOpen && (
        <div
          ref={modalOverlayRef}
          style={modalStyles}
          onClick={handleOverlayClick}
        >
          <div style={modalContentStyles}>
            <span style={closeStyles} onClick={handleCloseModal}>
              &times;
            </span>
            <p>{string}</p>
          </div>
        </div>
      )}
    </span>
  );
};

export default LimitStringWithUrl;
