import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [dadosCasos, setDadosCasos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const gradiente = ['#40516c', '#4a5d7c', '#53698c', '#5d759c', '#6b82a7', '#7790b1', '#8b9dba'];
  let graficoRosca = null;
  let graficoDistribuicao = null;
  let graficoEtnia = null;
  let graficoEvolucao = null;

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
      console.error('Erro ao carregar dados:', erro);
      alert('Não foi possível carregar os dados.');
    }
  };

  const filtrarPorData = (casos) => {
    return casos.filter((caso) => {
      if (!caso.data_do_caso) return false;
      const data = new Date(caso.data_do_caso);
      const inicio = dataInicio ? new Date(dataInicio) : null;
      const fim = dataFim ? new Date(dataFim) : null;
      return (!inicio || data >= inicio) && (!fim || data <= fim);
    });
  };

  const contarOcorrencias = (dados, chave) => {
    const contagem = {};
    dados.forEach((caso) => {
      try {
        const valor = chave.includes('.')
          ? chave.split('.').reduce((o, k) => (o && o[k] ? o[k] : null), caso)
          : caso[chave];
        if (valor !== undefined && valor !== null) {
          contagem[valor] = (contagem[valor] || 0) + 1;
        }
      } catch {}
    });
    return contagem;
  };

  const atualizarGraficoRosca = (dadosFiltrados) => {
    const contagem = contarOcorrencias(dadosFiltrados, 'tipo_do_caso');
    const labels = Object.keys(contagem);
    const valores = Object.values(contagem);
    const cores = gradiente.slice(0, labels.length);

    const ctx = document.createElement('canvas');
    const container = document.getElementById('graficoRosca');
    container.innerHTML = '';
    container.appendChild(ctx);

    if (graficoRosca) graficoRosca.destroy();

    graficoRosca = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: cores,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  };

  const atualizarGraficoDistribuicao = (dadosFiltrados) => {
    const idades = dadosFiltrados
      .map(c => c.vitima?.idade)
      .filter(i => typeof i === 'number' && !isNaN(i) && i > 0);

    const max = Math.max(...idades, 100);
    const bins = [];
    const labels = [];

    for (let i = 1; i <= max; i += 10) {
      labels.push(`${i}-${i + 9}`);
      bins.push(0);
    }

    idades.forEach((idade) => {
      const index = Math.floor((idade - 1) / 10);
      if (index >= 0 && index < bins.length) bins[index]++;
    });

    const ctx = document.createElement('canvas');
    const container = document.getElementById('graficoDistribuicao');
    container.innerHTML = '';
    container.appendChild(ctx);

    if (graficoDistribuicao) graficoDistribuicao.destroy();

    graficoDistribuicao = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Número de vítimas por faixa etária',
          data: bins,
          backgroundColor: '#5d759c',
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  };

  const atualizarGraficoEtnia = (dadosFiltrados) => {
    const contagem = contarOcorrencias(dadosFiltrados, 'vitima.etnia');
    const labels = Object.keys(contagem);
    const valores = Object.values(contagem);

    const ctx = document.createElement('canvas');
    const container = document.getElementById('graficoEtnia');
    container.innerHTML = '';
    container.appendChild(ctx);

    if (graficoEtnia) graficoEtnia.destroy();

    graficoEtnia = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Casos por etnia da vítima',
          data: valores,
          backgroundColor: '#6b82a7',
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  };

  const atualizarGraficoEvolucao = (dadosFiltrados) => {
    const contagem = {};
    dadosFiltrados.forEach(caso => {
      const data = new Date(caso.data_do_caso);
      const mesAno = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
      contagem[mesAno] = (contagem[mesAno] || 0) + 1;
    });

    const labels = Object.keys(contagem).sort();
    const valores = labels.map(label => contagem[label]);

    const ctx = document.createElement('canvas');
    const container = document.getElementById('graficoEvolucao');
    container.innerHTML = '';
    container.appendChild(ctx);

    if (graficoEvolucao) graficoEvolucao.destroy();

    graficoEvolucao = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Evolução de casos por mês',
          data: valores,
          backgroundColor: '#4a5d7c',
          borderColor: '#4a5d7c',
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  };

  const atualizarGraficos = () => {
    const dadosFiltrados = filtrarPorData(dadosCasos);
    atualizarGraficoRosca(dadosFiltrados);
    atualizarGraficoDistribuicao(dadosFiltrados);
    atualizarGraficoEtnia(dadosFiltrados);
    atualizarGraficoEvolucao(dadosFiltrados);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <label>
        Início:
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
      </label>
      <label>
        Fim:
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
      </label>

      <div id="graficoRosca" style={{ width: '100%', maxWidth: '600px', margin: 'auto', marginBottom: '40px' }}></div>
      <div id="graficoDistribuicao" style={{ width: '100%', maxWidth: '600px', margin: 'auto', marginBottom: '40px' }}></div>
      <div id="graficoEtnia" style={{ width: '100%', maxWidth: '600px', margin: 'auto', marginBottom: '40px' }}></div>
      <div id="graficoEvolucao" style={{ width: '100%', maxWidth: '600px', margin: 'auto', marginBottom: '40px' }}></div>
    </div>
  );
};

export default Dashboard;
