
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ApplicantForm from './components/ApplicantForm';
import ExcelImport from './components/ExcelImport';
import AboutOffice from './components/AboutOffice';
import Login from './components/Login';
import { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(() => {
    const saved = sessionStorage.getItem('panabo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('panabo_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('panabo_user');
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'add':
        return <ApplicantForm userId={currentUser.id} onSuccess={() => setActiveTab('dashboard')} />;
      case 'import':
        return <ExcelImport userId={currentUser.id} onSuccess={() => setActiveTab('dashboard')} />;
      case 'about':
        return <AboutOffice />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      username={currentUser.username}
    >
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
