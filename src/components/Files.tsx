import axios from "axios";
import React, { useEffect } from "react";
import fileIcon from "../assets/file-icon.svg";
import deleteIcon from "../assets/delete-icon.svg";
import downloadIcon from "../assets/download-icon.svg";

interface FileProps {
  setLoader: (loader: boolean) => void;
  files: string[];
  setFiles: (files: string[]) => void;
}

const Files = (props: FileProps) => {
  const { setLoader, files, setFiles } = props;

  const downloadFile = async (fileName: string) => {
    setLoader(true);
    await axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/api/files/download/${fileName}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => console.log(err));
    setLoader(false);
  };

  const deleteFile = async (fileName: string) => {
    setLoader(true);
    await axios
      .delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/files/delete/${fileName}`
      )
      .then((res) => {
        const filesSet = new Set(files);
        filesSet.delete(fileName);
        setFiles(Array.from(filesSet));
      })
      .catch((error) => console.log(error));
    setLoader(false);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/files/get-files`)
      .then((res) => setFiles(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-container">
      {files.map((fileName, index) => (
        <div className="flex-item" key={fileName + index}>
          <img src={fileIcon} alt="file icon" />
          <p>{fileName}</p>
          <div>
            <img
              src={deleteIcon}
              alt="delete icon"
              width={30}
              height={30}
              onClick={() => deleteFile(fileName)}
            />
            <img
              src={downloadIcon}
              alt="download icon"
              width={30}
              height={30}
              onClick={() => downloadFile(fileName)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Files;
