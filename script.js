// Leer archivo data.txt y procesarlo
fetch('data.txt')
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split('\n'); // Dividir en líneas
        const parsedData = rows.map(row => {
            const [nombre, asistencias, faltas, justificados] = row.split(';');
            const total = parseInt(asistencias) + parseInt(faltas) + parseInt(justificados);
            const porcentaje = ((parseInt(asistencias) / total) * 100).toFixed(2);
            return { nombre, asistencias, faltas, justificados, porcentaje };
        });

        // Ordenar por porcentaje descendente
        parsedData.sort((a, b) => b.porcentaje - a.porcentaje);

        // Renderizar la tabla
        const tableBody = document.querySelector('#asistenciasTable tbody');
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
