async function loadTable() {
  const url = "api/get_current";
  const jsonData = await FetchAPI.getData(url);

  // Clear the table
  $("#project-table tbody").empty();

  let number = 1;

  // Populate the table
  for (const item of jsonData.data) {
    let manage = `<td class="text-center"><button disabled class="btcur btn btn-outline">แก้ไข</button></td>`;
    let status = `<td class="text-center">${item.Status}</td>`;
    switch (item.Status_ID) {
      case 17:
        (manage = `<td class="text-center"><button  class="btcur btn btn-outline-danger" value="${item.ID}" onclick="headingEditPage(this.value)">แก้ไข</button></td>`),
          (status = `<td class="text-center" style="color:red">${item.Status}</td>`);
        break;
    }
    $("#project-table tbody").append(
      `
        <tr>
        <td class="text-center">${number}</td>
        <td class="text-center">${item.ID}</td>
        <td class="text-center">${item.Project}</td>
        <td class="text-center">${item.Start_Date}</td>
        <td class="text-center">${item.End_Date}</td>
        <td class="text-center"><button  class="btcur btn btn-outline-success" value="${item.TOR_File}" onclick="loadFile(this.value)">ดาวน์โหลด</button></td>
        <td class="text-center"><button  class="btcur btn btn-outline-success" value="${item.Description_File}" onclick="loadFile(this.value)">ดาวน์โหลด</button></td>
        <td class="text-center"><button  class="btcur btn btn-outline-info" value="${item.ID}" onclick="headingParticipant(this.value)">คลิก</button></td>
        ${manage}
        ${status}
      </tr>
        `
    );
    number++;
  }
}

async function loadFile(file) {
  const url = "api/get_file";
  // create a hidden element to simulate a click on the link
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = "api/get_file?file=" + file;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function headingEditPage(token) {
  window.location.href = "Edit-Project?token=" + token;
}

function headingParticipant(token) {
  window.location.href = "Participant?token=" + token;
}
