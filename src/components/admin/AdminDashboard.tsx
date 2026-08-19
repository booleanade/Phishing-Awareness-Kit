import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  Award,
  Sliders,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle
} from 'lucide-react';
import { User, UserProgress, PhishingReport } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminDashboardProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onNavigate }) => {
  const [users, setUsers] = useState(StorageService.getUsers());
  const [reports, setReports] = useState(StorageService.getReports());
  const [passingScore, setPassingScore] = useState(StorageService.getPassingScore());
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'reports' | 'settings'>('overview');

  const analytics = StorageService.getAdminAnalytics();
  const staffUsers = users.filter(u => u.role === 'staff');

  // Filter staff based on Department and Search
  const filteredStaff = staffUsers.filter(u => {
    const matchesDept = selectedDeptFilter === 'all' || u.department === selectedDeptFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleUpdatePassingScore = (newScore: number) => {
    StorageService.setPassingScore(newScore);
    setPassingScore(newScore);
  };

  const handleUpdateReportStatus = (reportId: string, status: PhishingReport['status']) => {
    const updated = StorageService.updateReportStatus(reportId, status);
    setReports(updated);
  };

  const handleExportCSV = () => {
    const headers = 'Name,Email,Department,PreTestScore,PostTestScore,ImprovementDelta,QuizScore,RecognitionRate,Status\n';
    const rows = staffUsers.map(u => {
      const p = StorageService.getUserProgress(u.id);
      return `"${u.name}","${u.email}","${u.department}",${p.preTestPercentage ?? 'N/A'},${p.postTestPercentage ?? 'N/A'},${p.improvementDelta ?? 'N/A'},${p.quizPercentage ?? 'N/A'},${p.phishingRecognitionRate ?? 'N/A'}%,"${p.trainingCompleted ? 'Completed' : 'In Progress'}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Phishing_Awareness_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                Management & Training Oversight
              </span>
              <span className="text-xs text-slate-400">&bull; Admin View</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Phishing Awareness Management Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Monitor team completion progress, compare department scores, and review reported emails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>

        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion</p>
            <p className="text-2xl font-extrabold text-slate-900">{analytics.completionRate}%</p>
            <p className="text-xs text-slate-500">{analytics.completedTrainingCount} of {analytics.totalUsers} Staff</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Pre-Test</p>
            <p className="text-2xl font-extrabold text-slate-700">{analytics.averagePreTestScore}%</p>
            <p className="text-xs text-slate-500">Baseline Score</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Post-Test</p>
            <p className="text-2xl font-extrabold text-emerald-600">{analytics.averagePostTestScore}%</p>
            <p className="text-xs text-slate-500">Post-Training Mastery</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Knowledge Gain</p>
            <p className="text-2xl font-extrabold text-emerald-600 flex items-center space-x-1">
              <TrendingUp className="w-5 h-5" />
              <span>+{analytics.averageImprovementDelta}%</span>
            </p>
            <p className="text-xs text-slate-500">Average Improvement</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spot Accuracy</p>
            <p className="text-2xl font-extrabold text-blue-600">{analytics.simulationRecognitionRate}%</p>
            <p className="text-xs text-slate-500">Simulation Accuracy</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Emails</p>
            <p className="text-2xl font-extrabold text-rose-600">{reports.length}</p>
            <p className="text-xs text-slate-500">Incident Reports</p>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Department Breakdown
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'staff'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Staff Training Records ({staffUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Reported Incidents</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
              {reports.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Passing Threshold Settings
          </button>
        </div>

        {/* TAB 1: Overview & Department Breakdown */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Department Performance Cards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Department Performance & Growth</h3>
                <p className="text-xs text-slate-500">Compare initial baseline versus post-training scores across departments.</p>
              </div>

              <div className="space-y-3">
                {analytics.departmentStats.map(dept => (
                  <div key={dept.department} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 text-sm">{dept.department}</span>
                        <span className="text-xs text-slate-500">({dept.staffCount} Staff Enrolled)</span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-slate-600">Pre-Test: <strong className="text-slate-800">{dept.avgPreScore}%</strong></span>
                        <span className="text-slate-600">Post-Test: <strong className="text-emerald-700">{dept.avgPostScore}%</strong></span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +{dept.avgImprovementDelta}% Growth
                        </span>
                        <span className="text-blue-700 font-bold">
                          {dept.completionRate}% Done
                        </span>
                      </div>
                    </div>

                    {/* Comparative Dual Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Pre-Test vs Post-Test Growth</span>
                        <span>{dept.avgPreScore}% &rarr; {dept.avgPostScore}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          className="bg-slate-400 h-full"
                          style={{ width: `${dept.avgPreScore}%` }}
                          title={`Pre-test: ${dept.avgPreScore}%`}
                        />
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${Math.max(0, dept.avgPostScore - dept.avgPreScore)}%` }}
                          title={`Improvement Delta: +${dept.avgImprovementDelta}%`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Key Training Takeaways</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The initial baseline check identified common vulnerability areas in recognizing urgent password reset lures and spoofed domains. Following completion of the 5 lessons and email exercises, post-test scores average {analytics.averagePostTestScore}%, delivering an overall +{analytics.averageImprovementDelta}% awareness improvement across participating teams.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Reporting Protocol</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Employees have actively submitted {reports.length} suspicious email reports. Encouraging a positive, blameless reporting culture ensures that real attack attempts are caught and mitigated quickly.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Staff Progress Matrix */}
        {activeTab === 'staff' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="ICT">ICT</option>
                  <option value="Administration">Administration</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] bg-slate-50/50">
                    <th className="py-3 px-3">Staff Member</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3 text-center">Baseline</th>
                    <th className="py-3 px-3 text-center">Post-Test</th>
                    <th className="py-3 px-3 text-center">Improvement</th>
                    <th className="py-3 px-3 text-center">Quiz Score</th>
                    <th className="py-3 px-3 text-center">Practice Accuracy</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStaff.map(member => {
                    const p = StorageService.getUserProgress(member.id);
                    return (
                      <tr key={member.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{member.name}</div>
                          <div className="text-[11px] text-slate-500">{member.email}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-600">
                          {member.department}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600">
                          {p.preTestCompleted ? `${p.preTestPercentage}%` : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-3 px-3 text-center text-emerald-700 font-bold">
                          {p.postTestCompleted ? `${p.postTestPercentage}%` : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-3 px-3 text-center font-bold">
                          {p.improvementDelta !== undefined ? (
                            <span className="text-emerald-700">+{p.improvementDelta}%</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {p.quizCompleted ? (
                            <span className={p.quizPassed ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                              {p.quizPercentage}%
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-blue-700">
                          {p.phishingRecognitionRate}%
                        </td>
                        <td className="py-3 px-3 text-right">
                          {p.trainingCompleted ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Certified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <Clock className="w-3.5 h-3.5" />
                              <span>In Progress</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: Phishing Incident Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Reported Suspicious Emails</h3>
              <p className="text-xs text-slate-500">Submissions received via the employee "Report Suspicious Email" button.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] bg-slate-50/50">
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Sender Address</th>
                    <th className="py-3 px-3">Reported By</th>
                    <th className="py-3 px-3">Urgency</th>
                    <th className="py-3 px-3">Details</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-bold text-slate-900 max-w-xs truncate">
                        {rep.subject}
                      </td>
                      <td className="py-3 px-3 font-mono text-rose-700 max-w-xs truncate">
                        {rep.senderAddress}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900">{rep.userName}</span>
                        <span className="text-[11px] text-slate-500 block">{rep.department}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.urgencyLevel === 'Critical'
                            ? 'bg-rose-100 text-rose-700'
                            : rep.urgencyLevel === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rep.urgencyLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs truncate text-slate-600" title={rep.suspiciousDetails}>
                        {rep.suspiciousDetails}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          rep.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rep.status === 'Escalated'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : rep.status === 'Simulated Test'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={rep.status}
                          onChange={(e) => handleUpdateReportStatus(rep.id, e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Escalated">Escalated</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Simulated Test">Simulated Test</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: Passing Threshold Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quiz Passing Threshold Setting</h3>
              <p className="text-xs text-slate-500">Configure minimum passing score requirement for staff certificates.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Quiz Passing Score: <strong className="text-blue-600">{passingScore}%</strong>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={passingScore}
                  onChange={(e) => handleUpdatePassingScore(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50% (Easy)</span>
                  <span>70% (Standard)</span>
                  <span>100% (Strict)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900">Requirements for Employee Certificate:</h4>
                <p>&bull; Complete all 5 Awareness Lessons</p>
                <p>&bull; Complete baseline diagnostic and post-test</p>
                <p>&bull; Score at least {passingScore}% on the Knowledge Quiz</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
