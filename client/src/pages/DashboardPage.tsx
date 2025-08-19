import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DisplayFiles from "../components/DisplayFiles";

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigator = useNavigate();

  const handalLogout = () => {
    try {
      logout();
      navigator("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <style>
        {`
        .dashboard-nav {
          background: rgba(30, 30, 30, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .logout-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }

        .content-container {
          background: rgba(30, 30, 30, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .brand-text {
          background: linear-gradient(135deg, #33A1E0, #2cc27b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .separator-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 24px 0;
        }
        `}
      </style>

      <div className="min-h-screen bg-[#1e1e1e]">
        {/* Navigation */}
        <nav className="dashboard-nav sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#33A1E0] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="brand-text text-2xl font-bold">
                  Tailblocks
                </span>
              </div>

              {/* Navigation Items */}
              <div className="flex items-center space-x-4">
                {/* Stats */}
                <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
                  <span>Text Editor</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handalLogout}
                  className="logout-btn inline-flex items-center px-4 py-2 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Your Documents
              </h1>
              <p className="text-gray-400 text-lg">
                Manage and create your text documents
              </p>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-400 mb-6">
              <span>Dashboard</span>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-300">Files</span>
            </div>
          </div>

          {/* Separator Line */}
          <div className="separator-line"></div>

          {/* Content Container */}
          <div className="content-container rounded-xl shadow-xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Recent Files
              </h2>
              <p className="text-gray-400 text-sm">
                Access your recently edited documents
              </p>
            </div>

            {/* Files Grid */}
            <div className="w-full">
              <DisplayFiles />
            </div>
          </div>

          {/* Bottom Separator */}
          <div className="separator-line"></div>

          {/* Footer Space */}
          <div className="h-8"></div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
