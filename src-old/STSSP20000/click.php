<script src="../../asset/js/sweetalert2-11.7.3.js"></script>
<script>
    const queryString = window.location.search;
    const URI = "/STSBidding/service/";

    console.log(queryString);

    const urlParams = new URLSearchParams(queryString);

    const checkProject = async (projectKey) => {
        let projectRaw = await fetch(
            URI + `STSSP20000/check.php?key=${projectKey}`,
        );
        let project = await projectRaw.json();
        if (projectRaw.status !== 200) {
            Swal.fire(
                {
                    title: "project is not allow",
                    text: `${project.err}`,
                    icon: "error",
                    confirmButtonText: "รับทราบ!",
                }
            )
            return;
        }

        let projectId = project.data.project.id;
        let userRaw = await fetch(
            URI + `STSSP20000/userPermission.php?pj_id=${projectId}`,
            {
                method: "GET"
            }
        );
        localStorage.setItem("pj_key", urlParams.get("key"));

        let user = await userRaw.json();
        if (userRaw.status !== 200) {
            location.href = "./login.php"
        } else {
            location.href = "./checker.php"
        }


    }


    checkProject(urlParams.get("key"));


// window.location.replace('./login.php');

</script>