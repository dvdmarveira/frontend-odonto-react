import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [dadosCasos, setDadosCasos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  let graficoRosca = null;
  let graficoDistribuicao = null;
  let graficoEtnia = null;
  let graficoEvolucao = null;

  const gradiente = ['#40516c', '#4a5d7c', '#53698c', '#5d759c', '#6b82a7', '#7790b1', '#8b9dba'];

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    atualizarGraficos();
  }, [dadosCasos, dataInicio, dataFim]);

  const carregarDados = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/casos');
      const data = await res.json();
      setDadosCasos(Array.isArray(data) ? data : data?.casos || []);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    }
  };

  const filtrarPorData = (casos) => {
    return casos.filter((caso) => {
      const data = new Date(caso.data_do_caso);
      const inicio = dataInicio ? new Date(dataInicio) : null;
      const fim = dataFim ? new Date(dataFim) : null;
      return (!inicio || data >= inicio) && (!fim || data <= fim);
    });
  };

  const contarOcorrencias = (dados, chave) => {
    const contagem = {};
    dados.forEach((caso) => {
      const valor = chave.includes('.')
        ? chave.split('.').reduce((o, k) => o?.[k], caso)
        : caso[chave];
      if (valor) contagem[valor] = (contagem[valor] || 0) + 1;
    });
    return contagem;
  };

  const renderGrafico = (id, tipo, data, options, instancia) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    if (instancia) instancia.destroy();
    return new Chart(canvas, { type: tipo, data, options });
  };

  const atualizarGraficoRosca = (dados) => {
    const contagem = contarOcorrencias(dados, 'tipo_do_caso');
    graficoRosca = renderGrafico(
      'graficoRosca',
      'doughnut',
      {
        labels: Object.keys(contagem),
        datasets: [{
          data: Object.values(contagem),
          backgroundColor: gradiente
        }]
      },
      { responsive: true, plugins: { legend: { position: 'bottom' } } },
      graficoRosca
    );
  };

  const atualizarGraficoDistribuicao = (dados) => {
    const idades = dados.map(c => c.vitima?.idade).filter(i => i > 0);
    const bins = new Array(10).fill(0);
    const labels = bins.map((_, i) => `${i * 10 + 1}-${(i + 1) * 10}`);

    idades.forEach(i => {
      const idx = Math.floor((i - 1) / 10);
      if (idx >= 0 && idx < bins.length) bins[idx]++;
    });

    graficoDistribuicao = renderGrafico(
      'graficoDistribuicao',
      'bar',
      {
        labels,
        datasets: [{ label: 'Faixas etárias', data: bins, backgroundColor: '#5d759c' }]
      },
      { responsive: true, scales: { y: { beginAtZero: true } } },
      graficoDistribuicao
    );
  };

  const atualizarGraficoEtnia = (dados) => {
    const contagem = contarOcorrencias(dados, 'vitima.etnia');
    graficoEtnia = renderGrafico(
      'graficoEtnia',
      'bar',
      {
        labels: Object.keys(contagem),
        datasets: [{ label: 'Por etnia', data: Object.values(contagem), backgroundColor: '#6b82a7' }]
      },
      { responsive: true, scales: { y: { beginAtZero: true } } },
      graficoEtnia
    );
  };

  const atualizarGraficoEvolucao = (dados) => {
    const contagem = {};
    dados.forEach(({ data_do_caso }) => {
      const d = new Date(data_do_caso);
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      contagem[chave] = (contagem[chave] || 0) + 1;
    });
    const labels = Object.keys(contagem).sort();
    const valores = labels.map(k => contagem[k]);

    graficoEvolucao = renderGrafico(
      'graficoEvolucao',
      'line',
      {
        labels,
        datasets: [{
          label: 'Casos por mês',
          data: valores,
          borderColor: '#4a5d7c',
          backgroundColor: '#4a5d7c',
          tension: 0.3
        }]
      },
      { responsive: true, scales: { y: { beginAtZero: true } } },
      graficoEvolucao
    );
  };

  const atualizarGraficos = () => {
    const filtrados = filtrarPorData(dadosCasos);
    atualizarGraficoRosca(filtrados);
    atualizarGraficoDistribuicao(filtrados);
    atualizarGraficoEtnia(filtrados);
    atualizarGraficoEvolucao(filtrados);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-screen-2xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">📊 Painel de Casos</h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Data de Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 shadow-sm w-48"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Data de Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 shadow-sm w-48"
          />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {['graficoRosca', 'graficoDistribuicao', 'graficoEtnia', 'graficoEvolucao'].map(id => (
          <div
            key={id}
            className="bg-white rounded-2xl shadow-lg p-6 w-full overflow-hidden"
          >
            <div id={id} className="w-full h-full min-h-[300px]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
