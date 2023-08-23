  // 비정상적 접근 방지
  if (!localStorage.getItem('token')) {
    document.getElementById('content-wrapper').innerHTML = ''
    alert('로그인 후 이용하실 수 있습니다.')
    location.href = '../pages/login.html'
  }else{
    fetch(serverUrl + '/data/page/timestamp/1')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok.')
      }
      return res.json()
    })
    .then(data => {
      // 데이터를 date 순으로 정렬
      data.content.sort(function (a, b) {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
      })
  
      // 최근 수집한 데이터 5개만 테이블에 추가
      data.content.slice(0, 5).forEach((item, index) => {
        document.getElementById('table1-body').innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.date.slice(0, 10)} ${item.date.slice(11, 19)}</td>
        <td>${item.name}</td>
      </tr>
    `
      })
    })
    .catch(error => {
      console.error('Error:', error)
    })
  
  fetch(serverUrl + '/tle-data-info')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok.')
      }
      return res.json()
    })
    .then(data => {
      // 데이터를 fetchTime 순으로 정렬
      data.sort(function (a, b) {
        const dateA = new Date(a.fetchTime)
        const dateB = new Date(b.fetchTime)
        return dateB - dateA
      })
      // 최근 5개만 테이블에 추가
      data.slice(0, 5).forEach((item, index) => {
        document.getElementById('table2-body').innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.fetchTime.slice(0, 10)}
            ${item.fetchTime.slice(11, 19)}</td>
        <td>${item.totalCount}</td>
        <td>${item.updatedCount}</td>
        <td>${item.newCount}</td>
      </tr>
    `
      })
    })  
  }