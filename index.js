// Function to add a new row to the main table
function addRow() {
    const tbody = document.querySelector("#mainTable tbody");
    const row = `
    
      <tr>
        <td><input type="text" name="accountName[]" class="accountName"></td>
        <td><input type="text" name="description[]" class="description"></td>
        <td>
          <select name="costCenter[]" class="costCenter">
            <option value="cost_center_1">Cost Center 1</option>
            <option value="cost_center_2">Cost Center 2</option>
            <option value="cost_center_3">Cost Center 3</option>
            <option value="multiple">Multiple</option>
            <!-- Add more cost center options as needed -->
          </select>
        </td>
        <td>
          <select name="tax[]" class="tax">
            <option value="tax_1">Tax 1</option>
            <option value="tax_2">Tax 2</option>
            <option value="tax_3">Tax 3</option>
            <!-- Add more tax options as needed -->
          </select>
        </td>
        <td><input type="number" name="debit[]" class="debit"></td>
        <td><input type="number" name="credit[]" class="credit"></td>
        <td><button type="button" class="removeRow">Remove</button></td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  }
  

  // Function to remove a row from the main table
function removeRow(event) {
    const row = event.target.closest("tr");
    const subTable = row.nextElementSibling;
    if (subTable && subTable.classList.contains("subTable")) {
      const subRows = subTable.querySelectorAll("tbody tr");
      if (subRows.length === 1) {
        subTable.remove(); // Remove the entire child table
      } else {
        row.parentNode.removeChild(row);
      }
    } else {
      row.parentNode.removeChild(row);
    }
  
    // Check if there are any remaining rows in the child table
    const childTables = document.querySelectorAll(".subTable");
    childTables.forEach(table => {
      const rows = table.querySelectorAll("tbody tr");
      if (rows.length === 0) {
        const tableHeader = table.querySelector("thead");
        const addCostButton = table.querySelector(".addCostCenter");
        if (tableHeader) {
          tableHeader.parentNode.removeChild(tableHeader);
        }
        if (addCostButton) {
          addCostButton.parentNode.parentNode.parentNode.removeChild(addCostButton.parentNode.parentNode);
        }
      }
    });
  }
  
  
  
  
  
  // Function to add a new row to the child table
  function addSubRow(event) {
    const subTableBody = event.target.closest("table").querySelector("tbody");
    const row = `
      <tr>
        <td><input type="text" name="costCenter_multiple[]" class="costCenter"></td>
        <td><input type="number" name="percentage[]" class="percentage"></td>
        <td><input type="number" name="amount[]" class="amount"></td>
        <td><button type="button" class="removeSubRow">Remove</button></td>
      </tr>
    `;
    subTableBody.insertAdjacentHTML('beforeend', row);
  }
  
  // Add row button click event
  document.getElementById("addRow").addEventListener("click", addRow);
  
  // Remove row button click event delegation
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("removeRow")) {
      removeRow(event);
    }
  });
  
  // Cost Center dropdown change event
  document.addEventListener("change", function(event) {
    if (event.target.classList.contains("costCenter")) {
      const selectedOption = event.target.value;
      const parentRow = event.target.closest("tr");
      const subTable = document.createElement("table");
      subTable.classList.add("subTable");
      if (selectedOption === "multiple") {
        subTable.innerHTML = `
          <thead>
            <tr>
              <th>Cost Center</th>
              <th>Percentage</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" name="costCenter_multiple[]" class="costCenter"></td>
              <td><input type="number" name="percentage[]" class="percentage"></td>
              <td><input type="number" name="amount[]" class="amount"></td>
              <td><button type="button" class="removeSubRow">Remove</button></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4"><button type="button" class="addCostCenter">Add Cost Center</button></td>
            </tr>
          </tfoot>
        `;
        const subTableContainer = document.createElement("td");
        subTableContainer.setAttribute("colspan", "7");
        subTableContainer.appendChild(subTable);
        const newRow = document.createElement("tr");
        newRow.appendChild(subTableContainer);
        parentRow.parentNode.insertBefore(newRow, parentRow.nextSibling);
      } else {
        const existingSubTable = parentRow.nextElementSibling;
        if (existingSubTable && existingSubTable.classList.contains("subTable")) {
          existingSubTable.remove();
        }
      }
    }
  });
  
  // Remove sub row button click event delegation
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("removeSubRow")) {
      const subRow = event.target.closest("tr");
      subRow.parentNode.removeChild(subRow);
    }
  });
  
  // Add cost center button click event delegation
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("addCostCenter")) {
      addSubRow(event);
    }
  });
  
  // Form submission event
  document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get the form data
    const formData = new FormData(this);
  
    // Log the form data to the console
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    // Calculate total debit and total credit
    const debitInputs = document.querySelectorAll("#mainTable tbody .debit");
    const creditInputs = document.querySelectorAll("#mainTable tbody .credit");
    let totalDebit = 0;
    let totalCredit = 0;
    debitInputs.forEach(input => totalDebit += parseFloat(input.value) || 0);
    creditInputs.forEach(input => totalCredit += parseFloat(input.value) || 0);
  
    // Update total debit and total credit fields
    document.getElementById("totalDebit").value = totalDebit.toFixed(2);
    document.getElementById("totalCredit").value = totalCredit.toFixed(2);
  });
  
  // Add default rows to the main table
  for (let i = 0; i < 3; i++) {
    addRow();
  }
  