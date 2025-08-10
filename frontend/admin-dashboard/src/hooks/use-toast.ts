import { toast } from "sonner"

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    error: (message: string, options?: any) => toast.error(message, options),
    success: (message: string, options?: any) => toast.success(message, options),
    warning: (message: string, options?: any) => toast.warning(message, options),
    info: (message: string, options?: any) => toast.info(message, options),
    loading: (message: string, options?: any) => toast.loading(message, options),
    promise: toast.promise,
  }
}
