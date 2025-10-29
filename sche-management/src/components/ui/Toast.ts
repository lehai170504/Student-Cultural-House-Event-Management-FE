// src/components/ui/Toast.ts
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type ToastType = "success" | "error" | "warning" | "info" | "question";

interface ToastOptions {
  title: string;
  icon?: ToastType;
  timer?: number;
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start";
}

export const showToast = ({
  title,
  icon = "success",
  timer = 2000,
  position = "top-end",
}: ToastOptions) => {
  MySwal.fire({
    toast: true,
    position,
    icon,
    title,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};
