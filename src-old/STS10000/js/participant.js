async function populateCommittee(jsonData) {
  if (jsonData) {
    $("#committee-table tbody").empty();

    for (item of jsonData) {
      $("#committee-table tbody").append(`
      <tr>
        <td>${item.First_Name + " " + item.Last_Name}</td>
        <td>${item.Tel}</td>
        <td>${item.Email}</td>
        <td>${item.Role}</td>
      </tr>

        `);
    }
  }
}
async function populateVendor(jsonData) {
  if (jsonData) {
    $("#vendor-table tbody").empty();
    for (item of jsonData) {
      let status = `<td>${item.Status}</td>`
      switch(item.Status_ID){
        case 2: status = `<td style="color:red;">${item.Status}</td>`
          break;
        case 8: status = `<td style="color:red;">${item.Status}</td>`
          break;
        case 11 : status = `<td style="color:green;">${item.Status}</td>`
          break;
        case 12: status = `<td style="color:red;">${item.Status}</td>`
          break;
      }
      $("#vendor-table tbody").append(`
      <tr>
        <td>${item.Company}</td>
        ${status}
        <td>${item.Bid ? item.Bid : '-'}</td>
        <td>${item.Negotiate ? item.Negotiate : '-'}</td>
      </tr>
      `);
    }
  }
}
