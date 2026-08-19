import React, { useState } from 'react';
import {
  Database,
  FileCode,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Shield,
  FileText,
  Lock
} from 'lucide-react';
import { User } from '../../types';
import { DEPLOYMENT_FILES } from '../../data/deploymentPackage';

interface DeploymentPackageViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const DeploymentPackageView: React.FC<DeploymentPackageViewProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeFileKey, setActiveFileKey] = useState<string>('schema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fileKeys = [
    { key: 'schema', label: 'database.sql (MySQL Schema)', icon: Database },
    { key: 'db_config', label: 'config/database.php (PDO)', icon: FileCode },
    { key: 'htaccess', label: '.htaccess (Apache Hardening)', icon: Lock },
    { key: 'readme', label: 'DEPLOYMENT.md (Installation Guide)', icon: FileText },
  ];

  const activeFile = DEPLOYMENT_FILES[activeFileKey as keyof typeof DEPLOYMENT_FILES];

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadAll = () => {
    // Generate a downloadable text file containing all production setup scripts
    let combined = `=================================================================\n`;
    combined += `PHISHING AWARENESS KIT - PRODUCTION DEPLOYMENT PACKAGE\n`;
    combined += `Target Stack: PHP 8.2+, MySQL / MariaDB, Apache Web Server\n`;
    combined += `=================================================================\n\n`;

    Object.entries(DEPLOYMENT_FILES).forEach(([_, file]) => {
      combined += `\n/* -------------------------------------------------------------\n`;
      combined += ` * FILE: ${file.filename}\n`;
      combined += ` * ------------------------------------------------------------- */\n\n`;
      combined += file.content;
      combined += `\n\n`;
    });

    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishing_awareness_kit_production_deployment.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Self-Hosted Production Package
              </span>
              <span className="text-xs text-slate-500">PHP 8.2+ &bull; MySQL / MariaDB &bull; Apache</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Production Deployment Package & Database Schema
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
              Clean, fully commented SQL DDL schema and PHP PDO database configuration ready for deployment onto standard cPanel, Apache, XAMPP, or LAMP servers without Node.js dependencies.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate(currentUser?.role === 'admin' ? 'admin_dashboard' : 'staff_dashboard')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition flex items-center space-x-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Deployment Package</span>
            </button>
          </div>
        </div>

        {/* File Tabs & Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* File Tab Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
              Production Files & Guides
            </h3>

            {fileKeys.map(item => {
              const Icon = item.icon;
              const isSelected = item.key === activeFileKey;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveFileKey(item.key)}
                  className={`w-full p-3.5 rounded-xl text-left border transition flex items-center space-x-3 text-xs font-semibold ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {/* Architecture Card */}
            <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600 shadow-xs">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Security Architecture</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                The standard PHP 8.2+ backend uses PDO prepared statements with secure bcrypt password hashing. Safe for enterprise production hosting.
              </p>
            </div>
          </div>

          {/* Active File Content Viewer */}
          <div className="lg:col-span-8 space-y-3">
            
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              
              {/* File Header Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-mono font-bold text-slate-800">{activeFile.filename}</span>
                </div>

                <button
                  onClick={() => handleCopy(activeFileKey, activeFile.content)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center space-x-1.5 shadow-xs"
                >
                  {copiedKey === activeFileKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre Box */}
              <div className="p-5 max-h-[600px] overflow-y-auto bg-slate-900 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre selection:bg-blue-600 selection:text-white">
                {activeFile.content}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
