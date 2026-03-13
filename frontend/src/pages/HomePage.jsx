import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center pt-20 px-4 h-full pb-8">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full md:h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar Logic */}
            <div
              className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-80 h-full border-r border-base-300 flex-col transition-all duration-200`}
            >
              <Sidebar />
            </div>

            {/* Chat Logic */}
            <div
              className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 flex-col h-full transition-all duration-200`}
            >
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
