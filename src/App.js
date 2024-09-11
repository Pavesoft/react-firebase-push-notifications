import { useEffect } from "react";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";
function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      toast(payload.notification.body);
    });
  }, []);
  return (
    <div className="App">
      Hello
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: "orange",
            color: "brown",
          },
        }}
      />
    </div>
  );
}

export default App;
