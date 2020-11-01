document.addEventListener("DOMContentLoaded", function() {
  // Activate sidebar nav
  let elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            // Tutup sidenav
            let sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  // Load page content
  let page = window.location.hash.substr(1);
  if (page == "") page = "standings";
  loadPage(page);

  function loadPage(page) {

   let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

      if (this.readyState == 4) {
        let content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          loadScript(page);
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }

  function loadScript(page) {
  switch (page){
    case 'standings':
    getAllStandings();
    getAllCompetition();
    leagueClick();
    break;

    case 'teams':
    let elems = document.querySelectorAll('.dropdown-trigger');
    let instances = M.Dropdown.init(elems);
    getAllCompetition();
    leagueClick();
    teamClick();
    break;

    case 'saved':
    showAllTeams();
    break;

  }
}

  function leagueClick() {
    document.querySelectorAll("#leagueList").forEach(function(elm) {

      elm.addEventListener("click", function(event) {
        activeElm = document.querySelector(".active");
        if(activeElm != null)
        {
          activeElm.classList.remove("active");
        }
        event.target.setAttribute('class','collection-item leagueItem active');
        let changeCompetition = event.target.getAttribute("href");
        switch (page) {
          case 'teams':
            changeTeamsByCompetition(changeCompetition);
            document.getElementById("dropdownList").innerText = "--Choose a team--";
            break;
          default:
            changeStandings(changeCompetition);
            break;

        }
      })

    })

  }

  function teamClick() {
    document.querySelectorAll("#dropdownTeams").forEach(function(elm) {
      elm.addEventListener("click",function(event) {
        let idTeam = event.target.getAttribute("id");
        let teamName = event.target.innerText;
        document.getElementById("dropdownList").innerText = teamName;
        getTeamDetail(idTeam);
      })
    })
  }

  function showAllTeams() {
    dbGetAllTeam().then(teams => {
      let listSavedTeam = "";
      teams.forEach(team => {
      listSavedTeam += `
          <div class="col s12 l4">
            <div class="card">
              <div class="card-image">
                <img src="${team.crestUrl}" height="250em;">
              </div>
              <div class="card-content" style="text-align:center;">
                <p>${team.name}</p>
              </div>
              <div class="card-action">
                <a id = "${team.idTeam}" class="removeTeam">Remove From Favorites</a><br>
                <a id = "${team.idTeam}" class="getTeamDetail">Get Details</a>
              </div>
            </div>
          </div>
      `
      });
      savedTeamresult.innerHTML = listSavedTeam;
      if (document.querySelectorAll(".removeTeam") || document.querySelectorAll(".getTeamDetail")) {

        document.querySelectorAll(".removeTeam").forEach(function(elm){
          elm.addEventListener("click", function(event) {
            removeTeamid = Number(event.target.id);
            dbRemoveTeam(removeTeamid).then(showAllTeams());
          })
        })

        document.querySelectorAll(".getTeamDetail").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            team = Number(event.target.id);
            dbGetTeam(team).then(data => {
              getSavedTeamDetail(data);
            });
          })
        })

      }


    })
  }

  function getSavedTeamDetail(data) {
      document.getElementById("savedTeamresult").setAttribute("style","display:none;")
      let savedTeamDetail = document.getElementById("savedTeamDetail");
      let viewTeamDetail = "";
      viewTeamDetail += `
      <div class="col">
      <img class = "card col s12 l4" src="${data.crestUrl}" width="150px;">
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
      `;
    savedTeamDetail.innerHTML = viewTeamDetail;
  }

});
