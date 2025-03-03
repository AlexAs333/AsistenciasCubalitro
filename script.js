fetch('data.txt')
  .then(response => response.text())
  .then(data => {
    // Dividir en líneas y descartar comentarios "//"
    const allLines = data.split('\n');
    const relevantLines = [];
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i].trim();
      if (line.startsWith('//')) break;
      if (line !== '') relevantLines.push(line);
    }

    // La primera línea es el número total
    const totalNumero = parseInt(relevantLines[0]);

    // Procesar los datos
    const parsedData = relevantLines.slice(1).map(row => {
      const [nombre, asistencias, justificados] = row.split(';');
      const asistenciasInt = parseInt(asistencias);
      const justificadosInt = parseInt(justificados);
      const faltas = totalNumero - asistenciasInt - justificadosInt;
      const porcentaje = totalNumero > 0 
        ? ((asistenciasInt / totalNumero) * 100).toFixed(2)
        : 0;
      return {
        nombre,
        asistencias: asistenciasInt,
        faltas,
        justificados: justificadosInt,
        porcentaje: parseFloat(porcentaje),
        color: ''
      };
    });

    // Ordenar por porcentaje descendente
    parsedData.sort((a, b) => b.porcentaje - a.porcentaje);

    // Marcar los 3 últimos en rojo
    if (parsedData.length >= 3) {
      for (let i = parsedData.length - 3; i < parsedData.length; i++) {
        parsedData[i].color = 'red';
      }
    }

    // Asignar medallas
    if (parsedData.length > 0) {
      const oro = parsedData[0].porcentaje;
      const oroCount = parsedData.filter(d => d.porcentaje === oro).length;

      if (oroCount > 1) {
        for (let i = 0; i < oroCount; i++) {
          parsedData[i].color = 'gold';
        }
      } else {
        parsedData[0].color = 'gold';

        if (parsedData.length > 1) {
          const plata = parsedData[1].porcentaje;
          const plataCount = parsedData.filter(d => d.porcentaje === plata).length;

          if (plataCount > 1) {
            for (let i = 1; i < 1 + plataCount; i++) {
              parsedData[i].color = 'silver';
            }
          } else {
            parsedData[1].color = 'silver';

            if (parsedData.length > 2) {
              const bronce = parsedData[2].porcentaje;
              const bronceCount = parsedData.filter(d => d.porcentaje === bronce).length;

              if (bronceCount > 1) {
                // No asignar bronce si hay empate
              } else {
                parsedData[2].color = 'bronze';
              }
            }
          }
        }
      }
    }

    // Renderizar la tabla
    const tableBody = document.querySelector('#asistenciasTable tbody');
    tableBody.innerHTML = '';

    parsedData.forEach(item => {
      const { nombre, asistencias, faltas, justificados, porcentaje, color } = item;
      const row = document.createElement('tr');
      if (color) row.classList.add(color);
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
