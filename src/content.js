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
        createInterface(record)
    }).catch(e => console.error(e));

 function createInterface(record) {
     console.log(record)
         let Pname = document.getElementById("ProjectName");
         let Psub = document.getElementById("Subtitle");
         let Pcat = document.getElementById("Main-Category");
         let Pdesc = document.getElementById("Description");
         let Prole = document.getElementById("Role");

        Pname.innerHTML = record[0]["Project Name"];
        Psub.innerHTML = record[0].Subtitle;
        Pcat.innerHTML = record[0]["Main Category"];
        Pdesc.innerHTML = record[0].Description  
        Prole.innerHTML = record[0].Role;
 }