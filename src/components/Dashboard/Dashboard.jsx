import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [dadosCasos, setDadosCasos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // referências de gráficos (mantidos como let)
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
      setDadosCasos(data);
    } catch (erro) {
      alert('Erro ao carregar dados.');
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
        ? chave.split('.').reduce((o, k) => (o?.[k] ?? null), caso)
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
    <div className="dashboard">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📊 Painel de Casos</h2>

      <div className="filtros" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label>Início:</label><br />
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div>
          <label>Fim:</label><br />
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
      </div>

      <div
        className="grade-graficos"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '0 1rem'
        }}
      >
        <div id="graficoRosca"></div>
        <div id="graficoDistribuicao"></div>
        <div id="graficoEtnia"></div>
        <div id="graficoEvolucao"></div>
      </div>
    </div>
  );
};

export default Dashboard;
