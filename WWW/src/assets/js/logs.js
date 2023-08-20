let currentPage = 1
let startPage = 1
let endPage = 10
let perPage = 10 // Pagination 한 번에 보여줄 페이지 수
const token = localStorage.getItem('token') // 토큰을 가져옴
function fetchData (pageNumber) {
  fetch(serverUrl + `/data/page/timestamp/${pageNumber}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok.')
      }
      return res.json()
    })
    .then(data => {
      console.log(data.content)
      document.getElementById('data-collect-table').innerHTML = '' // Clear existing data
      data.content.forEach((item, index) => {
        document.getElementById('data-collect-table').innerHTML += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.fetchTimestamp.slice(0,10)} 
                      ${item.fetchTimestamp.slice(11, 19)}</td>
                  <td>${item.date.slice(0,10)}
                      ${item.date.slice(11,19)}</td>
                  <td>${item.satelliteId}</td>
                  <td>${item.name}</td>
              `
      })
      updatePagination(pageNumber, data.totalPages)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

function updatePagination (currentPage, totalPages) {
  const pagination = document.querySelector('.pagination')
  pagination.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#">&laquo;</a>
        </li>
    `

  // Next 눌러서 페이지가 넘어갔을 때 startPage, endPage 값 변경
  if (currentPage > endPage) {
    startPage = currentPage
    endPage = startPage + perPage - 1
  }
  // Previous 눌러서 페이지가 넘어갔을 때 startPage, endPage 값 변경
  if (currentPage < startPage) {
    startPage = currentPage - perPage + 1
    endPage = currentPage
  }
  // 마지막 Pagination
  if (endPage > totalPages) {
    startPage = currentPage
    endPage = totalPages
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `
  }

  pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#">&raquo;</a>
        </li>
    `

  addEventListeners()
}

function addEventListeners () {
  const links = document.querySelectorAll('.page-link')
  links.forEach((link, index) => {
    link.addEventListener('click', event => {
      event.preventDefault()
      if (link.innerText === '»') {
        currentPage += 1
      } else if (link.innerText === '«') {
        currentPage -= 1
      } else {
        currentPage = Number(link.innerText)
      }
      console.log('현재 페이지 : ', currentPage)
      fetchData(currentPage)
    })
  })
}

fetchData(currentPage)
