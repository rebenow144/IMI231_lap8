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


