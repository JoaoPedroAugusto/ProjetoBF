import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, MapPin, Presentation, Droplets, Sun, Thermometer, ShieldCheck, Cpu, Globe, CheckCircle, Cloud, Activity, Wifi, BarChart3, Zap, AlertTriangle, CloudRain, Wind, Gauge } from 'lucide-react';
import { PresentationManager } from '../../components/presentation'; // Import PresentationManager

export const SoyPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [production, setProduction] = useState(340);
  const [growthRate, setGrowthRate] = useState(3.9);
  const [soilMoisture, setSoilMoisture] = useState(78);
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(65);
  const [rainfall, setRainfall] = useState(12);

  /*useEffect(() => {
    const interval = setInterval(() => {
      setProduction(prev => Math.min(350, prev + Math.random() * 0.3));
      setGrowthRate(Math.random() * 0.2 + 3.9);
      setSoilMoisture(Math.random() * 10 + 75);
      setTemperature(Math.random() * 4 + 22);
      setHumidity(Math.random() * 15 + 60);
      setRainfall(Math.random() * 8 + 8);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
*/
  const handlePlayAudio = () => {
    const audio = new Audio('/audio/soja-intro.mp3');
    audio.play();
  };

  const handleShowPresentation = () => {
    setShowPresentation(true);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="Soy" // Use the appropriate sectorId for Meat
        sectorName="Soja"
        onClose={() => setShowPresentation(false)}
      />
    );
  }

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Dashboard Inteligente</h2>
          <p className="mb-4">O dashboard completo será carregado aqui.</p>
          <button
            onClick={() => setShowDashboard(false)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Fechar
          </button>
        </div>
      </div>
    );
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
                onClick={handleShowPresentation}
                className="bg-white text-green-900 hover:bg-gray-200 rounded-lg px-6 py-4 font-semibold flex items-center gap-3 shadow-md text-lg"
              >
                <Presentation className="w-6 h-6" />
                Apresentação Completa
              </button>
              <button
                onClick={handleShowDashboard}
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

      {/* Monitoramento Meteorológico em Tempo Real */}
      <section className="container mx-auto mt-20 px-6 md:px-20">
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-2xl p-10 shadow-xl border border-blue-300">
          <h2 className="text-4xl font-extrabold mb-8 text-blue-800 dark:text-blue-200 text-center flex items-center justify-center gap-4">
            <Cloud className="w-12 h-12" />
            Monitoramento Meteorológico Avançado
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <Thermometer className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Temperatura</h3>
              <p className="text-3xl font-extrabold text-red-600">{temperature.toFixed(1)}°C</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Atual</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <Droplets className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Umidade do Ar</h3>
              <p className="text-3xl font-extrabold text-blue-600">{humidity.toFixed(0)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Relativa</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <CloudRain className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Precipitação</h3>
              <p className="text-3xl font-extrabold text-indigo-600">{rainfall.toFixed(1)}mm</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Últimas 24h</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
              <Wind className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Umidade Solo</h3>
              <p className="text-3xl font-extrabold text-green-600">{soilMoisture.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média da lavoura</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-blue-800 dark:text-blue-200 mb-4">
              Nossa estação meteorológica coleta dados a cada 5 minutos, fornecendo previsões precisas e alertas automáticos para otimizar o manejo da cultura.
            </p>
            <div className="flex justify-center items-center gap-2 text-green-600 font-semibold">
              <Wifi className="w-5 h-5" />
              <span>Status: Conectado | Última atualização: há 2 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sistema de Sensores Inteligentes */}
      <section className="container mx-auto mt-20 px-6 md:px-20">
        <div className="bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-2xl p-10 shadow-xl border border-amber-300">
          <h2 className="text-4xl font-extrabold mb-8 text-amber-800 dark:text-amber-200 text-center flex items-center justify-center gap-4">
            <Activity className="w-12 h-12" />
            Rede de Sensores de Solo Inteligentes
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Coluna esquerda - Especificações técnicas */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Gauge className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold">Sensores Multiparâmetros</h3>
                </div>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Umidade do solo (0-100cm de profundidade)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    pH e condutividade elétrica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Temperatura do solo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Níveis de NPK (Nitrogênio, Fósforo, Potássio)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Matéria orgânica e compactação
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-yellow-600" />
                  <h3 className="text-2xl font-bold">Tecnologia Avançada</h3>
                </div>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Transmissão via LoRaWAN e 4G
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Bateria solar de longa duração
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Resistente a intempéries (IP68)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Calibração automática
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Coluna direita - Benefícios e alertas */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-bold">Benefícios Comprovados</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                    <span className="font-semibold">Economia de Água</span>
                    <span className="text-2xl font-bold text-green-600">35%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <span className="font-semibold">Aumento de Produtividade</span>
                    <span className="text-2xl font-bold text-blue-600">22%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <span className="font-semibold">Redução de Fertilizantes</span>
                    <span className="text-2xl font-bold text-purple-600">28%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
                    <span className="font-semibold">ROI em</span>
                    <span className="text-2xl font-bold text-orange-600">1.5 anos</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <h3 className="text-2xl font-bold">Alertas Inteligentes</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Umidade baixa detectada - Setor A3</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Condições ideais - Setor B1</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Previsão de chuva - 6h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        {/* Estresse Hídrico e Sustentabilidade - Seção Expandida */}
        <article className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 rounded-xl p-10 shadow-lg border border-red-400">
          <h2 className="text-4xl font-extrabold mb-6 text-red-700 dark:text-red-300 flex items-center gap-3">
            <Droplets className="w-10 h-10" />
            Combate Inteligente ao Estresse Hídrico
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-300">O Desafio</h3>
              <p className="text-lg mb-4 text-red-800 dark:text-red-200 leading-relaxed">
                O estresse hídrico é responsável por perdas de até 40% na produtividade da soja. Períodos de seca prolongada, irrigação inadequada e mudanças climáticas intensificam esse problema, afetando diretamente a rentabilidade dos produtores.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">Principais Impactos:</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Redução no enchimento de grãos</li>
                  <li>• Diminuição da qualidade proteica</li>
                  <li>• Aumento da suscetibilidade a pragas</li>
                  <li>• Perda de vigor da planta</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-300">Nossa Solução</h3>
              <p className="text-lg mb-4 text-green-800 dark:text-green-200 leading-relaxed">
                Utilizamos uma rede integrada de sensores de solo, estação meteorológica e inteligência artificial para monitorar e prever o estresse hídrico com precisão milimétrica, acionando sistemas de irrigação automaticamente.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">Tecnologias Aplicadas:</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Sensores de umidade em múltiplas profundidades</li>
                  <li>• Previsão meteorológica com IA</li>
                  <li>• Irrigação de precisão automatizada</li>
                  <li>• Monitoramento de estresse foliar por drone</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold mb-4 text-center">Resultados Comprovados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Redução no estresse hídrico</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">45%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Economia de água</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">32%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Aumento na produtividade</div>
              </div>
            </div>
          </div>
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
            Na Manejo Digital, estamos moldando o futuro da agricultura, com inovação, sustentabilidade e resultados reais. Seja parceiro ou comprador e garante acesso à soja do amanhã, hoje.
          </p>
          <button className="inline-block bg-lime-600 hover:bg-lime-700 transition px-10 py-5 rounded-full font-bold text-white text-xl shadow-lg">
            Fale Conosco
          </button>
        </article>
      </section>

      {/* Botão voltar */}
      <div className="container mx-auto px-6 md:px-20 py-16 text-center">
        <button className="inline-block bg-green-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-green-800 transition shadow-lg">
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default SoyPage;