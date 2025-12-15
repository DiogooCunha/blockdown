import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import SmartEditor from "./SmartEditor";
import Footer from "../shared/Footer";
import { useAutosave } from "@/hooks/useAutoSave";

const EditorLayout = () => {
  const { value, setValue, isSaving } = useAutosave({
    key: "smart-editor:content",
    delay: 3000,
  });
  return (
    <div className='h-screen flex flex-col bg-background mx-20'>
      <Navbar value={value} />

      <main className='flex-1 overflow-hidden'>
        <SmartEditor value={value} onChange={setValue} />
      </main>

      <Footer isSaving={isSaving} />
    </div>
  );
};

export default EditorLayout;
