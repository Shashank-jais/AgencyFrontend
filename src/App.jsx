import { Outlet } from 'react-router-dom';
import './App.css';
import SideNavbar from './components/SideNavbar';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Context from './context';
import toast, { Toaster } from 'react-hot-toast';


function App() {
  const [login, setLogin] = useState(true);

  const setLoginform = () => {
    setLogin((prev) => !prev);
  };

  useEffect(() => {
    setLoginform();
  }, []);

  return (
    <Context.Provider value={{ setLoginform }}>
      <Toaster position="top-right" />
      <main className='md:flex min-h-screen w-screen md:gap-0'>
        {!login ? (
          <Login />
        ) : (
          <>
            <div className='mainBody md:m-3 md:mr-0 md:w-100 md:rounded-4xl flex bg-[#242529]'>
              <SideNavbar />
            </div>
            <div className='mainBody md:m-3 md:ml-1 w-screen md:rounded-4xl flex p-5 pt-3 overflow-y-auto'>
              <Outlet />
            </div>
          </>
        )}
      </main>
    </Context.Provider>
  );
}

export default App;
