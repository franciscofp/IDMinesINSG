const mineCards = document.getElementById("mineCards")
const loadMoreBtn = document.getElementById("load-more-btn")
const inputCompany = document.getElementById("input-company")
const inputIUP = document.getElementById("input-iup")
const inputProvince = document.getElementById("input-province")
const searchBtn = document.getElementById("search-btn")
const formSearch = document.getElementById("form-search")

formSearch.addEventListener("submit", (e)=>{
  e.preventDefault();
  show();
})


//Set up for each year
const date1 = '2025-03-31'  //most recent date
const date2 = '2024-03-31'  //last year
const date3 = '2023-03-31'  //and so on
const date4 = '2022-03-31'  //and so forth


fetch('translated_data.json')
  .then((res) => res.json())
  .then((data) => {
    minesDataArr = data;
    console.log("gotData")
  })
  .catch((err) => {
   mineCards.innerHTML = `<p class="error-msg">There was an error loading data. Error: ${err}</p>`;
  });


let selectedMines = []

 
const searchMine = (company, iup, location) => {
  selectedMines = []; // Clear previous results
  for (const mine of minesDataArr) {
    if (mine.attributes.nama_usaha.toLowerCase().includes(company.toLowerCase())) {
      selectedMines.push(mine);
    }
  }

};

  const show = () => {
    searchMine(inputCompany.value)
    mineCards.innerHTML = printMines(selectedMines);
  }

  const printMines = (mines) => {
    return mines.map((mine) => {
      const companyName = mine.attributes.nama_usaha;
      const mineID = mine.attributes.objectid;
      const status = mine.attributes.kegiatan;
      const iup = mine.attributes.sk_iup;
      const lat = mine.attributes.latitude;
      const long = mine.attributes.longitude;
      const area = mine.attributes.luas_sk;
      const img1src = `${companyName}_${mineID}_${date1}.png`;
      const img2src = `${companyName}_${mineID}_${date2}.png`;
      const img3src = `${companyName}_${mineID}_${date3}.png`;
      const img4src = `${companyName}_${mineID}_${date4}.png`;

      return `
        <div class="mine-card">
          <table class="mine-table" border="1" cellspacing="10" cellpadding="1">
          <tr><td class="company-name" colspan="2">${companyName.toProperCase()}</td></tr>
          <tr>
          <td>Status: ${status}</td><td>Area: ${area} hectares</td>
          <tr><td>IUP No.: ${iup}</td>
          <td><a href="https://apps.sentinel-hub.com/sentinel-playground/?source=S2L2A&lat=${lat}&lng=${long}&zoom=15&cloudCoverage=30&layerId=1-NATURAL-COLOR" target="_blank">Go to Area</a></td>
          </tr>
          </tr>
          <tr class=""image-tr">
          <td class="image-td"><figure><img class="mine-img" src="all_mine_img/${img1src}" alt="${companyName} ${date1}"><figcaption>${date1}</figcaption></td>
          <td class="image-td"><figure><img class="mine-img" src="all_mine_img/${img2src}" alt="${companyName} ${date2}"><figcaption>${date2}</figcaption></td>
          </tr>
          <tr>
          <td class="image-td"><figure><img class="mine-img" src="all_mine_img/${img3src}" alt="${companyName} ${date3}"><figcaption>${date3}</figcaption></td>
          <td class="image-td"><figure><img class="mine-img" src="all_mine_img/${img4src}" alt="${companyName} ${date4}"><figcaption>${date4}</figcaption></td>
          </tr>
          </table>
        </div>
      `;
    }).join('');  // Join all HTML strings into one
  };



String.prototype.toProperCase = function () {
    const exceptions = ["and","to"];
    return this.replace(/\w\S*/g, function(txt){
      const lower = txt.toLowerCase();
      if (exceptions.includes(lower)) return lower;
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };



// LIGHTBOX MODAL
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeBtn = document.querySelector(".modal .close");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let zoomLevel = 1;  // 1 = 100%, max 1.6 (3 clicks)


let imageList = [];  // store all mine-img elements
let currentIndex = 0;

// Initialize list after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  imageList = Array.from(document.querySelectorAll(".mine-img"));
});

// Open modal on image click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("mine-img")) {
    imageList = Array.from(document.querySelectorAll(".mine-img")); // refresh in case dynamic
    currentIndex = imageList.indexOf(e.target);
    showImage(currentIndex);
  }
});

// Show image at index
function showImage(index) {
    if (index < 0 || index >= imageList.length) return;
    const img = imageList[index];
    modalImg.src = img.src;
    document.getElementById("modalCaption").textContent = img.alt || "";
    zoomLevel = 3; //reset Zoom
    modalImg.style.transform = `scale(${zoomLevel})`
    modal.style.display = "block";
  }

// Navigation
rightArrow.onclick = () => {
  currentIndex = (currentIndex + 1) % imageList.length;
  showImage(currentIndex);
};

leftArrow.onclick = () => {
  currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
  showImage(currentIndex);
};

// Close logic
closeBtn.onclick = () => modal.style.display = "none";

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") modal.style.display = "none";
  if (e.key === "ArrowRight") rightArrow.click();
  if (e.key === "ArrowLeft") leftArrow.click();
});

modal.onclick = function (e) {
  if (e.target === modal) modal.style.display = "none";
};

//Zoom when Modal Image is clicked
modalImg.onclick = (e) => {
  e.stopPropagation(); // Prevent modal from closing
  if (zoomLevel < 6) {
    zoomLevel += 1;
    modalImg.style.transform = `scale(${zoomLevel})`;
  } else {
    zoomLevel = 1;
    modalImg.style.transform = `scale(${zoomLevel})`;
  }
};
