import { useEffect, useState } from "react";
import {
  latestVersion,
  CreateChunk,
  CreateVersion,
  CreateBranch,
} from "../api/version";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { generateChunkHashes, getChangedChunks } from "../utils/htmlHashUtils";
import { incTag } from "../utils/storage";
import { changeTitle } from "../api/files";
import { useNavigate } from "react-router-dom";

type FileProps = {
  fileId: string;
  branchId: string;
};

type Branch = {
  id: string;
  name: string;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "code-block",
];

const Editor = ({ fileId, branchId }: FileProps) => {
  const navigate = useNavigate();

  const [value, setValue] = useState<string>("");
  const [chunk, setchunk] = useState<string[]>([]);
  const [chunkHashes, setChunkHashes] = useState<string[]>([]);
  const [added, setadded] = useState<number[]>([]);
  const [removed, setremoved] = useState<number[]>([]);
  const [versionId, setVersionId] = useState<string>("");
  const [tag, setTag] = useState<string | null>(null);
  const [title, settitle] = useState<string | null>("untitled");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [branchName, setBranchName] = useState<string>("");
  const [branchList, setbranchList] = useState<Branch[]>([]);

  const handleSelectBranch = (branchId: string) => {
    navigate(`/editorpage/${fileId}/${branchId}`, { replace: true });
    setBranchMenuOpen(false);
  };

  const handleTitleClick = () => setIsEditing(true);

  const handleBlur = async () => {
    setIsEditing(false);
    if (!title?.trim()) {
      console.warn("Title is empty or invalid, skipping update.");
      return;
    }
    try {
      await changeTitle(title, fileId);
      console.log("Title successfully updated");
    } catch (err) {
      console.error("Failed to update title:", err);
    }
  };

  const fetchLatest = async () => {
    if (!fileId || !branchId) return;
    try {
      console.log("[Editor] Fetching latest version for:", fileId, branchId);
      const body = await latestVersion(fileId, branchId);
      console.log(body);
      setValue(body?.content || "");
      setChunkHashes(body.chunklist || []);
      setTag(body.tag || null);
      setVersionId(body.versionId || "");
      settitle(body.title || "untitled");
      setBranchName(body.branchName || "");
      setbranchList(body.branchList || []);
    } catch (err) {
      console.error("Failed to fetch latest version:", err);
    }
  };

  const checkChunk = async (
    addedIndices: number[],
    hashes: string[],
    chunks: string[]
  ) => {
    for (const index of addedIndices) {
      try {
        const chunkcode = hashes[index];
        const content = chunks[index];
        if (!chunkcode || !content) {
          console.warn("⚠️ Skipping empty chunk:", chunkcode, content);
          continue;
        }
        const res = await CreateChunk(chunkcode, content);
        if (res) console.log("chunk created");
      } catch (err) {
        console.log("❌ could not fetch chunks api call", err);
      }
    }
  };

  const CreateNewVersionFile = async (updatedTag: string, hashes: string[]) => {
    try {
      const msg = await CreateVersion(
        branchId,
        versionId,
        updatedTag,
        fileId,
        hashes
      );
      if (msg) alert(msg);
    } catch (err) {
      console.log("❌ could not create new version file", err);
    }
  };

  const saveVersion = async (mode: "commit" | "branch") => {
    try {
      const { chunks: newChunks, hashes: newHashes } =
        await generateChunkHashes(value);
      const { added, removed } = getChangedChunks(chunkHashes, newHashes);

      if (added.length === 0 && removed.length === 0) {
        alert("No changes detected");
        setShowSaveModal(false);
        return;
      }

      setchunk(newChunks);
      setadded(added);
      setremoved(removed);

      const updatedTag = incTag(tag ?? "Version: #0");
      await checkChunk(added, newHashes, newChunks);

      if (mode === "commit") {
        await CreateNewVersionFile(updatedTag, newHashes);
      } else {
        if (!branchName.trim()) {
          alert("Please enter a branch name");
          return;
        }
        const newBranch = await CreateBranch(
          fileId,
          branchName.trim(),
          versionId,
          updatedTag,
          newHashes,
          branchId
        );
        if (newBranch?.branchId) {
          setChunkHashes(newHashes);
          setShowSaveModal(false);
          setBranchName(branchName);
          navigate(`/editorpage/${fileId}/${newBranch.branchId}`, {
            replace: true,
          });
          return;
        }
      }

      await fetchLatest();
      setChunkHashes(newHashes);
      setShowSaveModal(false);
      setBranchName(branchName);
    } catch (err) {
      console.error("Failed to save version:", err);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, [fileId, branchId]);

  return (
    <>
      <style>
        {`
              .notion-editor {
          background: transparent;
        }

        .floating-toolbar .ql-toolbar.ql-snow {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: rgba(30, 30, 30, 0.95) !important;
          backdrop-filter: blur(12px);
          border-radius: 12px !important;
          padding: 8px 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          position: sticky !important;
          top: 80px;
          z-index: 30; /* Lower z-index so dropdowns appear above */
          margin: 0 0 24px 0 !important;
          width: fit-content;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Hide toolbar when save modal is open */
        .floating-toolbar.modal-open .ql-toolbar.ql-snow {
          display: none !important;
        }

        /* Rest of your styles remain the same */
        .floating-toolbar .ql-container.ql-snow {
          border: none !important;
          background: transparent;
          font-size: 16px;
          line-height: 1.7;
        }

        .floating-toolbar .ql-editor {
          color: white !important;
          padding: 0 !important;
          min-height: 500px;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          line-height: 1.7;
        }

        .floating-toolbar .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.4) !important;
          font-style: normal;
        }

        .floating-toolbar .ql-toolbar .ql-stroke {
          stroke: rgba(255, 255, 255, 0.7);
          transition: stroke 0.15s ease;
        }

        .floating-toolbar .ql-toolbar .ql-fill {
          fill: rgba(255, 255, 255, 0.7);
          transition: fill 0.15s ease;
        }

        .floating-toolbar .ql-toolbar button:hover .ql-stroke {
          stroke: white;
        }

        .floating-toolbar .ql-toolbar button:hover .ql-fill {
          fill: white;
        }

        .floating-toolbar .ql-toolbar button.ql-active .ql-stroke {
          stroke: #33A1E0;
        }

        .floating-toolbar .ql-toolbar button.ql-active .ql-fill {
          fill: #33A1E0;
        }

        .floating-toolbar .ql-toolbar button {
          border-radius: 6px !important;
          margin: 0 2px;
        }

        .floating-toolbar .ql-toolbar button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .floating-toolbar .ql-picker-options {
          background: rgba(30, 30, 30, 0.95) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .floating-toolbar .ql-picker-item:hover {
          background: rgba(51, 161, 224, 0.2) !important;
          color: #33A1E0 !important;
        }

        .floating-toolbar .ql-snow .ql-picker-label {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .floating-toolbar .ql-snow .ql-picker-item {
          color: white !important;
        }

        .floating-toolbar .ql-snow .ql-tooltip {
          background: rgba(30, 30, 30, 0.95) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
          color: white !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .separator-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 32px 0;
        }

        @media (max-width: 768px) {
          .floating-toolbar .ql-toolbar.ql-snow {
            position: static !important;
            transform: none !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 0 16px 0 !important;
          }
        }
        `}
      </style>

      <div className="min-h-screen bg-[#1e1e1e]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-12">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-400 mb-6">
              <span>Text Editor</span>
              <svg
                className="w-4 h-4 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-300">Document</span>
            </div>

            {/* Title and Meta */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={title ?? ""}
                    onChange={(e) => settitle(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    className="text-5xl font-bold text-white bg-transparent border-none focus:outline-none w-full placeholder-gray-500 leading-tight"
                    placeholder="Untitled"
                  />
                ) : (
                  <h1
                    onClick={handleTitleClick}
                    className="text-5xl font-bold text-white cursor-pointer hover:text-gray-200 transition-colors duration-200 py-2 rounded leading-tight break-words"
                  >
                    {title || "Untitled"}
                  </h1>
                )}
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Tags */}
                {tag && (
                  <span
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center px-3 py-1.5 bg-[#fef3c5] text-gray-800 text-sm font-medium rounded-full cursor-pointer hover:bg-opacity-90 transition-all duration-200"
                  >
                    <svg
                      className="w-3 h-3 mr-1.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {tag}
                  </span>
                )}

                {/* Branch Selector */}
                {branchName && (
                  <div className="relative">
                    <button
                      onClick={() => setBranchMenuOpen(!branchMenuOpen)}
                      className="inline-flex items-center px-3 py-1.5 bg-[#33A1E0] text-white text-sm font-medium rounded-full hover:bg-opacity-90 transition-all duration-200"
                    >
                      <svg
                        className="w-3 h-3 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a1 1 0 010-1.414L6.293 1.879a1 1 0 011.414 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {branchName}
                      <svg
                        className={`w-4 h-4 ml-1.5 transition-transform duration-200 ${
                          branchMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {branchMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setBranchMenuOpen(false)}
                        />
                        <div className="absolute left-0 mt-2 w-48 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden backdrop-filter backdrop-blur-sm">
                          <div className="py-1 max-h-48 overflow-y-auto">
                            {branchList.map((branch: Branch) => (
                              <button
                                key={branch.id}
                                onClick={() => handleSelectBranch(branch.id)}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#33A1E0] transition-colors duration-150"
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a1 1 0 010-1.414L6.293 1.879a1 1 0 011.414 1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="truncate">
                                    {branch.name}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-[#2cc27b] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2cc27b] focus:ring-opacity-30"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="separator-line"></div>

          {/* Editor Section */}

          <div
            className={`notion-editor floating-toolbar ${
              showSaveModal ? "modal-open" : ""
            }`}
          >
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              placeholder="Start writing..."
            />
          </div>

          {/* Bottom Separator */}
          <div className="separator-line"></div>

          {/* Footer Space */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm transition-opacity duration-200"
              onClick={() => setShowSaveModal(false)}
            />

            <div className="relative w-full max-w-md bg-[#2a2a2a] rounded-xl p-6 shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Save Changes
                </h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => saveVersion("commit")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#2cc27b] hover:bg-opacity-90 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2cc27b] focus:ring-opacity-30"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Commit to Current Branch
                </button>

                <div className="flex items-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                  <span className="px-3 text-xs text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter branch name..."
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#33A1E0] focus:outline-none transition-colors duration-200 focus:ring-2 focus:ring-[#33A1E0] focus:ring-opacity-30"
                  />
                  <button
                    onClick={() => saveVersion("branch")}
                    className="w-full flex items-center justify-center px-4 py-3 bg-[#33A1E0] hover:bg-opacity-90 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#33A1E0] focus:ring-opacity-30"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Create New Branch
                  </button>
                </div>

                <button
                  onClick={() => setShowSaveModal(false)}
                  className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {branchMenuOpen && !showSaveModal && (
        <div className="absolute left-0 mt-2 w-48 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden backdrop-filter backdrop-blur-sm">
          <div className="py-1 max-h-48 overflow-y-auto">
            {branchList.map((branch: Branch) => (
              <button
                key={branch.id}
                onClick={() => handleSelectBranch(branch.id)}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#33A1E0] transition-colors duration-150"
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a1 1 0 010-1.414L6.293 1.879a1 1 0 011.414 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">{branch.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Editor;
