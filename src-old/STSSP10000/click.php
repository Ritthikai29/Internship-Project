<script>
    const queryString = window.location.search;
    const URI = "/STSBidding/service/";

    console.log(queryString);

    const urlParams = new URLSearchParams(queryString);

    const checkProject = async (projectKey) => {
        let projectRaw = await fetch(
            URI + `STSSP10000/check.php?project_key=${projectKey}`
        )
        let project = await projectRaw.json();
        if (project.status !== 200) {
            console.log(project.err)
            return;
        }

        /**
         * decode a projectId from json data
         * @var int
         */
        let projectId = project.data.project.id;
        
        
        /**
         * check user is have a permission in this project
         * if have rederect to calculate
         * if not fave redirect to login
         */
        let userRaw = await fetch(
            URI + `STSSP10000/userPermission.php`,
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        "projectId" : projectId
                    }
                )
            }
        );
        
        let user = await userRaw.json();
        if(user.status !== 200){
            window.location.replace('./login.php')
        }else{
            localStorage.setItem("u_id", user.data.user_staff_id);
            localStorage.setItem("pj_id", user.data.project_id);
            localStorage.setItem("m_id", user.data.id);
            window.location.replace('./calculate.php')
        }
        console.log(project)



    }

    localStorage.setItem("pj_key", urlParams.get("key"));
    // localStorage.setItem("next", urlParams.get("next"));
    checkProject(urlParams.get("key"));
    // window.location.replace('./login.php');
</script>