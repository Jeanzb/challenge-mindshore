import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        duration: 3800,
        classNames: {
          toast: "!rounded-xl !border-white/10 !backdrop-blur-xl"
        }
      }}
    />
  );
}
