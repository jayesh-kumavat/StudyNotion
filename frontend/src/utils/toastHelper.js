import { toast } from "react-hot-toast"

export const apiToast = {
  loading: (msg = "Loading...") => toast.loading(msg, { id: "api-toast" }),
  success: (msg) => toast.success(msg, { id: "api-toast" }),
  error: (msg) => toast.error(msg, { id: "api-toast" }),
  dismiss: () => toast.dismiss("api-toast"),
}
