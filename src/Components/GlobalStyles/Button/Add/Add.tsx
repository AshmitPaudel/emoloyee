import { Tooltip } from "@mui/material";
import { AddRounded } from "@mui/icons-material";

type Props = {
  onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  label?: string;
  // disabled?: boolean;
};

export default function AddButton({
  onAdd,
  title = "Edit",
  label = "Add",
  // disabled = false,
}: Props) {
  return (
    <Tooltip title={title}>
      <button
        onClick={onAdd}
        // disabled={disabled}
        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md 
      hover:bg-blue-700 text-sm whitespace-nowrap"
      >
        <AddRounded className="mr-2" /> {label}
      </button>
    </Tooltip>
  );
}
