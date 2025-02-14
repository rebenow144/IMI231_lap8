get_doctor_api();
function get_doctor_api() {

    fetch('http://127.0.0.1:3000/getDoctors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            var tableRef = document.getElementById('table_doctor_list').getElementsByTagName('tbody')[0];
            data.forEach(element => {
                console.log(element)

                tableRef.insertRow().innerHTML = "<td>" + element.doctor_id +
                    "</td> <td>" + element.name +
                    "</td> <td>" + element.telephone +
                    "</td><td>" + ((element.status == 1) ? "ปัจจุบัน" : "ลาออก") + "</td>" +
                    "</td><td>" + '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#from_doctor_Modal" onclick="click_momal_edit(' + element.doctor_id + ')">แก้ไข</button>' + "</td>";
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to handle modal open for adding new doctor
function click_momal_add() {
    document.getElementById('FormModalLabel').textContent = "เพิ่มข้อมูลแพทย์";
    document.getElementById('form_docter_id').style.display = 'none';
    document.getElementById('edit_type').value = 'add';
    
    // Clear form
    document.getElementById('form_name').value = '';
    document.getElementById('form_phone').value = '';
    document.getElementById('form_status').value = '1';
}

// Function to handle modal open for editing doctor
function click_momal_edit(doctorId) {
    document.getElementById('FormModalLabel').textContent = "แก้ไขข้อมูลแพทย์";
    document.getElementById('form_docter_id').style.display = 'block';
    document.getElementById('edit_type').value = 'edit';
    
    // Fetch doctor details
    fetch(`http://127.0.0.1:3000/getDoctor/${doctorId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('txt_docter_id').value = data.doctor_id;
            document.getElementById('form_name').value = data.name;
            document.getElementById('form_phone').value = data.telephone;
            document.getElementById('form_status').value = data.status;
        })
        .catch(error => console.error('Error:', error));
}

// Function to save doctor (both add and edit)
function save_doctor() {
    const editType = document.getElementById('edit_type').value;
    const doctorData = {
        name: document.getElementById('form_name').value,
        telephone: document.getElementById('form_phone').value,
        status: document.getElementById('form_status').value
    };

    let url = 'http://127.0.0.1:3000/addDoctor';
    let method = 'POST';

    if (editType === 'edit') {
        const doctorId = document.getElementById('txt_docter_id').value;
        url = `http://127.0.0.1:3000/editDoctor/${doctorId}`;
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('from_doctor_Modal'));
        modal.hide();
        get_doctor_api();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    });
}

// Updated get_doctor_api function with delete button
function get_doctor_api() {
    fetch('http://127.0.0.1:3000/getDoctors')
        .then(response => response.json())
        .then(data => {
            const tableRef = document.getElementById('table_doctor_list').getElementsByTagName('tbody')[0];
            tableRef.innerHTML = ''; // Clear existing rows
            
            data.forEach(element => {
                const row = tableRef.insertRow();
                row.innerHTML = `
                    <td>${element.doctor_id}</td>
                    <td>${element.name}</td>
                    <td>${element.telephone}</td>
                    <td>${element.status == 1 ? "ปัจจุบัน" : "ลาออก"}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm me-2" 
                            data-bs-toggle="modal" 
                            data-bs-target="#from_doctor_Modal" 
                            onclick="click_momal_edit(${element.doctor_id})">
                            แก้ไข
                        </button>
                        <button type="button" class="btn btn-danger btn-sm"
                            onclick="delete_doctor(${element.doctor_id})">
                            ลบ
                        </button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to delete doctor
function delete_doctor(doctorId) {
    if (confirm('คุณต้องการลบข้อมูลแพทย์ท่านนี้ใช่หรือไม่?')) {
        fetch(`http://127.0.0.1:3000/editDoctor/${doctorId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            get_doctor_api(); // Refresh table
        })
        .catch(error => {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        });
    }
}
