fetch('https://isaac-repo.glitch.me/pages', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }).then(resp => resp.json())
    .then(data => {
        let searchParam = document.location.search;
        searchParam = searchParam.substring(1);
        let record = data.filter(child => child.Slug == searchParam);
        // console.log(record)
        createInterface(record)
    }).catch(e => console.error(e));

 function createInterface(record){
         let Pname = document.getElementById("ProjectName");
         let Pyear = document.getElementById("year");
         let Psub = document.getElementById("Subtitle");
        //  let Pcat = document.getElementById("Main-Category");
         let Pdesc = document.getElementById("Description");
         let Prole = document.getElementById("Role");
         let Pproccess = document.getElementById("extra-info");
        Pname.innerHTML = record[0]["Project Name"];
        Pyear.innerHTML = record[0].Year;
        Psub.innerHTML = record[0].Subtitle;
        // Pcat.innerHTML = record[0]["Main Category"];
        Pdesc.innerHTML = record[0].Description  
        Prole.innerHTML = record[0].Role;
        // console.log(record[0].Img1[i].url)
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

 }