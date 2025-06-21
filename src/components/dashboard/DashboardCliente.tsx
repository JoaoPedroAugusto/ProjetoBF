import React, { useState } from 'react';
import { 
  QrCode, 
  MapPin, 
  Calendar, 
  Award, 
  Leaf, 
  Shield, 
  CheckCircle,
  Info,
  Truck,
  Factory,
  Users,
  TrendingUp,
  Thermometer,
  Droplets,
  Star,
  Clock,
  Package,
  Heart,
  Globe
} from 'lucide-react';

interface DashboardClienteProps {
  onBack: () => void;
}

export const DashboardCliente: React.FC<DashboardClienteProps> = ({ onBack }) => {
  const [produtoSelecionado, setProdutoSelecionado] = useState('PROD-2024-001');

  // Dados do produto para o consumidor
  const dadosProduto = {
    'PROD-2024-001': {
      nome: 'Açúcar Cristal Orgânico PISCA',
      lote: 'LOTE-2024-001',
      dataProducao: '2024-06-15',
      dataValidade: '2025-06-15',
      origem: {
        fazenda: 'Fazenda São José',
        cidade: 'Ribeirão Preto',
        estado: 'São Paulo',
        produtor: 'João Silva',
        coordenadas: '-21.1775, -47.8208'
      },
      processamento: {
        usina: 'Usina São João',
        dataProcessamento: '2024-06-16',
        metodo: 'Cristalização Orgânica',
        temperatura: '65°C'
      },
      qualidade: {
        nota: 'A+',
        pureza: 99.8,
        cor: 'Branco Cristal',
        granulometria: 'Fina',
        umidade: 0.05
      },
      certificacoes: [
        { nome: 'Orgânico', validade: '2025-06-15', orgao: 'IBD' },
        { nome: 'Bonsucro', validade: '2024-12-15', orgao: 'Bonsucro Ltd' },
        { nome: 'ISCC', validade: '2024-12-15', orgao: 'ISCC System' },
        { nome: 'Fair Trade', validade: '2025-03-15', orgao: 'Fairtrade International' }
      ],
      sustentabilidade: {
        economiaAgua: 30,
        reducaoEmissoes: 25,
        energiaRenovavel: 85,
        impactoSocial: 'Alto',
        biodiversidade: 'Preservada'
      },
      seguranca: {
        status: 'Aprovado',
        analises: [
          { tipo: 'Microbiológica', resultado: 'Conforme', data: '2024-06-16' },
          { tipo: 'Química', resultado: 'Conforme', data: '2024-06-16' },
          { tipo: 'Física', resultado: 'Conforme', data: '2024-06-16' }
        ],
        temperatura_transporte: '25°C',
        umidade_transporte: '60%'
      }
    },
    'PROD-2024-002': {
      nome: 'Açúcar Demerara PISCA',
      lote: 'LOTE-2024-002',
      dataProducao: '2024-06-14',
      dataValidade: '2025-06-14',
      origem: {
        fazenda: 'Fazenda Santa Maria',
        cidade: 'Sertãozinho',
        estado: 'São Paulo',
        produtor: 'Maria Oliveira',
        coordenadas: '-21.1389, -48.0833'
      },
      processamento: {
        usina: 'Usina Verde',
        dataProcessamento: '2024-06-15',
        metodo: 'Cristalização Natural',
        temperatura: '70°C'
      },
      qualidade: {
        nota: 'A',
        pureza: 97.5,
        cor: 'Dourado Natural',
        granulometria: 'Média',
        umidade: 0.08
      },
      certificacoes: [
        { nome: 'Bonsucro', validade: '2024-12-15', orgao: 'Bonsucro Ltd' },
        { nome: 'ISCC', validade: '2024-12-15', orgao: 'ISCC System' }
      ],
      sustentabilidade: {
        economiaAgua: 22,
        reducaoEmissoes: 18,
        energiaRenovavel: 75,
        impactoSocial: 'Médio',
        biodiversidade: 'Preservada'
      },
      seguranca: {
        status: 'Aprovado',
        analises: [
          { tipo: 'Microbiológica', resultado: 'Conforme', data: '2024-06-15' },
          { tipo: 'Química', resultado: 'Conforme', data: '2024-06-15' },
          { tipo: 'Física', resultado: 'Conforme', data: '2024-06-15' }
        ],
        temperatura_transporte: '26°C',
        umidade_transporte: '58%'
      }
    }
  };

  const produto = dadosProduto[produtoSelecionado as keyof typeof dadosProduto];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'text-green-600 bg-green-100';
      case 'Conforme': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSustentabilidadeColor = (valor: number) => {
    if (valor >= 25) return 'text-green-600';
    if (valor >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Informações do Produto</h1>
              <p className="text-gray-600">Rastreabilidade Completa para o Consumidor</p>
              <p className="text-sm text-gray-500">
                Escaneie o QR Code ou consulte pelo código do produto
              </p>
            </div>
            <button
              onClick={onBack}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Seletor de Produto */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Verificar Produto</h2>
            <div className="flex items-center space-x-4">
              <QrCode className="h-8 w-8 text-blue-600" />
              <select 
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.keys(dadosProduto).map((prod) => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Informações Básicas do Produto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{produto.nome}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-700">Lote:</span>
                    <span className="ml-2 text-gray-600">{produto.lote}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-700">Produzido em:</span>
                    <span className="ml-2 text-gray-600">{new Date(produto.dataProducao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-700">Válido até:</span>
                    <span className="ml-2 text-gray-600">{new Date(produto.dataValidade).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-700">Qualidade:</span>
                    <span className="ml-2 text-yellow-600 font-bold">{produto.qualidade.nota}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Status de Segurança
              </h3>
              <div className="space-y-3">
                <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${getStatusColor(produto.seguranca.status)}`}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {produto.seguranca.status} para Consumo
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Análises microbiológicas aprovadas</p>
                  <p>✓ Análises químicas aprovadas</p>
                  <p>✓ Análises físicas aprovadas</p>
                  <p>✓ Transporte em condições adequadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Origem e Rastreabilidade */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin className="h-6 w-6 mr-3 text-red-600" />
            Origem e Rastreabilidade
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-600" />
                Fazenda de Origem
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Nome:</span> {produto.origem.fazenda}</p>
                <p><span className="font-semibold">Localização:</span> {produto.origem.cidade}, {produto.origem.estado}</p>
                <p><span className="font-semibold">Produtor:</span> {produto.origem.produtor}</p>
                <p><span className="font-semibold">Coordenadas:</span> {produto.origem.coordenadas}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Factory className="h-5 w-5 mr-2 text-blue-600" />
                Processamento
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Usina:</span> {produto.processamento.usina}</p>
                <p><span className="font-semibold">Data:</span> {new Date(produto.processamento.dataProcessamento).toLocaleDateString('pt-BR')}</p>
                <p><span className="font-semibold">Método:</span> {produto.processamento.metodo}</p>
                <p><span className="font-semibold">Temperatura:</span> {produto.processamento.temperatura}</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-purple-600" />
                Qualidade
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Pureza:</span> {produto.qualidade.pureza}%</p>
                <p><span className="font-semibold">Cor:</span> {produto.qualidade.cor}</p>
                <p><span className="font-semibold">Granulometria:</span> {produto.qualidade.granulometria}</p>
                <p><span className="font-semibold">Umidade:</span> {produto.qualidade.umidade}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificações */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="h-6 w-6 mr-3 text-yellow-600" />
            Certificações Válidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produto.certificacoes.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" />
                    {cert.nome}
                  </h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-semibold">Órgão:</span> {cert.orgao}</p>
                  <p><span className="font-semibold">Válida até:</span> {new Date(cert.validade).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sustentabilidade */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Globe className="h-6 w-6 mr-3 text-green-600" />
            Impacto Ambiental e Social
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Economia de Água</h3>
              <p className={`text-2xl font-bold ${getSustentabilidadeColor(produto.sustentabilidade.economiaAgua)}`}>
                {produto.sustentabilidade.economiaAgua}%
              </p>
              <p className="text-sm text-gray-600">vs. métodos convencionais</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Redução de Emissões</h3>
              <p className={`text-2xl font-bold ${getSustentabilidadeColor(produto.sustentabilidade.reducaoEmissoes)}`}>
                {produto.sustentabilidade.reducaoEmissoes}%
              </p>
              <p className="text-sm text-gray-600">CO2 equivalente</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Energia Renovável</h3>
              <p className="text-2xl font-bold text-yellow-600">{produto.sustentabilidade.energiaRenovavel}%</p>
              <p className="text-sm text-gray-600">da produção</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Impacto Social</h3>
              <p className="text-2xl font-bold text-purple-600">{produto.sustentabilidade.impactoSocial}</p>
              <p className="text-sm text-gray-600">na comunidade</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Biodiversidade</h3>
              <p className="text-2xl font-bold text-green-600">{produto.sustentabilidade.biodiversidade}</p>
              <p className="text-sm text-gray-600">no local</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Certificações</h3>
              <p className="text-2xl font-bold text-blue-600">{produto.certificacoes.length}</p>
              <p className="text-sm text-gray-600">ativas</p>
            </div>
          </div>
        </div>

        {/* Análises de Segurança */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-3 text-blue-600" />
            Análises de Segurança
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Testes Realizados</h3>
              <div className="space-y-3">
                {produto.seguranca.analises.map((analise, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-800">{analise.tipo}</p>
                        <p className="text-sm text-gray-600">{new Date(analise.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">{analise.resultado}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Condições de Transporte</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-red-500 mr-3" />
                    <span className="font-semibold text-gray-800">Temperatura</span>
                  </div>
                  <span className="text-red-600 font-semibold">{produto.seguranca.temperatura_transporte}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="font-semibold text-gray-800">Umidade</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{produto.seguranca.umidade_transporte}</span>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-green-800">Produto Seguro para Consumo</p>
                      <p className="text-sm text-green-600">Todas as análises foram aprovadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

