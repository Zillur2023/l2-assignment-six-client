"use client";
import { IUser } from "@/type";
import { Button, Spinner, Tooltip } from "@nextui-org/react";
import { ReactNode, useState } from "react";

interface LoadingButtonProps {
  onClick?: () => Promise<void>; // Async function for handling the button action
  buttonId: string; // Unique identifier for each button
  children: ReactNode;
  data?: IUser[];
  btnClass?: string
}

const CustomButton: React.FC<LoadingButtonProps> = ({
  onClick,
  buttonId,
  children,
  data,
  btnClass
}) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleClick = async () => {
    if (!onClick) return; // Exit if onClick is undefined

    setLoadingStates((prev) => ({ ...prev, [buttonId]: true })); // Set loading for the specific button
    try {
      await onClick();
    } finally {
      setLoadingStates((prev) => ({ ...prev, [buttonId]: false })); // Reset loading for the button
    }
  };

  return (
    <>
      {data?.length ? (
        <Tooltip
          content={
            <div className="whitespace-pre-wrap">
              {data?.map((item) => item?.name).join("\n")}
            </div>
          }
          placement="bottom"
        >
          <Button
            size="sm"
            onClick={handleClick}
            disabled={loadingStates[buttonId]}
            className={ !btnClass ? "flex items-center gap-3 bg-transparent hover:bg-gray-300 " : btnClass }
          >
            {loadingStates[buttonId] ? (
              <Spinner size="sm"></Spinner>
            ) : (
              <> {children} </>
            )}
          </Button>
        </Tooltip>
      ) : (
        <Button
          size="sm"
          onClick={handleClick}
          disabled={loadingStates[buttonId]}
          className={ !btnClass ? "flex items-center gap-3 bg-transparent hover:bg-gray-300 " : btnClass }
          >
          {loadingStates[buttonId] ? (
            <Spinner size="sm"></Spinner>
          ) : (
            <> {children} </>
          )}
        </Button>
      )}
    </>
  );
};

export default CustomButton;
