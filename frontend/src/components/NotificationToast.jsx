import toast from "react-hot-toast";

const NotificationToast = ({ t, sender, newMessage, setSelectedUser }) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-base-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full object-cover border border-base-300"
              src={sender?.profilePic || "/avatar.png"}
              alt=""
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-base-content">
              {sender?.fullName || "New Message"}
            </p>
            <p className="mt-1 text-sm text-base-content/60 truncate">
              {newMessage.image ? "Sent an image" : newMessage.text}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-base-300">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            setSelectedUser(sender);
          }}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:bg-base-200 focus:outline-none"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
