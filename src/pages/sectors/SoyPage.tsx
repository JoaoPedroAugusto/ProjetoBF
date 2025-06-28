import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, MapPin, Presentation, Droplets, Sun, Thermometer, ShieldCheck, Cpu, Globe, CheckCircle } from 'lucide-react';
import { PresentationManager } from '../../components/presentation';
import Dashboard from '../../components/dashboard_Manejo/src/components/Dashboard';

export const SoyPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [production, setProduction] = useState(340);
  const [growthRate, setGrowthRate] = useState(3.9);

  useEffect(() => {
    const interval = setInterval(() => {
      setProduction(prev => Math.min(350, prev + Math.random() * 0.3));
      setGrowthRate(Math.random() * 0.2 + 3.9);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayAudio = () => {
    const audio = new Audio('/audio/soja-intro.mp3');
    audio.play();
  };

  if (showPresentation) {
    return (
      <PresentationManager sectorId="soy" sectorName="Soja" onClose={() => setShowPresentation(false)} />
    );
  }

  if (showDashboard) {
    return <Dashboard onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 text-gray-900 dark:text-gray-200">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-green-700 to-lime-600 text-white py-24 px-6 md:px-20 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <Leaf className="w-28 h-28 text-white" />
          <div className="flex-1">
            <h1 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Soja Inteligente com Manejo Digital
            </h1>
            <p className="text-xl max-w-3xl mb-8 drop-shadow-md">
              Transforme sua produção com tecnologia de ponta, sustentabilidade e máxima eficiência. A Manejo Digital conecta produtores e compradores, garantindo soja de alta qualidade, rastreável e com impacto ambiental positivo.
            </p>
            <div className="flex flex-wrap gap-5">
              <button
                onClick={handlePlayAudio}
                className="bg-lime-500 hover:bg-lime-600 transition rounded-lg px-6 py-4 font-semibold flex items-center gap-3 shadow-md text-lg"
              >
                ▶️ Ouvir Narração
              </button>
              <button
                onClick={() => setShowPresentation(true)}
                className="bg-white text-green-900 hover:bg-gray-200 rounded-lg px-6 py-4 font-semibold flex items-center gap-3 shadow-md text-lg"
              >
                <Presentation className="w-6 h-6" />
                Apresentação Completa
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="bg-white text-green-900 hover:bg-gray-200 rounded-lg px-6 py-4 font-semibold flex items-center gap-3 shadow-md text-lg"
              >
                📊 Dashboard Inteligente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas dinâmicas */}
      <section className="container mx-auto mt-20 px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-8 border-green-700 flex flex-col items-center">
          <TrendingUp className="w-12 h-12 text-green-700 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Produção Global</h3>
          <p className="text-5xl font-extrabold text-green-700 mb-1">{production.toFixed(1)}M t/ano</p>
          <p className="text-gray-600 dark:text-gray-400">de toneladas por ano</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-8 border-lime-600 flex flex-col items-center">
          <MapPin className="w-12 h-12 text-lime-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Principais Regiões</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg">
            <li>Estados Unidos</li>
            <li>Brasil</li>
            <li>Argentina</li>
            <li>China</li>
            <li>Índia</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-8 border-emerald-600 flex flex-col items-center">
          <Leaf className="w-12 h-12 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Crescimento Anual</h3>
          <p className="text-5xl font-extrabold text-emerald-700">{growthRate.toFixed(1)}%</p>
          <p className="text-gray-600 dark:text-gray-400">taxa média anual</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-8 border-cyan-600 flex flex-col items-center">
          <Cpu className="w-12 h-12 text-cyan-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Tecnologia Aplicada</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xs">
            Sensores IoT, Big Data, Inteligência Artificial e Monitoramento em tempo real para máxima produtividade.
          </p>
        </div>
      </section>

      {/* Conteúdo comercial e informativo */}
      <section className="container mx-auto mt-20 px-6 md:px-20 space-y-20">
        {/* Vantagens Manejo Digital */}
        <article className="bg-green-50 dark:bg-green-900 rounded-xl p-10 shadow-lg border border-green-400">
          <h2 className="text-4xl font-extrabold mb-8 text-green-700 dark:text-green-300">Por que escolher a Manejo Digital?</h2>
          <ul className="list-disc list-inside text-lg max-w-4xl mx-auto space-y-4 text-gray-900 dark:text-gray-100">
            <li><CheckCircle className="inline w-6 h-6 text-green-600 mr-2 align-middle" />Rastreabilidade total: acompanhe sua soja desde o plantio até a entrega, garantindo transparência e qualidade.</li>
            <li><CheckCircle className="inline w-6 h-6 text-green-600 mr-2 align-middle" />Redução de custos e desperdícios com irrigação e fertilização otimizadas via dados em tempo real.</li>
            <li><CheckCircle className="inline w-6 h-6 text-green-600 mr-2 align-middle" />Análises preditivas que antecipam riscos climáticos e maximiza a produtividade.</li>
            <li><CheckCircle className="inline w-6 h-6 text-green-600 mr-2 align-middle" />Cumprimento rigoroso das normas ambientais e certificações para acesso a mercados exigentes.</li>
            <li><CheckCircle className="inline w-6 h-6 text-green-600 mr-2 align-middle" />Atendimento personalizado e suporte tecnológico exclusivo para parceiros e compradores.</li>
          </ul>
        </article>

        {/* Estresse Hídrico e Sustentabilidade */}
        <article className="bg-red-50 dark:bg-red-900 rounded-xl p-10 shadow-lg border border-red-400 max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6 text-red-700 dark:text-red-300 flex items-center gap-3">
            <Droplets className="w-10 h-10" />
            Combate ao Estresse Hídrico com Tecnologia
          </h2>
          <p className="text-lg mb-6 text-red-800 dark:text-red-200 leading-relaxed">
            A Manejo Digital utiliza sensores IoT para monitorar a umidade do solo em tempo real, ajustando automaticamente os sistemas de irrigação para garantir máxima eficiência hídrica e reduzir perdas por seca.
          </p>
          <p className="text-lg text-red-800 dark:text-red-200 leading-relaxed">
            Esse controle preciso promove a sustentabilidade, melhora a qualidade da soja e otimiza o uso dos recursos naturais, garantindo um produto final de alto valor para o mercado.
          </p>
        </article>

        {/* Inovação e Monitoramento */}
        <article className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-3 text-cyan-700 dark:text-cyan-400">
            <Cpu className="w-10 h-10" />
            Inovação e Monitoramento 24/7
          </h2>
          <p className="text-lg mb-4">
            Nossa plataforma integrada conecta drones, satélites e sensores no campo para oferecer dados completos e atualizados sobre saúde da lavoura, detecção precoce de pragas e doenças, e eficiência do uso de insumos.
          </p>
          <p className="text-lg">
            Assim, compradores podem confiar na qualidade da soja, enquanto produtores recebem recomendações precisas para melhorar resultados e reduzir impactos ambientais.
          </p>
        </article>

        {/* Segurança, Compliance e Certificações */}
        <article className="bg-green-50 dark:bg-green-900 rounded-xl p-10 shadow-lg border border-green-400 max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-3 text-green-700 dark:text-green-300">
            <ShieldCheck className="w-10 h-10" />
            Segurança, Compliance e Certificações
          </h2>
          <p className="text-lg mb-4">
            A Manejo Digital mantém todos os processos em conformidade com normas ambientais e agrícolas nacionais e internacionais, facilitando a obtenção de certificações exigidas pelo mercado global.
          </p>
          <p className="text-lg">
            Garantimos a integridade e qualidade do produto final, alinhados à responsabilidade socioambiental, valorizando sua compra e promovendo relações comerciais sustentáveis.
          </p>
        </article>

        {/* Visão de futuro e parceria */}
        <article className="text-center max-w-3xl mx-auto">
          <Globe className="w-14 h-14 mx-auto mb-4 text-lime-600" />
          <h2 className="text-4xl font-extrabold mb-6">
            Junte-se à Revolução do Agronegócio Digital
          </h2>
          <p className="text-lg mb-8">
            Na Manejo Digital, estamos moldando o futuro da agricultura, com inovação, sustentabilidade e resultados reais. Seja parceiro ou comprador e garanta acesso à soja do amanhã, hoje.
          </p>
          <Link
            to="/contato"
            className="inline-block bg-lime-600 hover:bg-lime-700 transition px-10 py-5 rounded-full font-bold text-white text-xl shadow-lg"
          >
            Fale Conosco
          </Link>
        </article>
      </section>

      {/* Botão voltar */}
      <div className="container mx-auto px-6 md:px-20 py-16 text-center">
        <Link
          to="/"
          className="inline-block bg-green-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-green-800 transition shadow-lg"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};
