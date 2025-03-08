import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Files from "./components/Files";
import Loader from "./components/Loader";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);

  const [loader, setLoader] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    setError("");
    const fileForm = new FormData();
    fileForm.append("file", file);
    setLoader(true);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/files/upload`, fileForm)
      .then((res) => setFiles([...files, file.name]))
      .catch((err) => console.log("failed", err));
    setLoader(false);
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <br />
      <p className="error-message">{error}</p>
      <br />
      <button className="button" onClick={handleUpload}>
        Upload
      </button>
      <Files setLoader={setLoader} files={files} setFiles={setFiles} />
      {loader && <Loader />}
    </div>
  );
}

export default App;
