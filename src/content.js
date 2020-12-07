  let projectLocation, dataHandler, record;
  let timetxt = document.getElementById("time");
fetch('https://isaac-repo.glitch.me/pages', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }).then(resp => resp.json())
    .then(data => {
        dataHandler = data;
        let searchParam = document.location.search;
        searchParam = searchParam.substring(1);
        record = data.filter(child => child.Slug == searchParam);
        projectLocation = dataHandler.findIndex(x => x.Slug === record[0].Slug)
        let current = document.getElementById("current");
        current.innerHTML = '#' + projectLocation;
        console.log(dataHandler)
        createInterface(record, dataHandler)
    }).catch(e => console.error(e));

 function createInterface(record, dataHandler){
         console.log(dataHandler)
         let Pname = document.getElementById("ProjectName");
         let Pyear = document.getElementById("year");
         let Psub = document.getElementById("Subtitle");
         let Pdesc = document.getElementById("Description");
         let Prole = document.getElementById("Role");
         let Pproccess = document.getElementById("extra-info");
         let PfinalProjectSrc = document.getElementById("live-link");
         let nextProjectSrc = document.getElementById("next-work-link");
         let backProjectSrc = document.getElementById("back-work-link");
        Pname.innerHTML = record[0]["Project Name"];
        Pyear.innerHTML = record[0].Year;
        Psub.innerHTML = record[0].Subtitle;
        Pdesc.innerHTML = record[0].Description  
        Prole.innerHTML = record[0].Role;
        let imgLength = record[0].Img1.length
         for(i=0;i<imgLength;i++){
             var img = document.createElement('img'); 
             img.src = record[0].Img1[i].url
            document.getElementById('img-handler').appendChild(img); 
         }
        Pproccess.innerHTML = record[0].Process 
        let techLength = record[0].Technology.length;
        for(i=0;i<techLength;i++){
            var txtNode = document.createElement("P"); 
            txtNode.innerHTML = record[0].Technology[i];
            document.getElementById("tech-stack").appendChild(txtNode); 
         }
         PfinalProjectSrc.href = record[0]["Project Final Src"];
         let nextProjectBtn = document.getElementById('nxt-project');
         nextProjectBtn.addEventListener("click", () => {
            projectLocation  = (projectLocation + 1) % dataHandler.length;
            if (projectLocation === 0){
                projectLocation = 1; 
            }
            console.log(projectLocation)
            var nextProjectHref = 'content.html?' + dataHandler[projectLocation].Slug;
            nextProjectSrc.href = nextProjectHref
        });

        let backwards =  document.getElementById('back-project');
        backwards.addEventListener("click", () => {
          if (projectLocation == 1){
            projectLocation = dataHandler.length 
        }
          projectLocation  = (projectLocation - 1) % dataHandler.length;
          var backProjectHref = 'content.html?' + dataHandler[projectLocation].Slug;
          backProjectSrc.href = backProjectHref
      });

 }