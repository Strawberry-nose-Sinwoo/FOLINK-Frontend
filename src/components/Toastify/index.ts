import { Slide, toast, ToastOptions, ToastPosition } from 'react-toastify';

interface ToastProps {
  type: 'success' | 'error' | 'loading' | 'update' | 'dismiss';
  iconType?: 'info' | 'success' | 'warning' | 'error' | 'default';
  message?: string;
  position?: ToastPosition;
  toastId?: string;
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

export const Toastify = ({ message, type, iconType, position, toastId }: ToastProps) => {
  const toastConfig = {
    ...defaultToastOptions,
    position: position || defaultToastOptions.position,
    toastId: toastId || undefined,
    type: iconType || 'default',
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
    case 'update':
      toast.update(toastId!, {
        ...toastConfig,
      });
      return
    case 'dismiss':
      toast.dismiss(toastId!);
      return;
    default:
      toast(message, toastConfig);
  }
}