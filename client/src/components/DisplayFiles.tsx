import { useEffect, useState } from "react";
import { getFiles, createNewFile } from "../api/files";
import { useNavigate } from "react-router-dom";

const DisplayFiles = () => {
  const navigate = useNavigate();

  interface FileResponse {
    fileid: string;
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    branchId?: string | null;
    latestVersionId?: string | null;
  }

  interface FileType {
    fileid: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    branchId: string | null;
    latestVersionId: string | null;
  }

  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);

      const response = await getFiles();

      if (!response?.success) {
        console.error("❌ Failed to fetch files");
        setFiles([]);
        return;
      }

      const normal: FileType[] = response.files.map((file: FileResponse) => ({
        fileid: file.fileid || file._id,
        branchId: file.branchId || null,
        title: file.title,
        latestVersionId: file.latestVersionId || null,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }));

      setFiles(normal);
    } catch (err) {
      console.error("❌ Error fetching files:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handalCreateFile = async (title: string) => {
    try {
      const file = await createNewFile(title);
      if (file === undefined) alert("file failed to create ");
      else navigate(`/editorpage/${file.fileId}/${file.branchId}`);
    } catch (err) {
      console.log("files could not be created ");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <style>
        {`
        .file-card {
          background: rgba(30, 30, 30, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
        }
        
        .file-card:hover {
          background: rgba(30, 30, 30, 0.95);
          border-color: rgba(51, 161, 224, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .create-card {
          background: linear-gradient(135deg, rgba(51, 161, 224, 0.1), rgba(44, 194, 123, 0.1));
          backdrop-filter: blur(12px);
          border: 2px dashed rgba(51, 161, 224, 0.3);
          transition: all 0.2s ease;
        }
        
        .create-card:hover {
          background: linear-gradient(135deg, rgba(51, 161, 224, 0.2), rgba(44, 194, 123, 0.2));
          border-color: rgba(51, 161, 224, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(51, 161, 224, 0.2);
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .separator-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 24px 0;
        }
        `}
      </style>

      {loading ? (
        <div className="flex items-center justify-center w-full py-12">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner w-6 h-6 border-2 border-[#33A1E0] border-t-transparent rounded-full"></div>
            <span className="text-white text-lg">Loading files...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {/* Existing Files */}
          {files.map((file) => (
            <div
              key={file.fileid}
              onClick={() => navigate(`/editorpage/${file.fileid}/${file.branchId}`)}
              className="file-card p-6 rounded-xl cursor-pointer group relative min-h-[160px] flex flex-col justify-between"
            >
              {/* File Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#33A1E0] bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#33A1E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                {/* Status Badge */}
                {/* <span className="inline-flex items-center px-2 py-1 bg-[#fef3c5] text-gray-800 text-xs font-medium rounded-full">
                  v{!file.latestVersionId ? "1" : file.latestVersionId}
                </span> */}
              </div>

              {/* File Title */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#33A1E0] transition-colors duration-200">
                  {file.title}
                </h3>
                
                {/* File Meta */}
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">
                    Updated {formatDate(file.updatedAt)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Created {formatDate(file.createdAt)}
                  </p>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-5 h-5 text-[#33A1E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          ))}

          {/* Create New File Card */}
          <div
            onClick={() => handalCreateFile("untitled")}
            className="create-card p-6 rounded-xl cursor-pointer group min-h-[160px] flex flex-col items-center justify-center text-center hover:scale-105 transform transition-all duration-200"
          >
            <div className="w-12 h-12 bg-[#2cc27b] bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-30 transition-all duration-200">
              <svg className="w-8 h-8 text-[#2cc27b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#2cc27b] transition-colors duration-200">
              Create New File
            </h3>
            <p className="text-gray-400 text-sm">
              Start writing something amazing
            </p>
          </div>
        </div>
      )}

      {files.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No files yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first document to get started</p>
          <button
            onClick={() => handalCreateFile("untitled")}
            className="inline-flex items-center px-6 py-3 bg-[#2cc27b] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create First File
          </button>
        </div>
      )}
    </>
  );
};

export default DisplayFiles;
