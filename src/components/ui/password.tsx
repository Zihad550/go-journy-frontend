import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";

export default function Password({ ...field }) {
  const id = useId();
  const [is_visible, set_is_visible] = useState<boolean>(false);

  const toggleVisibility = () => set_is_visible((prevState) => !prevState);

  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          id={id}
          className="pe-9"
          placeholder="*******"
          type={is_visible ? "text" : "password"}
          {...field}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={is_visible ? "Hide password" : "Show password"}
          aria-pressed={is_visible}
          aria-controls="password"
        >
          {is_visible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
