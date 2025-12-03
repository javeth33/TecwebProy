$(document).ready(function() {
    $.ajax({
        url: 'backend/get-stats.php',
        type: 'GET',
        success: function(response) {
            let data = JSON.parse(response);
            renderCharts(data);
        }
    });

    function renderCharts(data) {
        // 1. Configuración Gráfica Tipos (Pie)
        let etiquetasTipos = data.tipos.map(item => item.etiqueta);
        let valoresTipos = data.tipos.map(item => item.cantidad);
        
        new Chart(document.getElementById('chartTipos'), {
            type: 'pie',
            data: {
                labels: etiquetasTipos,
                datasets: [{
                    data: valoresTipos,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            }
        });

        // 2. Configuración Gráfica Días (Barra)
        new Chart(document.getElementById('chartDias'), {
            type: 'bar',
            data: {
                labels: data.dias.etiquetas,
                datasets: [{
                    label: 'Descargas',
                    data: data.dias.datos,
                    backgroundColor: '#36A2EB'
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        // 3. Configuración Gráfica Horas (Línea)
        new Chart(document.getElementById('chartHoras'), {
            type: 'line',
            data: {
                labels: data.horas.etiquetas,
                datasets: [{
                    label: 'Tráfico por Hora',
                    data: data.horas.datos,
                    borderColor: '#FF6384',
                    fill: false
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }
});