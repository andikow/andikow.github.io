const API_KEY = "a74f6ea25f3b4e0da2934137d6973bf4";
const BASE_URL = "https://api.football-data.org/v2/";

const ALL_LEAGUE_ID=['2000','2001','2002','2003','2013','2014','2015','2016','2017','2018','2019','2021'];

let LEAGUE_ID = "";
LEAGUE_ID = 2021;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/`;
let ENDPOINT_STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
let ENDPOINT_TEAMS_BY_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;

let idTeam ="";
let ENDPOINT_TEAMS_DETAIL = `${BASE_URL}/teams/${idTeam}`;

const fetchAPI = url => {
    return fetch(url, {
      headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function getAllStandings() {
    if ("caches" in window) {
        caches.match(ENDPOINT_STANDINGS).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_STANDINGS)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showStanding(data) {

    let standings = "";
    let standingElement =  document.getElementById("homeStandings");

    data.standings[0].table.forEach(function (standing) {
        standings += `
                <tr>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
    });

     standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px;">
                  <table class="striped responsive-table">
                      <thead>
                          <tr>
                              <th></th>
                              <th>Team Name</th>
                              <th>W</th>
                              <th>D</th>
                              <th>L</th>
                              <th>P</th>
                              <th>GF</th>
                              <th>GA</th>
                              <th>GD</th>
                          </tr>
                       </thead>
                      <tbody id="standings">
                          ${standings}
                      </tbody>
                  </table>
                </div>
    `;
}

function getAllCompetition() {
  if ("caches" in window) {
      caches.match(ENDPOINT_COMPETITION).then(function (response) {
          if (response) {
              response.json().then(function (data) {
                  console.log("Competition Data: " + data);
                  showStanding(data);
              })
          }
      })
  }

  fetchAPI(ENDPOINT_COMPETITION)
  .then(data => {
    showCompetition(data);
  })
  .catch(error => {
    console.log(error)
  })

}

function showCompetition(data) {
  let competitions ="";
  let competitionsElement = document.getElementById("leagueList");
  for(let i = 0; i < ALL_LEAGUE_ID.length; i++){

    for(let j = 0; j < data.competitions.length; j++)
    {
      if(data.competitions[j].id == ALL_LEAGUE_ID[i])
      {
        competitions += `<li href="${ALL_LEAGUE_ID[i]}" class="collection-item leagueItem hoverable">${data.competitions[j].name}</li>`;
      }
    };

  };
  competitionsElement.innerHTML = competitions;
}

function getAllTeamsByCompetitions(ENDPOINT_TEAMS_BY_COMPETITION) {
    if ("caches" in window) {
        caches.match(ENDPOINT_TEAMS_BY_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showTeams(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_TEAMS_BY_COMPETITION)
        .then(data => {
            showTeams(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showTeams(data) {
  let teams ="";
  let teamElement = document.getElementById("dropdownTeams");
  data.teams.forEach(function (team) {
    teams += `
          <li><a id ="${team.id}" href="#">${team.name}</a></li>
    `
  })
  teamElement.innerHTML = teams;
}

function getTeamDetail(idTeam) {
    ENDPOINT_TEAMS_DETAIL = `${BASE_URL}teams/${idTeam}`;
    if ("caches" in window) {
        caches.match(ENDPOINT_TEAMS_DETAIL).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showTeamDetail(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_TEAMS_DETAIL)
        .then(data => {
            showTeamDetail(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showTeamDetail(data) {
    let teamDetail = "";
    let players = "";
    let teamDetailElement = document.getElementById("teamDetail");
    data.squad.forEach(function(player) {
      playerShirtNumber = player.shirtNumber ? player.shirtNumber : "-";
      players += `
          <tr>
              <td>${player.name}</td>
              <td>${player.position}</td>
              <td>${player.dateOfBirth}</td>
              <td>${player.countryOfBirth}</td>
              <td>${player.nationality}</td>
              <td>${playerShirtNumber}</td>
              <td>${player.role}</td>
          </tr>
      `
    })
    teamDetailElement.innerHTML =`
          <div class="col s12 l4">
          <img class = "card col s12 l12" src="${data.crestUrl}" width="150px;" style="">
            <a id = "save" class="btn-floating btn-large waves-effect waves-light .accent-color hoverable"><i class="material-icons">favorite_border</i></a>
          </div>
          <div class = "col s6 l4">
              <p class="title-detail">Name</p>
              <p class="title-detail">Short Name</p>
              <p class="title-detail">TLA</p>
              <p class="title-detail">Address</p>
              <p class="title-detail">Phone</p>
              <p class="title-detail">Website</p>
              <p class="title-detail">Founded</p>
              <p class="title-detail">Club Colors</p>
          </div>

          <div class = "col s6 l4">
              <p>${data.name}</p>
              <p>${data.shortName}</p>
              <p>${data.tla}</p>
              <p>${data.address}</p>
              <p>${data.phone}</p>
              <p>${data.website}</p>
              <p>${data.founded}</p>
              <p>${data.clubColors}</p>
          </div>

          <div class = " card col s12 l12">
              <table class="striped responsive-table" style="padding-left: 24px; padding-right: 24px;">
              <thead>
              <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Date Of Birth</th>
              <th>Country Of Birth</th>
              <th>Nationality</th>
              <th>Shirt Number</th>
              <th>Role</th>
              </tr>
              </thead>
              <tbody id="playerData">
              ${players}
              </tbody>
              </table>
          </div>

    `;
    let saveFAB = document.getElementById("save");
    saveFAB.addEventListener("click", function(event) {
          M.toast({html: 'Team Berhasil Disimpan'})
          const team = {
              idTeam: data.id,
              crestUrl: data.crestUrl,
              name: data.name,
              shortName: data.shortName,
              tla: data.tla,
              address: data.address,
              phone: data.phone,
              website: data.website,
              founded: data.founded,
              clubColors: data.clubColors,
          };
          dbsaveTeam(team);
    })

}

function changeStandings(changeCompetition) {
  LEAGUE_ID = changeCompetition;
  ENDPOINT_STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
  getAllStandings();

}

function changeTeamsByCompetition(changeCompetition) {
  LEAGUE_ID = changeCompetition;
  ENDPOINT_TEAMS_BY_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
  getAllTeamsByCompetitions(ENDPOINT_TEAMS_BY_COMPETITION);
}
