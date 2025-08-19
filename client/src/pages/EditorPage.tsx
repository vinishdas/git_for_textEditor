import { useParams } from "react-router-dom";
import Editor from '../components/Editor';

const EditorPage = () => {
  const { fileId, branchId } = useParams<{ fileId?: string; branchId?: string }>();
  
  if (!fileId || !branchId) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.667-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Invalid Route</h1>
          <p className="text-gray-400 text-sm">Missing file or branch identifier.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Navigation Space - Reserved for future nav component */}
      <div className="h-16 bg-[#1e1e1e] border-b border-gray-800/50">
        {/* Navigation will be added here later */}
      </div>

      {/* Main Content */}
      <div className="bg-[#1e1e1e]">
        <Editor fileId={fileId} branchId={branchId} />
      </div>
    </div>
  );
};

export default EditorPage;
