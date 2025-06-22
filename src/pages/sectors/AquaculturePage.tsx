import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { Fish, TrendingUp, MapPin, Leaf, Presentation, Monitor } from 'lucide-react'; // Import Presentation icon
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';
import { PresentationManager } from '../../components/presentation'; // Import PresentationManager
import { AquaponicsMonitoringDashboard } from '../../components/dashboard/AquaponicsMonitoringDashboard';

export const AquaculturePage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="aquaculture"
        sectorName="Piscicultura"
        onClose={() => setShowPresentation(false)}
      />
    );
  }

  if (showDashboard) {
    return <AquaponicsMonitoringDashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center">
              <Fish className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">Piscicultura</h1>
            </div>
            {/* Button to activate the presentation */}
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
            </button>
            <button
              onClick={() => setShowDashboard(true)}
              className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Monitor className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
          </div>

        </div>
      </div>

      {/* Content Section: Piscicultura, Aquaponia e Benefícios */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">O que é Água sense </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Transformamos sistemas de aquaponia em operações inteligentes, sustentáveis e totalmente monitoráveis. Nossa startup desenvolve soluções tecnológicas que integram o controle da qualidade da água, a saúde dos peixes, o crescimento das plantas e o desempenho do sistema em um único painel digital. Com uma plataforma acessível e visual, oferecemos a produtores, empreendedores e educadores uma forma simples e eficiente de gerenciar sua produção, tomar decisões com base em dados e maximizar resultados com sustentabilidade.
          </p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">O que é Piscicultura?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            A piscicultura é o ramo da aquicultura que se dedica especificamente à criação de peixes em ambientes controlados, como tanques, viveiros ou açudes. O objetivo principal é a produção de peixes para consumo humano, repovoamento de rios ou para fins ornamentais. É uma atividade que busca otimizar o crescimento e a saúde dos peixes, controlando fatores como a qualidade da água, alimentação e densidade populacional.
          </p>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Relação com a Aquaponia</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            A aquaponia é um sistema integrado que combina a aquicultura (criação de animais aquáticos, como peixes – ou seja, piscicultura) com a hidroponia (cultivo de plantas sem solo). Nesse sistema, a água rica em nutrientes proveniente dos dejetos dos peixes é utilizada para nutrir as plantas, que por sua vez filtram a água, tornando-a limpa para os peixes. A Aquasense oferece soluções tecnológicas para monitorar e gerenciar esses sistemas de aquaponia.
          </p>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Benefícios da Aplicação de Tecnologia em Sistemas de Aquaponia</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            A aplicação de tecnologia em sistemas de aquaponia (que incluem a piscicultura) oferece os seguintes benefícios:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Redução de perdas e falhas operacionais</h4>
              <p className="text-gray-700 dark:text-gray-300">O monitoramento inteligente ajuda a identificar e corrigir problemas rapidamente, minimizando perdas.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Aumento de produtividade</h4>
              <p className="text-gray-700 dark:text-gray-300">A otimização do ambiente e das condições de cultivo leva a um melhor desempenho tanto dos peixes quanto das plantas.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Maior segurança na produção</h4>
              <p className="text-gray-700 dark:text-gray-300">O controle preciso dos parâmetros garante um ambiente mais estável e seguro para os organismos aquáticos e vegetais.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Decisões baseadas em dados</h4>
              <p className="text-gray-700 dark:text-gray-300">A coleta e análise de dados em tempo real permitem que os produtores tomem decisões mais informadas e eficientes.</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500 md:col-span-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Sustentabilidade e eficiência no manejo</h4>
              <p className="text-gray-700 dark:text-gray-300">A tecnologia contribui para um uso mais consciente dos recursos, promovendo práticas mais sustentáveis e eficientes na gestão do sistema.</p>
            </div>
          </div>
        </div>
        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-700 text-white text-center rounded-xl shadow-xl mb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-bold mb-8">Pronto para Transformar Sua Produção?</h2>
            <p className="text-xl mb-10 leading-relaxed">Estamos ansiosos para ter você conosco! Entre em contato e descubra como nossa tecnologia pode revolucionar seu sistema de aquaponia.</p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
              <a
                href="https://wa.me/5565984325069"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Fale Conosco no WhatsApp
              </a>
              <a
                href="mailto:AquaSense.OFC@gmail.com"
                className="inline-flex items-center bg-red-500 text-white px-8 py-4 rounded-full hover:bg-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.455-6.269h.909c.904 0 1.636.732 1.636 1.636z" />
                </svg>
                Envie um E-mail
              </a>
            </div>
            <div className="mt-8">
              <p className="text-lg mb-4">Siga-nos nas redes sociais: <span className="font-semibold">AquaSense</span></p>
              <div className="flex justify-center space-x-6">
                <div className="bg-white dark:bg-gray-800 bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="bg-white dark:bg-gray-800 bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </div>
                <div className="bg-white dark:bg-gray-800 bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="text-center">
          <button className="inline-flex items-center bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg hover:shadow-xl">
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
};
