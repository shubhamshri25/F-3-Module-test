const btn = document.getElementById("btn");
const lat = document.getElementById("lat");
const long = document.getElementById("long");
const city = document.getElementById("city");
const region = document.getElementById("region");
const org = document.getElementById("org");
const host = document.getElementById("host");
const map = document.getElementById("map");
const timeZone = document.getElementById("time-zone");
const dateTime = document.getElementById("date-time");
const pincode = document.getElementById("pincode");
const message = document.getElementById("message");
const ipAddress = document.getElementById("ip-add");

let ip, pincodeVal;
let postOffices = [];

// getting the uers's ip adress on load of body
function getIpAddress() {
  fetch("https://api.ipify.org/?format=json")
    .then((res) => res.json())
    .then((data) => {
      ipAddress.innerText = data.ip;
      ip = data.ip;
    });
}

function showInfo() {
  getInfo(ip);
  document.getElementById("info-container").style.display = "flex";
  document.getElementById("timezone-container").style.display = "flex";
  document.getElementById("post-office-container").style.display = "flex";

  btn.style.display = "none";
}

// function to display the map
function displayMap(lat, long) {
  let myiframe = document.querySelector("iframe");
  myiframe.src = `https://maps.google.com/maps?q=${lat},${long}&output=embed`;
}

// function for getting the info using user's IP address
function getInfo(ip) {
  fetch(`https://ipinfo.io/${ip}/geo?token=04fda80bd075e2`)
    .then((res) => res.json())
    .then((data) => {
      const latLng = data.loc.split(",");
      lat.innerText = latLng[0];
      long.innerText = latLng[1];
      city.innerText = data.city;
      region.innerText = data.region;
      org.innerText = data.org;
      host.innerText = "Hostname is not provided in API";
      displayMap(latLng[0], latLng[1]);
      timeZone.innerText = data.timezone;
      dateTime.innerText = new Date().toLocaleString("en-US", {
        timeZone: `${data.timezone}`,
      });
      pincodeVal = data.postal;
      pincode.innerText = pincodeVal;
      getPostOfficeInfo(pincodeVal);
    });
}

function getPostOfficeInfo(pincodeVal) {
  fetch(`https://api.postalpincode.in/pincode/${pincodeVal}`)
    .then((res) => res.json())
    .then((data) => {
      message.innerText = data[0].Message;
      postOffices = data[0].PostOffice;
      //   console.log(postOffices)
      displayPostOfficeList(postOffices);
    });
}

function displayPostOfficeList(postOffices) {
  const listElement = document.getElementById("postOfficeList");
  postOffices.forEach((postOffice) => {
    let listItem = document.createElement("div");
    // listElement.classList.add("postlist");
    listItem.innerHTML += `<div class=postlist> <div><strong>Name:</strong> ${postOffice.Name}</div>
    <div><strong>Branch Type:</strong> ${postOffice.BranchType}</div>
    <div><strong>Delivery Status:</strong> ${postOffice.DeliveryStatus}</div>
    <div><strong>District:</strong> ${postOffice.District}</div>
    <div><strong>Divison"</strong> ${postOffice.Division}</div>
    </div>`;
    listElement.appendChild(listItem);
  });
}

function filterPostOffice() {
  const searchText = document.getElementById("search").value.toLowerCase();

  const filteredPostOffice = postOffices.filter((postOffice) => {
    postOffice.Name.toLowerCase().includes(searchText) ||
      postOffice.BranchType.toLowerCase().includes(searchText);
  });
  displayPostOfficeList(filteredPostOffice);
}

btn.addEventListener("click", showInfo);
