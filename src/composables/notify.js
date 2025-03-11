import { useToast } from 'vue-toastification';

const toast = useToast();

export const useNotify = () => {
  const notify = (message, timeout = 3000, type = 'info') => {
    const options = {
      timeout,
      position: 'top-right',
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  return {
    notify,
    success: (message, timeout) => notify(message, timeout, 'success'),
    error: (message, timeout) => notify(message, timeout, 'error'),
    warning: (message, timeout) => notify(message, timeout, 'warning'),
    info: (message, timeout) => notify(message, timeout, 'info')
  };
};