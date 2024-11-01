import { cn } from "@/lib/utils";
import './Skeleton.css';

function Skeleton({ className, animation=true, ...props }) {
  return (
    <div
      className={cn("bg-gray-400 rounded-3xl",
        animation ? "shimmer-effect" : "",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
