document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");

  // Aquí se introducen las credenciales que me dieron en firebase
  const firebaseConfig = {
      apiKey: "AIzaSyCQdSz6pN7OJyUWdUC8OUpVHE2rj8xNSTw",
      authDomain: "calcul1-4c2f9.firebaseapp.com",
      projectId: "calcul1-4c2f9",
      storageBucket: "calcul1-4c2f9.appspot.com",
      messagingSenderId: "973017548247",
      appId: "web:a55c0c8bfa59d2bc13b792"
  };

  // Iniciamos Firebase
  firebase.initializeApp(firebaseConfig);

  // La constante db almacena una instancia de la base de datos en firestore, mientras que el firebase.firestore(); proporciona acceso a firestore
  const db = firebase.firestore();
  // Con esto estoy agregando filas a la tabla tomando el id de la tabla con dataTable
  const dataTable = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
  // Con esto se activa la funcionalidad del loadButton
  const loadButton = document.getElementById("loadButton");

// Consulta los datos de Firestore y construye las filas de la tabla
loadButton.addEventListener("click", () => {
    db.collection("resultados").orderBy("timestamp").get().then((querySnapshot) => {
        
        dataTable.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const newRow = dataTable.insertRow();

            const cellNombre = newRow.insertCell(0);
            cellNombre.textContent = data.nombre;

            const cellIngresos = newRow.insertCell(1);
            cellIngresos.textContent = formatCurrency(data.ingresos);

            const cellGastos = newRow.insertCell(2);
            cellGastos.textContent = formatCurrency(data.gastos);
            // Asi se agrega la clase para celdas de gastos
            cellGastos.classList.add("gasto-cell"); 

            const cellTotal = newRow.insertCell(3);
            cellTotal.textContent = formatCurrency(data.total);

            const cellFecha = newRow.insertCell(4);
            if (data.timestamp) {
                const fecha = data.timestamp.toDate();
                // Obtiene la fecha y la hora en formato local
                const fechaHora = fecha.toLocaleString();
                cellFecha.textContent = fechaHora;
            } else {
                // Mostrar "sin fecha" si no hay fecha
                cellFecha.textContent = "Sin Fecha"; 
            }
        });
    });
});
//Con esto le estoy dando el formato a moneda a los valores de la tabla
function formatCurrency(amount) {
    return "💲" + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

  calculateButton.addEventListener("click", function () {
      const nameInput = document.getElementById("name");
      const prodInput = document.getElementById("prod");
      const precInput = document.getElementById("prec");

      const name = nameInput.value;
      const prod = prodInput.value;
      const prec = parseFloat(precInput.value);

      if (name && prod && !isNaN(prec)) {
          const totalPrec = calculateTotalPrec(prod, prec);
          resultDiv.textContent = `Tu presupuesto es $${totalPrec.toFixed(2)}`;
          saveResultsToFirestore(name, prod, prec, totalPrec); // Guardar en Firestore
      } else {
          resultDiv.textContent = "ERROR.";
      }
  });

  function calculateTotalPrec(prod, prec) {
      const totalPrec = prod - prec;
      return totalPrec;
  }

  function saveResultsToFirestore(name, ingresos, gastos, total) {
      db.collection("resultados").add({
          nombre: name,
          ingresos: parseFloat(ingresos),
          gastos: parseFloat(gastos),
          total: parseFloat(total),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
          console.log("Resultados guardados en Firestore");
      })
      .then(() => {
        resultDiv.textContent = "Resultados guardados en Firestore";
    })
      .catch((error) => {
          console.error("Error al guardar resultados:", error);
      })
      .catch((error) => {
        resultDiv.textContent = "Error al guardar resultados:", error;
      });
  }
});