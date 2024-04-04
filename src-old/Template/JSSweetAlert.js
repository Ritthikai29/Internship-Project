class SweetAlert {
  constructor(selectOptions = null) {
    this.selectOptions = selectOptions;
    this.selectHtmlcontent = `
          <select class='form-select' name='reason_select' id='reason_select' required> 
            <option selected disabled value=''>เลือกเหตุผล</option> 
          <textarea id='reason' class='formbold-form-input' placeholder='ระบุหมายเหตุเพิ่มเติม'></textarea>
    `;
    this.inputHtmlcontent = `<input type="text" id="input_field" class="formbold-form-input">`;
  }

  showInputAlert(callback, title = "กรุณากรอกข้อมูล") {
    Swal.fire({
      icon: "info",
      title: title,
      html: this.inputHtmlcontent,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",

      preConfirm: () => {
        const input_field = Swal.getPopup().querySelector("#input_field").value;
        if (!input_field) {
          Swal.showValidationMessage("กรุณากรอกข้อมูล");
        }
        return { input_field: input_field };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await callback(result.value.input_field);
      }
    });
  }

  showConfirmAlert(callback, text = "คุณแน่ใจจะยืนยันหรือไม่?") {
    Swal.fire({
      title: "ยืนยันการดำเนินการ",
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await callback();
      }
    });
  }

  showCancelAlert(callback, text = "คุณแน่ใจจะปฏิเสธหรือไม่?") {
    Swal.fire({
      title: "ยืนยันการดำเนินการ",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D91A1A",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",
    }).then(async (result) => {
      if (result.isConfirmed) {
       await callback();
      }
    });
  }

  showDecisionAlert(callback1, callback2) {
    Swal.fire({
      title: "เลือกการดำเนินการ",
      text: this.text,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "ยอมรับ",
      denyButtonText: "ปฏิเสธ",
      cancelButtonText: "ปิด",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await callback1();
      }
      if (result.isDenied) {
        Swal.fire({
          title: "โปรดระบุเหตุผล",
          icon: "warning",
          html: this.selectHtmlcontent,
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ปิด",
          didOpen: () => {
            // Populate the options of the select element
            const selectElement =
              Swal.getPopup().querySelector("#reason_select");
            this.selectOptions.forEach((option) => {
              const optionElement = document.createElement("option");
              optionElement.value = option.value;
              optionElement.textContent = option.label;
              selectElement.appendChild(optionElement);
            });
          },
          preConfirm: () => {
            const selected =
              Swal.getPopup().querySelector("#reason_select").value;
            const reason = Swal.getPopup().querySelector("#reason").value;
            if (!selected) {
              Swal.showValidationMessage("กรุณาเลือกเหตุผล");
            }
            return { selected: selected, reason: reason };
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            await callback2(result.value.selected, result.value.reason);
          }
        });
      }
    });
  }

  showLoadingAlert() {
    Swal.fire({
      title: "Loading",
      text: "โปรดรอสักครู่...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  showSuccessAlert(callback = null, text) {
    Swal.fire({
      title: "สำเร็จ",
      text: text,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    }).then(async (result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        if (callback) {
          await callback();
        }
      }
    });
  }

  showErrorAlert(callback = null, text) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: text,
      icon: "error",
      confirmButtonColor: "#D91A1A",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (callback) {
          await callback();
        }
      }
    });
  }
}

// <!-- <script>
// $("document").ready(async () => {
//   selectOptions = [{
//       value: "1",
//       label: "Option 1"
//     },
//     {
//       value: "2",
//       label: "Option 2"
//     },
//     {
//       value: "3",
//       label: "Option 3"
//     },
//   ];

//   confirmAlert = new SweetAlertClass('ยืนยันส่งฟอร์ม', 'Test', selectOptions);
//   confirmAlert.showDecisionAlert(test1, test2);

//   function test1() {
//     console.log(5);
//   }

//   async function test2() {
//     let url = "https://newsapi.org/v2/everything?q=tesla&from=2023-03-25&sortBy=publishedAt&apiKey=a7918e7702114e4caa4901df2b38fe5b";
//     let jsonData = await FetchAPI.getData(url);
//   }
// });
// </script> -->