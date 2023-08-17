function fetchData () {
  fetch(`../assets/sample.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok.')
      }
      return res.json()
    })
    .then(data => {
      document.getElementById('data-list-table').innerHTML = ''
      data.content.forEach((item, index) => {
        document.getElementById("data-list-table").innerHTML += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.satelliteId}</td>
                  <td>${item.name}</td>
                  <td><label class="badge badge-danger">${
                    item.classification
                  }</label></td>
                  <td>${item.launch.slice(0, 2)}</td>
                  <td>${item.date.slice(0, 10)}</td>
                </tr>
              `;
      });
      updatePagination(pageNumber, data.totalPages);
    })
}

function updatePagination(currentPage, totalPages) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#">&laquo;</a>
        </li>
    `;

  // Next 눌러서 페이지가 넘어갔을 때 startPage, endPage 값 변경
  if (currentPage > endPage) {
    startPage = currentPage;
    endPage = startPage + perPage - 1;
  }
  // Previous 눌러서 페이지가 넘어갔을 때 startPage, endPage 값 변경
  if (currentPage < startPage) {
    startPage = currentPage - perPage + 1;
    endPage = currentPage;
  }
  // 마지막 Pagination
  if (endPage > totalPages) {
    startPage = currentPage;
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
  }

  pagination.innerHTML += `
        <li class="page-item ${
          currentPage === totalPages ? "disabled" : ""
        }">
            <a class="page-link" href="#">&raquo;</a>
        </li>
    `;

  addEventListeners();
}

fetchData()

// import serverUrl from "./module";

// var searchType = "name"; // 기본 검색 유형 설정

// function setSearchType(type) {
//   searchType = type;
//   updatePlaceholder();
// }

// function updatePlaceholder() {
//   var placeholderText = searchType === "name" ? "위성 이름" : "위성 번호";
//   document.getElementById("satelliteValue").placeholder = placeholderText;
// }

// function sendSearchData() {
//   var satelliteValue = document.getElementById("satelliteValue").value;
//   var url = "https://your-server.com/search";

//   var params = searchType + "=" + encodeURIComponent(satelliteValue);

//   fetch(url + "?" + params)
//     .then(response => response.json())
//     .then(data => {
//       alert("위성 검색이 완료되었습니다.");
//     })
//     .catch(error => {
//       console.error("An error occurred:", error);
//       alert("위성 검색에 실패했습니다. 다시 시도해주세요.");
//     });
// }

// // 페이지 로드 시 초기 placeholder 설정
// updatePlaceholder();

// let currentPage = 1;
// let startPage = 1;
// let endPage = 10;
// let perPage = 10; // Pagination 한 번에 보여줄 페이지 수
// const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰

// function fetchData(pageNumber) {
//   fetch(`http://3.34.129.187:8080/data/page/${pageNumber}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`, // 토큰을 헤더에 추가
//     },
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Network response was not ok.");
//       }
//       return res.json();
//     })
//     .then((data) => {
//       document.getElementById("data-list-table").innerHTML = ""; // Clear existing data
//       data.content.forEach((item, index) => {
//         document.getElementById("data-list-table").innerHTML += `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.satelliteId}</td>
//                   <td>${item.name}</td>
//                   <td><label class="badge badge-danger">${
//                     item.classification
//                   }</label></td>
//                   <td>${item.launch.slice(0, 2)}</td>
//                   <td>${item.date.slice(0, 10)}</td>
//                 </tr>
//               `;
//       });
//       updatePagination(pageNumber, data.totalPages);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// function updatePagination(currentPage, totalPages) {
//   const pagination = document.querySelector(".pagination");
//   pagination.innerHTML = `
//         <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
//             <a class="page-link" href="#">&laquo;</a>
//         </li>
//     `;

//   // Next 눌러서 페이지가 넘어갔을 때 startPage, endPage 값 변경
//   if (currentPage > endPage) {
//     startPage = currentPage;
//     endPage = startPage + perPage - 1;
//   }
//   // Previous 눌러서 페이지가 넘어갔을 때 startPage, endPage 값 변경
//   if (currentPage < startPage) {
//     startPage = currentPage - perPage + 1;
//     endPage = currentPage;
//   }
//   // 마지막 Pagination
//   if (endPage > totalPages) {
//     startPage = currentPage;
//     endPage = totalPages;
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     pagination.innerHTML += `
//             <li class="page-item ${i === currentPage ? "active" : ""}">
//                 <a class="page-link" href="#">${i}</a>
//             </li>
//         `;
//   }

//   pagination.innerHTML += `
//         <li class="page-item ${
//           currentPage === totalPages ? "disabled" : ""
//         }">
//             <a class="page-link" href="#">&raquo;</a>
//         </li>
//     `;

//   addEventListeners();
// }

// function addEventListeners() {
//   const links = document.querySelectorAll(".page-link");
//   links.forEach((link, index) => {
//     link.addEventListener("click", (event) => {
//       event.preventDefault();
//       if (link.innerText === "»") {
//         currentPage += 1;
//       } else if (link.innerText === "«") {
//         currentPage -= 1;
//       } else {
//         currentPage = Number(link.innerText);
//       }
//       console.log("현재 페이지 : ", currentPage);

//       fetchData(currentPage);
//     });
//   });
// }

// fetchData(currentPage);
