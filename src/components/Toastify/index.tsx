import { Slide, toast, ToastOptions, ToastPosition } from 'react-toastify';

interface ToastProps {
  type: 'success' | 'error' | 'loading';
  message: string;
  position?: ToastPosition;
}

const defaultToastOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 2000,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  closeOnClick: false,
  closeButton: false,
  transition: Slide,
};

export const Toastify = ({ message, type, position }: ToastProps) => {
  const toastConfig = {
    ...defaultToastOptions,
    position: position || defaultToastOptions.position,
  };

  switch (type) {
    case 'success':
      toast.success(message, {
        ...toastConfig,
      });
      return;

    case 'error':
      toast.error(message, {
        ...toastConfig,
      });
      return;

    case 'loading':
      toast.loading(message, {
        ...toastConfig,
      });
      return;
    default:
      toast(message, toastConfig);
  }
}