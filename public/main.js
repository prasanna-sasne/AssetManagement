const EMPLOYEES_API_BASE_URL = `http://localhost:3000/employees`;

/**
 * Returns a formatted date string.
 * @param {*} dateString Selected date from the calender.
 * @returns date in Month date, year format.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Fetch employee array from the API.
 * @returns An array of employees.
 */
async function fetchEmployees() {
  const employees = await fetch(EMPLOYEES_API_BASE_URL);
  const response = await employees.json();
  return response;
}

/**
 * Creates employee table.
 * @returns {void}
 */
function createEmployeeTable() {
  const employeeTable = document.getElementById('employee-table');
  employeeTable.innerHTML = '';

  // Create table header.
  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Location</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Asset Tag</th>
            <th>Category</th>
            <th>Purchase Date</th>
            <th>Description</th>
        </tr>
    `;
  employeeTable.appendChild(tableHeader);

  fetchEmployees()
    .then((employees) => {
      const tableBody = document.createElement('tbody');
      employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${employee['Assigned to']}</td>
                <td>${employee['Department']}</td>
                <td>${employee['Location']}</td>
                <td>${employee['Email']}</td>
                <td>${employee['Phone']}</td>
                <td>${employee['Asset Tag']}</td>
                <td>${employee['Category']}</td>
                <td>${employee['Purchase Date']}</td>
                <td>${employee['Description']}</td>
            `;
        tableBody.appendChild(row);
      });
      employeeTable.appendChild(tableBody);
    })
    .catch((error) => {
      console.log(`Error occured ` + error.Message);
    });
};

document.addEventListener('DOMContentLoaded', () => {
  // Display initial employee records in table format.
  createEmployeeTable();

  const addEmployeeForm = document.getElementById('add-employee-form');
  const addButton = document.getElementById('add-employee');
  const formContainer = document.getElementById('employee-form');

  // Hide the form initially
  formContainer.style.display = 'none';


  addEmployeeForm.addEventListener('submit', event => handleFormSubmission(event, addEmployeeForm));
  addButton.addEventListener('click', toggleFormDisplay);
});

/**
 * Returns formated phone number with hyphen.
 * @param {*} phoneNumber phone number from the employee form table.
 * @returns Hyphanated phone number.
 */
function addHyphen(phoneNumber) {
  phoneNumber = phoneNumber.split('-').join('');
  return phoneNumber.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/, '$1$2$3-$4$5$6-$7$8$9$10')
}

/**
 * Handles form submission.
 * @param {*} event Submit event of the form.
 * @param {*} addEmployeeForm Employee form data.
 * @returns {void}
 */
async function handleFormSubmission(event, addEmployeeForm) {
  event.preventDefault();
  const formData = new FormData(addEmployeeForm);

  const newEmployee = {
    'Assigned to': formData.get('assigned-to'),
    'Department': formData.get('department'),
    'Location': formData.get('location'),
    'Phone': addHyphen(formData.get('phone')),
    'Email': formData.get('email'),
    'Asset Tag': formData.get('asset-tag'),
    'Category': formData.get('category'),
    'Purchase Date': formatDate(formData.get('purchase-date')),
    'Description': formData.get('description')
  };

  await fetch(EMPLOYEES_API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEmployee)
  })
    .then(response => {
      if (response.ok) {
        console.log('Employee added successfully');
        // Reset form and update employee table
        addEmployeeForm.reset();
        createEmployeeTable();
      } else {
        console.error('Error adding employee:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error adding employee:', error);
    });
}

/**
 * Toggles employee form on UI.
 * @returns {void}
 */
function toggleFormDisplay() {
  const form = document.getElementById('employee-form');
  const addButton = document.getElementById('add-employee');
  if (form.style.display === 'none') {
    form.style.display = 'block';
    addButton.innerText = 'Hide Employee Form';
  } else {
    form.style.display = 'none';
    addButton.innerText = 'Add New Employee';
  }
}
