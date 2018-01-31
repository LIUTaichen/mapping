var mymap = L.map('mapid').setView([-36.914827, 174.8072903 ], 12);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFzb25saXV0YWljaGVuIiwiYSI6ImNqNmZ5ZGpkcjAzYWIzNXA1aWs5OXF3bXcifQ.33nis-JWUXYo1jpJkr1OSQ'
}).addTo(mymap);




//marker.bindPopup('<p>projects</p>');
//marker.addTo(mymap);
function loadFromJson(){
    $.getJSON("projects.json", function(json) {
        console.log(json); // this will show the info it in firebug console
        
        for(const project of json){
            var marker = L.marker([project.Lat,project.Lng]);
            var descriptionHtml = '';
            descriptionHtml += '<div><p>' + project['Job ID and Title'] +'</p></div>';
            descriptionHtml += '<p>' + project['Site Address'] +'</p></div>';
            descriptionHtml += '<p>' + project['Contacts'] +'</p></div>';
            descriptionHtml += '<div class="plants">';
            //descriptionHtml += '<p>' + project['Booked'] +'</p></div>';
            //descriptionHtml += '<p>' + project['Requires Booking'] +'</p></div>';
            //descriptionHtml += '<p>' + project['Completed'] +'</p></div>';
            if(project['Booked'].trim()){
                descriptionHtml += '<h3>Booked Plants</h3>';
                descriptionHtml += '<table class="plantTable blue"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
                var bookedString = project['Booked'];
                var bookedPlants = bookedString.split('\n');
                for(const plant of bookedPlants){
                    if(plant.includes('[')){
                        let parts = plant.split('] [');
                        for(let i = 0; i <=2; i++){
                            parts[i] = parts[i].replace('[', '');
                            parts[i] = parts[i].replace(']', '');
                            parts[i] = parts[i].replace('Device type:', '');
                            parts[i] = parts[i].trim();
                        }
                    
                        descriptionHtml += '<tr><td>' +parts[0] +'</td><td>' + parts[1] + '</td><td>' + parts[2]+'</td></tr>'; 
                    }
                }
            }
            if(project['Requires Booking'].trim()){
                descriptionHtml += '<h3>Plants requiring booking</h3>';
                descriptionHtml += '<table class="plantTable pink"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
                var requireString = project['Requires Booking'];
                var requirePlants = requireString.split('\n');
                for(const plant of requirePlants){
                    if(plant.includes('[')){
                        let parts = plant.split('] [');
                        for(let i = 0; i <=2; i++){
                            parts[i] = parts[i].replace('[', '');
                            parts[i] = parts[i].replace(']', '');
                            parts[i] = parts[i].replace('Device type:', '');
                            parts[i] = parts[i].trim();
                        }
                    
                        descriptionHtml += '<tr><td>' +parts[0] +'</td><td>' + parts[1] + '</td><td>' + parts[2]+'</td></tr>'; 
                    }
                }
            }
            if(project['Completed'].trim()){
                descriptionHtml += '<h3>Plants completed</h3>';
                descriptionHtml += '<table class="plantTable lightGreen"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
                var completedString = project['Completed'];
                var completedPlants = completedString.split('\n');
                for(const plant of completedPlants){
                    if(plant.includes('[')){
                        let parts = plant.split('] [');
                        for(let i = 0; i <=2; i++){
                            parts[i] = parts[i].replace('[', '');
                            parts[i] = parts[i].replace(']', '');
                            parts[i] = parts[i].replace('Device type:', '');
                            parts[i] = parts[i].trim();
                        }
                    
                        descriptionHtml += '<tr><td>' +parts[0] +'</td><td>' + parts[1] + '</td><td>' + parts[2]+'</td></tr>'; 
                    }
                }
            }
            descriptionHtml += '</div>';
            //console.log(bookedPlants);
            marker.bindPopup(descriptionHtml);
            marker.addTo(mymap);
                
        }
    
        
    });
}


function processData(){
   
    console.log(plants);
    console.log(projects);
    var projectArray = {};
    for(let project of projects){
        //convert rows to array
        projectArray[project['Job ID']] = project;
    }

    for(let plant of plants){
        if(!plant['Department'] || !projectArray[plant['Department']]){
            continue;
        }
        if(!plant['GPS'] && !plant['Excavator Kit'] && !plant['Oyster']){
            continue;
        }

        let project = projectArray[plant['Department']];
        if(plant['GPS Installation'] === 'Booked'){
            if(!project['Booked'] ){
                project['Booked'] = [];
            }
            project['Booked'].push(plant);
        }else if(plant['GPS Installation'] === 'Completed'){
            if(!project['Completed'] ){
                project['Completed'] = [];
            }
            project['Completed'].push(plant);

        }
        else if(plant['GPS Installation'] === ''){
            if(!project['Requires Booking'] ){
                project['Requires Booking'] = [];
            }
            project['Requires Booking'].push(plant);
        }
    }

    for(let project of projects){

        if(project['Requires Booking']){
          
            let yellowFleetAssetCategories =["Tippers",
            "Motor Scrapers",
            "Hydraulic Excavators",
            "Tractors",
            "Bulldozers",
            "Dump Trucks",
            "Wheel Loaders",
            "Rollers",
            "Heavy Machinery",
            "Compactors Hd Earthmoving",
            "Motor Graders"];
            let vehicles = [];
            let smallPlants = [];
            let yellowFleet = [];
            for(let plant of project['Requires Booking']){
    
                if(yellowFleetAssetCategories.includes(plant['Asset Type'])){
                    yellowFleet.push(plant);
                }else if(plant['GPS']){
                    vehicles.push(plant);
                }else{
                    smallPlants.push(plant);
                }
            }
            project['vehiclesRequired'] = vehicles;
            project['yellowFleetRequired'] = yellowFleet;
            project['smallPlantsRequired'] = smallPlants;
            console.log("project when assembling");   
            console.log(project);
    
        }
    }
    console.log("projects");   
    console.log(projects);  
    drawMarkers(projects);
   
}

function convertRowToObject(data){
    var headers = data.values[0];
    console.log('headers');
    console.log(headers);
    var result = [];
    for(let i = 1; i < data.values.length; i++){
            var item = {};
            for(let j = 0; j < headers.length; j ++){
                item[headers[j]] = data.values[i][j]; 
            }
            result.push(item);
    }
    return result;
}

function drawMarkers(projects){
    for(const project of projects){
        if(project['Requires Booking'] || project['Completed']){
            let marker;
            marker = L.marker([project.Lat,project.Lng],{
                icon: new L.AwesomeNumberMarkers({
                    number: 1,
                    markerColor:"blue"
                })
            });
             if(project['yellowFleetRequired'] && project['yellowFleetRequired'].length){
                marker = L.marker([project.Lat,project.Lng],{
                    icon: new L.AwesomeNumberMarkers({
                        number: project['yellowFleetRequired'].length,
                        markerColor:"orange"
                    })
                });

            }
        
            else if(project['vehiclesRequired'] && project['vehiclesRequired'].length){
                marker = L.marker([project.Lat,project.Lng],{
                    icon: new L.AwesomeNumberMarkers({
                        number: project['vehiclesRequired'].length,
                        markerColor:"red"
                    })
                });

            }
        
            else if(project['smallPlantsRequired'] && project['smallPlantsRequired'].length){
                marker = L.marker([project.Lat,project.Lng],{
                    icon: new L.AwesomeNumberMarkers({
                        number: project['smallPlantsRequired'].length,
                        markerColor:"purple"
                    })
                });
            }
           
            let descriptionHtml = preparePopupHtml(project);
            marker.bindPopup(descriptionHtml);
            marker.addTo(mymap);
        }

    }
    
}

function preparePopupHtml(project){
    let htmlString = '';
    htmlString += '<div><p>' + project['Job ID and Title'] +'</p></div>';
    htmlString += '<div><p>' + project['Site Address'] +'</p></div>';
    htmlString += '<div><p> PM : ' + project['PM'] +'  ' +'<a href="mailto:'+project['PM email']+'">'+ project['PM email'] +'</a>  ' +project['PM contact']+'</p></div>';
    htmlString += '<div><p> QS : ' + project['QS'] +'  ' +'<a href="mailto:'+project['QS email']+'">'+ project['QS email'] +'</a>  ' +project['QS contact']+'</p></div>';
    htmlString += '<div><p> AM : ' + project['AM'] +'  ' +'<a href="mailto:'+project['AM email']+'">'+ project['AM email'] +'</a>  ' +project['AM contact']+'</p></div>';
    htmlString += '<div class="plants">';
    if(project['Booked']){
        htmlString += '<h3>Booked Plants</h3>';
        htmlString += '<table class="plantTable blue"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
        for(let plant of project['Booked']){
         
            htmlString += convertPlantToTableRow(plant);
        }
        htmlString += '</table>';
    }
     
    if(project['yellowFleetRequired'] && project['yellowFleetRequired'].length){
        console.log("yellowFleet");
        console.log(project['yellowFleetRequired']);
        htmlString += '<h3>Yellow Fleet requiring booking</h3>';
        htmlString += '<table class="plantTable yellow"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
        for(let yellow of project['yellowFleetRequired']){
            htmlString += convertPlantToTableRow(yellow);
        }
        htmlString += '</table>';
    }

    if(project['vehiclesRequired'] && project['vehiclesRequired'].length){
        console.log("vehicles");
        console.log(project['vehiclesRequired']);
        htmlString += '<h3>Vehicles requiring booking</h3>';
        htmlString += '<table class="plantTable red"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
        for(let vehicle of project['vehiclesRequired']){
            htmlString += convertPlantToTableRow(vehicle);
        }
        htmlString += '</table>';
    }

    if(project['smallPlantsRequired'] && project['smallPlantsRequired'].length){
        console.log("smallPlants");
        console.log(project['smallPlantsRequired']);
        htmlString += '<h3>Small plants requiring booking</h3>';
        htmlString += '<table class="plantTable purple"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
        for(let smallPlant of project['smallPlantsRequired']){
            htmlString += convertPlantToTableRow(smallPlant);
        }
        htmlString += '</table>';
    }
    
    
    if(project['Completed']){
        htmlString += '<h3>Plants completed</h3>';
        htmlString += '<table class="plantTable lightGreen"><tr><th>Plant #</th><th>Description</th><th>Device Needed</th>';
        for(let plant of project['Completed']){
            htmlString += convertPlantToTableRow(plant);
        }
     
        htmlString += '</table>';
    }
    htmlString+='</div>';
    return htmlString;

}

function convertPlantToTableRow(plant){
    let deviceString = '';
    if(plant['GPS']){
        deviceString += ' GPS';
    }
    if(plant['Excavator Kit']){
        deviceString += ' Excavator Kit';
    }
    if(plant['Oyster']){
        deviceString += ' Oyster';
    }
    return '<tr><td>' +plant['Plant #'] +'</td><td>' + plant['Description'] + '</td><td>' + deviceString+'</td></tr>'; 
}