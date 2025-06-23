import { ToastContainer } from 'react-toastify'
import './App.css'
import JobList from '../features/Job/JobList'
import AppSidebar from './AppSidebar'
import { SidebarInset, SidebarProvider, useSidebar } from '../components/ui/sidebar'
import TopBar from './TopBar'
import { useCallback, useEffect, useState } from 'react'
import { ThemeProvider } from '../components/theme-provider'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '../Store/configureStore'
import HomePage from '../features/Home/HomePage'

// Separate component that uses the sidebar context
function AppContent() {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch();
  const[loading,setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      // Planing on getting current user here
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(()=>setLoading(false));
  }, [initApp]);

  if (loading) return <p>Loading....</p>
  return (
    <>
      <AppSidebar />
      <SidebarInset className={isMobile ? "min-h-screen" : ""}>
        <TopBar />
        {loading ? <p>Loading...</p>
        :location.pathname === '/' ? <HomePage />
        : <div className="container">
          <Outlet />
          </div>}
      </SidebarInset>
    </>
  )
}

function App() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  return (
    <ThemeProvider defaultTheme="light">
    <SidebarProvider>
      <AppContent />
      <ToastContainer />
    </SidebarProvider>
    </ThemeProvider>
  )
}

export default App