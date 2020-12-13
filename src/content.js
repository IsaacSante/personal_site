let projectLocation, record;
var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
'appvMjgA3Di00eDev'
);  
  base('Work').select({
    view: "Grid view"
  }).eachPage(function page(records) {
    let searchParam = document.location.search;
    searchParam = searchParam.substring(1);
    record = records.filter(x => x.fields.Slug == searchParam)
    projectLocation = records.findIndex(x => x.fields.Slug === record[0].fields.Slug)
    record = record[0].fields
    console.log(projectLocation)
    let current = document.getElementById("current");
    current.innerHTML = 'Project ' + projectLocation + ' - ' + record["Main Category"];
    document.body.style.backgroundColor = record.backgroundColor
    createInterface(record, records)
  }, function done(err) {
    if (err) { console.error(err); return; }
  });
 function createInterface(record, records){
         let Pname = document.getElementById("ProjectName");
         let Pyear = document.getElementById("year");
         let Psub = document.getElementById("Subtitle");
         let Pdesc = document.getElementById("Description");
         let Prole = document.getElementById("Role");
         let Pproccess = document.getElementById("extra-info");
         let PfinalProjectSrc = document.getElementById("live-link");
         let nextProjectSrc = document.getElementById("next-work-link");
         let backProjectSrc = document.getElementById("back-work-link");
        Pname.innerHTML = record["Project Name"];
        Pyear.innerHTML = 'Year  - ' + record.Year;
        Psub.innerHTML = record.Subtitle;
        Pdesc.innerHTML = record.Description  
        Prole.innerHTML = 'Role  - ' + record.Role;
        PfinalProjectSrc.href = record["Project Final Src"];
        Pproccess.innerHTML = record.Process 
        let techLength = record.Technology.length;

            for(i=0;i<techLength;i++){
                var txtNode = document.createElement("P"); 
                  txtNode.innerHTML = record.Technology[i];
                  document.getElementById("tech-stack").appendChild(txtNode);
                  txtNode.style.color = (record.backgroundColor)
            }

            if(record.viz){
              var vizLink = document.createElement('iframe'); 
                vizLink.src = record.viz
                document.getElementById('img-handler').appendChild(vizLink); 
                vizLink.classList.add("data-viz");
            }

            if(record.yt){
              var vidLink1 = document.createElement('iframe'); 
                vidLink1.width="560" ;
                vidLink1.height="315" ;
                vidLink1.src = record.yt
                document.getElementById('img-handler').appendChild(vidLink1); 
                vidLink1.setAttribute('allowFullScreen', '')
            }

         if(record["Extra Links"]){
          var vidLink = document.createElement('iframe'); 
            vidLink.width="560" ;
            vidLink.height="315" ;
            vidLink.src = record["Extra Links"]
            document.getElementById('img-handler').appendChild(vidLink); 
            vidLink.setAttribute('allowFullScreen', '')
         }

        let imgLength = record.Img1.length;
         for(i=0;i<imgLength;i++){
             var img = document.createElement('img'); 
              img.src = record.Img1[i].url
              document.getElementById('img-handler').appendChild(img); 
         }

         let nextProjectBtn = document.getElementById('nxt-project');
            nextProjectBtn.addEventListener("click", () => {
                projectLocation  = (projectLocation + 1) % records.length;
                      if (projectLocation === 0){
                          projectLocation = 1; 
                      }
                var nextProjectHref = 'content.html?' + records[projectLocation].fields.Slug;
                    nextProjectSrc.href = nextProjectHref
        });

        let backwards =  document.getElementById('back-project');
          backwards.addEventListener("click", () => {
            if (projectLocation == 1){
              projectLocation = records.length 
          }
            projectLocation  = (projectLocation - 1) % records.length;
            var backProjectHref = 'content.html?' + records[projectLocation].fields.Slug;
            backProjectSrc.href = backProjectHref
      });
 }