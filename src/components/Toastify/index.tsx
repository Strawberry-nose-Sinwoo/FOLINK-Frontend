import { Slide, toast, ToastOptions, ToastPosition } from "react-toastify";

interface ToastProps {
  type: "loading"
  message: string;
  position?: ToastPosition; 
}

const defaultToastOptions: ToastOptions = {
  position: "top-center",
  autoClose: false,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  closeOnClick: false,
  closeButton: false,
  transition: Slide,
};

export function Toastify({ message, type, position }: ToastProps) {
    const toastConfig = {
      ...defaultToastOptions,
      position: position || defaultToastOptions.position,
    };
  
    switch (type) {
      case "loading":
        toast.loading(message, {
          ...toastConfig,
        })
        return;
      default:
        toast(message, toastConfig);
    }
  }