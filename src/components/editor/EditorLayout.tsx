import Navbar from "../shared/Navbar";
import SmartEditor from "./SmartEditor";
import Footer from "../shared/Footer";
import { useAutosave } from "@/hooks/useAutosave";
import Sidebar from "../shared/Sidebar";

const EditorLayout = () => {
  const { value, setValue, isSaving } = useAutosave({
    noteID: "",
    key: "smart-editor:content",
    delay: 3000,
  });
  console.log(localStorage);

  return (
    <div className='h-screen flex flex-col bg-background mr-20'>
      <Navbar value={value} />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-hidden'>
          <SmartEditor value={value} onChange={setValue} />
        </main>
      </div>
      <Footer isSaving={isSaving} />
    </div>
  );
};

export default EditorLayout;
