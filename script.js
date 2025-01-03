// Leer archivo data.txt y procesarlo
fetch('data.txt')
    .then(response => response.text())
    .then(data => {
        // Dividir los datos en líneas
        const rows = data.trim().split('\n');
        
        // Procesar cada línea y calcular el porcentaje
        const parsedData = rows.map(row => {
            const [nombre, asistencias, faltas, justificados] = row.split(';');
            const total = parseInt(asistencias) + parseInt(faltas) + parseInt(justificados);
            const porcentaje = total > 0 
                ? ((parseInt(asistencias) / total) * 100).toFixed(2) 
                : 0; // Manejo de casos con total 0
            return { 
                nombre, 
                asistencias: parseInt(asistencias), 
                faltas: parseInt(faltas), 
                justificados: parseInt(justificados), 
                porcentaje: parseFloat(porcentaje) 
            };
        });

        // Ordenar por porcentaje descendente
        parsedData.sort((a, b) => b.porcentaje - a.porcentaje);

        // Renderizar la tabla
        const tableBody = document.querySelector('#asistenciasTable tbody');
        tableBody.innerHTML = ''; // Limpiar cualquier contenido previo

        parsedData.forEach(({ nombre, asistencias, faltas, justificados, porcentaje }) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nombre}</td>
                <td>${asistencias}</td>
                <td>${faltas}</td>
                <td>${justificados}</td>
                <td>${porcentaje}%</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));
