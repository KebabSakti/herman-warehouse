import { HiChevronLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

type TitleProps = {
  index?: boolean;
  onClick?: () => void;
  title: string;
};

export function Title(props: TitleProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          className={`rounded-full border p-1 ${
            props.index != null ? "hidden" : "block"
          }`}
          onClick={() => {
            if (props.onClick) {
              props.onClick();
            } else {
              navigate(-1);
            }
          }}
        >
          <HiChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-bold text-lg text-oncontainer">{props.title}</div>
      </div>
    </>
  );
}
