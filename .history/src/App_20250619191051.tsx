import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './components/dashboard/Dashboard';
import { Analytics } from './components/layout/Analytics';
import { WeatherModule } from './components/weather/WeatherModule';
import { ThreeDModelView } from './components/3d/ThreeDModelView';
import { SugarcanePage, CottonPage, CocoaPage, MeatPage, TomatoPage, AquaculturePage, BananaPage, SoyPage, SheepPage } from './pages/sectors';

// Mapeamento das páginas específicas dos setores
const sectorPages = {
  'sugarcane': SugarcanePage,
  'cotton': CottonPage,
  'cocoa': CocoaPage,
  'meat': MeatPage,
  'tomato': TomatoPage,
  'aquaculture': AquaculturePage,
  'banana': BananaPage,
  'soy': SoyPage,
  'sheep': SheepPage,
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-72">
            <Header />
            <main className="flex-1 overflow-auto pt-20 p-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/weather" element={<WeatherModule />} />
                <Route path="/3d-model" element={<ThreeDModelView />} />
                {Object.entries(sectorPages).map(([sectorId, Component]) => (
                  <Route 
                    key={sectorId} 
                    path={`/sectors/${sectorId}`} 
                    element={<Component />} 
                  />
                ))}
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

