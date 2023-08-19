document.addEventListener("DOMContentLoaded", function () {
  const calculateButton = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");

  // Configuración de Firebase (reemplaza con tus propias credenciales)
  const firebaseConfig = {
      apiKey: "AIzaSyCQdSz6pN7OJyUWdUC8OUpVHE2rj8xNSTw",
      authDomain: "calcul1-4c2f9.firebaseapp.com",
      projectId: "calcul1-4c2f9",
      storageBucket: "calcul1-4c2f9.appspot.com",
      messagingSenderId: "973017548247",
      appId: "web:a55c0c8bfa59d2bc13b792"
  };

  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);

  // Obtén una referencia a la base de datos Firestore
  const db = firebase.firestore();
  const dataTable = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
  const loadButton = document.getElementById("loadButton"); // Obtén referencia al botón

// Consulta los datos de Firestore y construye las filas de la tabla
loadButton.addEventListener("click", () => {
    db.collection("resultados").orderBy("timestamp").get().then((querySnapshot) => {
        dataTable.innerHTML = ""; // Limpia la tabla antes de cargar nuevos datos

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const newRow = dataTable.insertRow();

            const cellNombre = newRow.insertCell(0);
            cellNombre.textContent = data.nombre;

            const cellIngresos = newRow.insertCell(1);
            cellIngresos.textContent = formatCurrency(data.ingresos);

            const cellGastos = newRow.insertCell(2);
            cellGastos.textContent = formatCurrency(data.gastos);
            cellGastos.classList.add("gasto-cell"); // Asi se agrega la clase para celdas de gastos

            const cellTotal = newRow.insertCell(3);
            cellTotal.textContent = formatCurrency(data.total);

            const cellFecha = newRow.insertCell(4);
            if (data.timestamp) {
                // Suponiendo que data.fecha contiene un timestamp
                const fecha = data.timestamp.toDate();
                const fechaHora = fecha.toLocaleString(); // Obtiene la fecha y la hora en formato local
                cellFecha.textContent = fechaHora;
            } else {
                cellFecha.textContent = "N/A"; // Mostrar "N/A" si no hay fecha
            }
        });
    });
});

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