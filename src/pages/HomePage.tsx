import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Leaf, Users, Globe, Shield, Zap, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { DataService } from '../data/database';

export const HomePage = () => {
  const stats = DataService.getOverallStats();

  const features = [
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Análise detalhada de performance com insights automáticos e recomendações baseadas em dados.',
      color: 'blue'
    },
    {
      icon: Leaf,
      title: 'Sustentabilidade',
      description: 'Monitoramento de práticas sustentáveis e score ambiental para cada setor produtivo.',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Gestão de Equipes',
      description: 'Controle completo de recursos humanos e produtividade por setor e região.',
      color: 'purple'
    },
    {
      icon: Globe,
      title: 'Visão Global',
      description: 'Dashboard unificado com visão completa de todos os setores e operações.',
      color: 'indigo'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Plataforma segura com controle de acesso e proteção de dados empresariais.',
      color: 'red'
    },
    {
      icon: Zap,
      title: 'Tempo Real',
      description: 'Monitoramento em tempo real com alertas automáticos e notificações inteligentes.',
      color: 'yellow'
    }
  ];

  const benefits = [
    'Aumento de 25% na eficiência operacional',
    'Redução de 30% nos custos de produção',
    'Melhoria de 40% na sustentabilidade',
    'Otimização de 35% no uso de recursos',
    'Aumento de 20% na produtividade',
    'Redução de 50% no tempo de análise'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Plataforma Inteligente para o
                <span className="text-green-200"> Agronegócio</span>
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Transforme sua operação agrícola com tecnologia de ponta. 
                Monitore, analise e otimize todos os seus setores produtivos 
                em uma única plataforma integrada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center group"
                >
                  Acessar Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/analytics"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors flex items-center justify-center"
                >
                  Ver Analytics
                </Link>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Visão Geral da Plataforma</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200">{stats.sectorsCount}</div>
                  <div className="text-sm text-green-100">Setores Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200">{stats.totalWorkers}</div>
                  <div className="text-sm text-green-100">Colaboradores</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200">{(stats.totalArea / 1000).toFixed(1)}k</div>
                  <div className="text-sm text-green-100">Hectares</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200">{stats.avgEfficiency}%</div>
                  <div className="text-sm text-green-100">Eficiência Média</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Avançados para Sua Operação
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma oferece ferramentas completas para monitoramento, 
              análise e otimização de todos os aspectos do seu agronegócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow group">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Resultados Comprovados
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Empresas que utilizam nossa plataforma obtêm resultados 
                excepcionais em produtividade, sustentabilidade e rentabilidade.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <div className="text-3xl font-bold text-green-900 mb-2">R$ {(stats.totalRevenue / 1000000).toFixed(0)}M</div>
                <div className="text-green-700 font-medium">Receita Total Anual</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
                <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
                <div className="text-3xl font-bold text-blue-900 mb-2">{(stats.totalProduction / 1000).toFixed(0)}k</div>
                <div className="text-blue-700 font-medium">Toneladas Produzidas</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200">
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <div className="text-3xl font-bold text-purple-900 mb-2">{stats.avgSustainability}</div>
                <div className="text-purple-700 font-medium">Score Sustentabilidade</div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl border border-amber-200">
                <Leaf className="h-12 w-12 text-amber-600 mb-4" />
                <div className="text-3xl font-bold text-amber-900 mb-2">{(stats.totalArea / 1000).toFixed(1)}k</div>
                <div className="text-amber-700 font-medium">Hectares Monitorados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Transformar Seu Agronegócio?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Junte-se a centenas de empresas que já utilizam nossa plataforma 
            para otimizar suas operações e maximizar resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center group"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/analytics"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors flex items-center justify-center"
            >
              Ver Demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-xl font-bold">AgriTech Pro</span>
              </div>
              <p className="text-gray-400">
                Plataforma inteligente para gestão e otimização do agronegócio.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link to="/weather" className="hover:text-white transition-colors">Meteorologia</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Setores</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/sectors/cana-de-acucar" className="hover:text-white transition-colors">Cana-de-Açúcar</Link></li>
                <li><Link to="/sectors/soja" className="hover:text-white transition-colors">Soja</Link></li>
                <li><Link to="/sectors/algodao" className="hover:text-white transition-colors">Algodão</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgriTech Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

