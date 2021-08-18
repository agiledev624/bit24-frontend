import Toast from "./Toast.store";
import ToastContainer from "./Toast.container";

type ToastType = "success" | "warning" | "error" | "info";

type Toast = {
  [x in ToastType]?: (
    message: string,
    header?: string,
    duration?: number
  ) => void;
} & {
  open: ({
    type,
    message,
    header,
    duration,
  }: {
    type: ToastType;
    message: string;
    header?: string;
    duration?: number;
  }) => void;
};

const toast: Toast = {
  /**
   * @params {string} type : success | warning | error | info
   */
  open: function ({ type, message, header, duration }) {
    Toast[type](message, header, duration);
  },
};

["success", "warning", "error", "info"].forEach((type) => {
  toast[type] = function (message: string, header?: string, duration?: number) {
    Toast[type](message, header, duration);
  };
});

export { toast };

export { ToastContainer };

export default toast;
