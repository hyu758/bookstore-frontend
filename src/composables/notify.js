import { useToast } from 'vue-toastification';
import { ref, h, render, createApp } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const toast = useToast();

export const useNotify = () => {
  const notify = (message, timeout = 1000, type = 'info') => {
    const options = {
      timeout,
      position: 'bottom-right',
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

  // Hàm xác nhận (confirm) sử dụng component ConfirmDialog
  const confirm = (title, message) => {
    return new Promise((resolve) => {
      // Tạo container cho dialog
      const container = document.createElement('div');
      container.id = 'confirm-dialog-container';
      document.body.appendChild(container);

      // Tạo app instance với ConfirmDialog
      const app = createApp({
        setup() {
          const showDialog = ref(true);

          const handleConfirm = () => {
            showDialog.value = false;
            setTimeout(() => {
              document.body.removeChild(container);
              resolve(true);
            }, 300); // Đợi animation kết thúc
          };

          const handleCancel = () => {
            showDialog.value = false;
            setTimeout(() => {
              document.body.removeChild(container);
              resolve(false);
            }, 300); // Đợi animation kết thúc
          };

          return () => h(ConfirmDialog, {
            show: showDialog.value,
            title,
            message,
            onConfirm: handleConfirm,
            onCancel: handleCancel
          });
        }
      });

      // Mount app vào container
      app.mount(container);
    });
  };

  return {
    notify,
    success: (message, timeout) => notify(message, timeout, 'success'),
    error: (message, timeout) => notify(message, timeout, 'error'),
    warning: (message, timeout) => notify(message, timeout, 'warning'),
    info: (message, timeout) => notify(message, timeout, 'info'),
    confirm
  };
};