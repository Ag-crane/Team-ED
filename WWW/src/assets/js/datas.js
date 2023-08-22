// 스피너
const spinnerBox = document.getElementById('spinnerBox')

function showSpinner () {
  const spinnerHtml = `
  <div class="d-flex"">
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`
  spinnerBox.innerHTML = spinnerHtml
  spinnerBox.style.display = 'flex'
}

function hideSpinner () {
  spinnerBox.style.display = 'none'
}

// 검색
var searchType = 'name' // 기본 검색 유형 설정

function setSearchType (type) {
  searchType = type
  document.getElementById('dropdownBtn').innerHTML =
    searchType === 'name' ? '위성 이름' : '위성 번호' // Clear input value
  updatePlaceholder()
}

function sendSearchData () {
  var satelliteValue = document.getElementById('satelliteValue').value
  var url = ''
  if (searchType === 'name') {
    url = serverUrl + '/data/search?name=' + encodeURIComponent(satelliteValue)
  } else if (searchType === 'id') {
    url =
      serverUrl +
      '/data/search/satellite-id?satelliteId=' +
      encodeURIComponent(satelliteValue)
  }
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      // 검색결과 테이블에 추가
      document.getElementById('data-list-table').innerHTML = '' // Clear existing data
      data.forEach((item, index) => {
        // 예외처리 : 빈 값일 경우 '-'로 표시
        if (
          item.launch === null ||
          typeof item.launch !== 'string' ||
          isNaN(parseInt(item.launch.slice(0, 2), 10))
        ) {
          item.launch = '-'
        } else {
          const launchYear = parseInt(item.launch.slice(0, 2), 10)
          item.launch = launchYear < 23 ? `20${launchYear}` : `19${launchYear}`
        }
        const row = document.createElement('tr')
        row.addEventListener('click', () => openModal(item))
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.satelliteId}</td>
        <td>${
          item.name === 'UNKNOWN'
            ? 'UNKNOWN  <button type="button" id="update-btn" onclick="modifyRow()">수정</button>'
            : item.name
        }</td>
        <td>${item.info === null ? '-' : item.info}</td>
        <td><label class="badge badge-danger">${
          item.classification
        }</label></td>
        <td>${item.latitude.toFixed(6)}</td> 
        <td>${item.longitude.toFixed(6)}</td>
        <td>${item.launch}</td>
        `
        document.getElementById('data-list-table').appendChild(row)
      })
      document.getElementById('pagination').innerHTML = '' // Clear existing pagination
    })
    .catch(error => {
      alert('검색에 실패하였습니다.\n' + error)
    })
}

// 수정
function modifyName () {
  const unknownButton = event.target
  const row = unknownButton.closest('tr')
  const nameCell = row.querySelector('td:nth-child(3)')

  const newName = prompt('위성의 새로운 이름을 입력하세요:')
  if (newName !== null) {
    const originalButton = nameCell.querySelector('button')
    if (originalButton) {
      nameCell.innerHTML =
        newName +
        ' <button type="button" id="update-btn" onclick="modifyName()">수정</button>'
    } else {
      nameCell.innerHTML = newName
    }

    const satelliteId = row.querySelector('td:nth-child(2)').textContent
    sendModifiedNameToServer(satelliteId, newName)

    fetchData(currentPage) // 수정 후 데이터 업데이트

    event.stopPropagation() // 모달 열림 방지
  }
}

function sendModifiedNameToServer (satelliteId, newName) {
  const data = {
    name: newName
  }

  fetch(serverUrl + `/data/${satelliteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }
      console.log('Name modification successful')
    })
    .catch(error => {
      console.error('Error sending modified name to server:', error)
    })
}

// 데이터 수집

let currentPage = 1
let startPage = 1
let endPage = 10
let perPage = 10 // Pagination 한 번에 보여줄 페이지 수
const token = localStorage.getItem('token') // 로그인 시 저장된 토큰

function fetchData (pageNumber) {
  showSpinner()

  fetch(serverUrl + `/data/page/${pageNumber}`, {
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
      hideSpinner()

      document.getElementById('data-list-table').innerHTML = '' // Clear existing data
      data.content.forEach((item, index) => {
        // 예외처리 : 빈 값일 경우 '-'로 표시
        if (
          item.launch === null ||
          typeof item.launch !== 'string' ||
          isNaN(parseInt(item.launch.slice(0, 2), 10))
        ) {
          item.launch = '-'
        } else {
          const launchYear = parseInt(item.launch.slice(0, 2), 10)
          item.launch = launchYear < 23 ? `20${launchYear}` : `19${launchYear}`
        }
        const row = document.createElement('tr')
        row.addEventListener('click', () => openModal(item))
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.satelliteId}</td>
        <td>${
          item.name === 'UNKNOWN'
            ? 'UNKNOWN  <button type="button" id="update-btn" onclick="modifyRow()">수정</button>'
            : item.name
        }</td>
        <td>${item.info === null ? '-' : item.info}</td>
        <td><label class="badge badge-danger">${
          item.classification
        }</label></td>
        <td>${item.latitude.toFixed(6)}</td> 
        <td>${item.longitude.toFixed(6)}</td>
        <td>${item.launch}</td>
        `

        document.getElementById('data-list-table').appendChild(row)
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

// 모달 창 띄우기
function openModal (item) {
  console.log(item)
  const modalContainer = document.getElementById('modal-container')
  modalContainer.innerHTML = ''

  fetch('../partials/_modal.html')
    .then(res => res.text())
    .then(modalContent => {
      modalContainer.innerHTML = modalContent
      const modalBody = document.getElementById('modal-body')

      document.getElementById('modal-title').innerHTML += item.name

      modalBody.innerHTML = `
      <table class="table table-striped table-bordered text-center">
      <tbody>
      <tr><td><strong>Satellite ID</strong></td><td>${
        item.satelliteId
      }</td></tr>
      <tr><td><strong>Name</strong></td><td>${item.name}</td></tr>
      <tr><td><strong>Date</strong></td><td>${item.date}</td></tr>
      <tr><td><strong>Satellite Number</strong></td><td>${
        item.satelliteNumber
      }</td></tr>
      <tr><td><strong>Classification</strong></td><td>${
        item.classification
      }</td></tr>
      <tr><td><strong>Launch</strong></td><td>${item.launch}</td></tr>
      <tr><td><strong>Launch Piece</strong></td><td>${
        item.launchPiece
      }</td></tr>
      <tr><td><strong>Epoch</strong></td><td>${item.epoch}</td></tr>
      <tr><td><strong>First Time Derivative</strong></td><td>${
        item.firstTimeDerivative
      }</td></tr>
      <tr><td><strong>Second Time Derivative</strong></td><td>${
        item.secondTimeDerivative
      }</td></tr>
      <tr><td><strong>Bstar Drag Term</strong></td><td>${
        item.bstarDragTerm
      }</td></tr>
      <tr><td><strong>Ephemeris Type</strong></td><td>${
        item.ephemerisType
      }</td></tr>
      <tr><td><strong>Element Number</strong></td><td>${
        item.elementNumber
      }</td></tr>
      <tr><td><strong>Inclination</strong></td><td>${item.inclination}</td></tr>
      <tr><td><strong>Right Ascension</strong></td><td>${
        item.rightAscension
      }</td></tr>
      <tr><td><strong>Eccentricity</strong></td><td>${
        item.eccentricity
      }</td></tr>
      <tr><td><strong>Argument of Perigee</strong></td><td>${
        item.argumentOfPerigee
      }</td></tr>
      <tr><td><strong>Mean Anomaly</strong></td><td>${
        item.meanAnomaly
      }</td></tr>
      <tr><td><strong>Mean Motion</strong></td><td>${item.meanMotion}</td></tr>
      <tr><td><strong>Fetch Timestamp</strong></td><td>${
        item.fetchTimestamp
      }</td></tr>
      <tr><td><strong>Latitude</strong></td><td>${item.latitude}</td></tr>
      <tr><td><strong>Longitude</strong></td><td>${item.longitude}</td></tr>
      <tr><td><strong>Country / Organization</strong></td><td>${
        item.info === 'null' ? '-' : item.info
      }</td></tr>
      </tbody>
      </table>
      `

      $('#modal').modal('show')
    })
    .catch(error => {
      console.error('Error fetching modal:', error)
    })
}

fetchData(currentPage)
