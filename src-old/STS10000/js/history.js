async function loadData() {
  const url = "api/get_history";
  const jsonData = await FetchAPI.getData(url);

  // Clear the table
  $("#item-box").empty();

  // Populate the box
  for (const item of jsonData.data) {
    let status;
    switch (item.Status){
      case "เสร็จสิ้น":
        status = `<td style="color:green">${item.Status}</td>`;
        break;
      case "ล้ม":
        status = `<td style="color:red">${item.Status}</td>`;
        break;
    }

      $("#item-box").append(
        `<div class="col-lg-6  m-auto line1">
            <div class="col"><h5 class="card-title">ชื่อโครงการ: ${item.Project}</h5></div>

              <div class="row">
                <div class="col-8"><h5 class="card-title2">เลขที่เอกสาร: ${item.ID}</h5></div>
                <div class="col-4"><h5 class="card-title2">สถานะ: ${item.Status}</h5></div>
              </div>

              <div class="row">
                <div class="col-8"><h5 class="date-add">วันที่เพิ่ม: ${item.Start_Date}</h5></div>
                <div class="col-4"><h5 class="date-ex">วันที่สิ้นสุด:  ${item.End_Date}</h5></div>
              </div>

          <div class="row line2">
            <div class="col" value="${item.TOR_File}" onclick="loadFile(this.value)"><button type="button" class="bt1"><i class="bi bi-file-earmark-arrow-down-fill"></i> TOR</button></div>
            <div class="col" value="${item.Description_File}" onclick="loadFile(this.value)"><button type="button" class="bt2"><i class="bi bi-file-earmark-arrow-down-fill"></i> ใบแจ้งงาน</button></div>
            <div class="col" value="${item.ID}" onclick="headingParticipant(this.value)"><button type="button" class="bt3">ผู้มีส่วนร่วม</button></div>
          </div>
      </div>`
      );
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

function headingParticipant(token) {
  window.location.href = "Participant?token=" + token;
}
