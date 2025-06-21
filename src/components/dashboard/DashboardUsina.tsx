import React, { useState } from 'react';
import { 
  Package, 
  Shield, 
  BarChart3, 
  FileCheck, 
  Truck,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Factory,
  Leaf,
  Database,
  QrCode,
  Clock,
  Users,
  Target
} from 'lucide-react';

export interface DashboardUsinaProps {
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
}

export const DashboardUsina: React.FC<DashboardUsinaProps> = ({ onBack, onNext, onClose }) => {
  const [loteSelected, setLoteSelected] = useState('LOTE-2024-001');

  // Dados de rastreabilidade
  const dadosRastreabilidade = {
    'LOTE-2024-001': {
      origem: 'Fazenda São José - Ribeirão Preto, SP',
      produtor: 'João Silva',
      dataColheita: '2024-06-15',
      quantidade: '45.2 ton',
      qualidade: 'A+',
      pol: 16.8,
      pureza: 89.2,
      fibra: 12.5,
      umidade: 8.3,
      certificacoes: ['Bonsucro', 'ISCC', 'Orgânico'],
      transporte: {
        veiculo: 'Caminhão ABC-1234',
        motorista: 'Carlos Santos',
        dataEntrega: '2024-06-15 14:30',
        temperatura: '25°C'
      }
    },
    'LOTE-2024-002': {
      origem: 'Fazenda Santa Maria - Sertãozinho, SP',
      produtor: 'Maria Oliveira',
      dataColheita: '2024-06-14',
      quantidade: '38.7 ton',
      qualidade: 'A',
      pol: 15.9,
      pureza: 87.8,
      fibra: 13.1,
      umidade: 9.1,
      certificacoes: ['Bonsucro', 'ISCC'],
      transporte: {
        veiculo: 'Caminhão DEF-5678',
        motorista: 'Pedro Lima',
        dataEntrega: '2024-06-14 16:45',
        temperatura: '26°C'
      }
    }
  };

  const certificadosDigitais = [
    {
      id: 'CERT-001',
      tipo: 'Bonsucro',
      lote: 'LOTE-2024-001',
      status: 'Válido',
      dataEmissao: '2024-06-15',
      dataVencimento: '2024-12-15',
      hash: '0x1a2b3c4d5e6f...'
    },
    {
      id: 'CERT-002',
      tipo: 'ISCC',
      lote: 'LOTE-2024-001',
      status: 'Válido',
      dataEmissao: '2024-06-15',
      dataVencimento: '2024-12-15',
      hash: '0x7g8h9i0j1k2l...'
    },
    {
      id: 'CERT-003',
      tipo: 'Orgânico',
      lote: 'LOTE-2024-001',
      status: 'Válido',
      dataEmissao: '2024-06-15',
      dataVencimento: '2025-06-15',
      hash: '0xm3n4o5p6q7r8...'
    }
  ];

  const analiseQualidade = {
    lotesProcessados: 156,
    qualidadeMedia: 'A',
    conformidade: 98.5,
    rejeitados: 2,
    distribuicaoQualidade: {
      'A+': 45,
      'A': 89,
      'B+': 20,
      'B': 2
    }
  };

  const complianceRegulatorio = [
    {
      regulamento: 'ANP - Resolução 758/2018',
      status: 'Conforme',
      ultimaAuditoria: '2024-05-15',
      proximaAuditoria: '2024-11-15'
    },
    {
      regulamento: 'MAPA - Portaria 678/2021',
      status: 'Conforme',
      ultimaAuditoria: '2024-04-20',
      proximaAuditoria: '2024-10-20'
    },
    {
      regulamento: 'IBAMA - Licença Ambiental',
      status: 'Conforme',
      ultimaAuditoria: '2024-03-10',
      proximaAuditoria: '2025-03-10'
    },
    {
      regulamento: 'Bonsucro Standard',
      status: 'Pendente',
      ultimaAuditoria: '2024-01-15',
      proximaAuditoria: '2024-07-15'
    }
  ];

  const loteAtual = dadosRastreabilidade[loteSelected as keyof typeof dadosRastreabilidade];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal da Usina</h1>
              <p className="text-gray-600">Usina São João - Ribeirão Preto, SP</p>
              <p className="text-sm text-gray-500">
                Sistema de Rastreabilidade e Qualidade
              </p>
            </div>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Seletor de Lote */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rastreabilidade da Matéria-Prima</h2>
          <div className="flex items-center space-x-4 mb-6">
            <label className="font-semibold text-gray-700">Selecionar Lote:</label>
            <select 
              value={loteSelected}
              onChange={(e) => setLoteSelected(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.keys(dadosRastreabilidade).map((lote) => (
                <option key={lote} value={lote}>{lote}</option>
              ))}
            </select>
          </div>

          {/* Informações do Lote Selecionado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Origem e Produtor
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Fazenda:</span>
                  <p className="text-gray-600">{loteAtual.origem}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Produtor:</span>
                  <p className="text-gray-600">{loteAtual.produtor}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Data da Colheita:</span>
                  <p className="text-gray-600">{new Date(loteAtual.dataColheita).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Quantidade:</span>
                  <p className="text-gray-600 font-semibold">{loteAtual.quantidade}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-green-600" />
                Transporte
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Veículo:</span>
                  <p className="text-gray-600">{loteAtual.transporte.veiculo}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Motorista:</span>
                  <p className="text-gray-600">{loteAtual.transporte.motorista}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Data/Hora Entrega:</span>
                  <p className="text-gray-600">{loteAtual.transporte.dataEntrega}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Temperatura:</span>
                  <p className="text-gray-600">{loteAtual.transporte.temperatura}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Análise de Qualidade do Lote */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Análise de Qualidade
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Qualidade</p>
                <p className="text-2xl font-bold text-purple-600">{loteAtual.qualidade}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">POL (%)</p>
                <p className="text-2xl font-bold text-blue-600">{loteAtual.pol}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Pureza (%)</p>
                <p className="text-2xl font-bold text-green-600">{loteAtual.pureza}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fibra (%)</p>
                <p className="text-2xl font-bold text-orange-600">{loteAtual.fibra}</p>
              </div>
            </div>
          </div>

          {/* Certificações */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Certificações
            </h3>
            <div className="flex flex-wrap gap-2">
              {loteAtual.certificacoes.map((cert, index) => (
                <span 
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certificados Digitais */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FileCheck className="h-6 w-6 mr-3 text-blue-600" />
            Certificados Digitais Automáticos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lote</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Emissão</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vencimento</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Blockchain</th>
                </tr>
              </thead>
              <tbody>
                {certificadosDigitais.map((cert) => (
                  <tr key={cert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{cert.id}</td>
                    <td className="py-3 px-4">{cert.tipo}</td>
                    <td className="py-3 px-4">{cert.lote}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-600 font-semibold">{cert.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{new Date(cert.dataEmissao).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4">{new Date(cert.dataVencimento).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <QrCode className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-mono text-xs text-gray-600">{cert.hash}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Análise de Qualidade Geral */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
              Análise de Qualidade por Lote
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Lotes Processados</p>
                <p className="text-3xl font-bold text-blue-600">{analiseQualidade.lotesProcessados}</p>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Qualidade Média</p>
                <p className="text-3xl font-bold text-green-600">{analiseQualidade.qualidadeMedia}</p>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Conformidade</p>
                <p className="text-3xl font-bold text-purple-600">{analiseQualidade.conformidade}%</p>
              </div>
              <div className="text-center bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Rejeitados</p>
                <p className="text-3xl font-bold text-red-600">{analiseQualidade.rejeitados}</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-3">Distribuição por Qualidade</h3>
            <div className="space-y-2">
              {Object.entries(analiseQualidade.distribuicaoQualidade).map(([qualidade, quantidade]) => (
                <div key={qualidade} className="flex items-center justify-between">
                  <span className="font-semibold">{qualidade}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(quantidade / analiseQualidade.lotesProcessados) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{quantidade} lotes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-red-600" />
              Compliance Regulatório
            </h2>
            <div className="space-y-4">
              {complianceRegulatorio.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{item.regulamento}</h3>
                    <div className="flex items-center">
                      {item.status === 'Conforme' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className={`font-semibold ${
                        item.status === 'Conforme' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Última auditoria: {new Date(item.ultimaAuditoria).toLocaleDateString('pt-BR')}</p>
                    <p>Próxima auditoria: {new Date(item.proximaAuditoria).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo Operacional */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Factory className="h-6 w-6 mr-3 text-gray-600" />
            Resumo Operacional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Lotes Recebidos</h3>
              <p className="text-2xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-600">este mês</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Produção</h3>
              <p className="text-2xl font-bold text-green-600">4.850 ton</p>
              <p className="text-sm text-gray-600">açúcar processado</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Certificações</h3>
              <p className="text-2xl font-bold text-yellow-600">98.5%</p>
              <p className="text-sm text-gray-600">conformidade</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Blockchain</h3>
              <p className="text-2xl font-bold text-purple-600">100%</p>
              <p className="text-sm text-gray-600">rastreabilidade</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
            Voltar
          </button>
          <button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Próximo
          </button>
          {onClose && (
            <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

