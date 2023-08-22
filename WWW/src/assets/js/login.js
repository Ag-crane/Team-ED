document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    // 폼의 기본제출동작 막기
    event.preventDefault()

    // 폼 데이터를 가져와 json 형식으로 변환
    const formData = new FormData(this)
    const data = Object.fromEntries(formData.entries())
    const jsonData = JSON.stringify(data)
    console.log(jsonData)

    // 서버에 POST 요청 전송
    fetch(serverUrl + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    })
      .then(response => response.json())
      .then(data => {
        // 서버로부터 받은 응답 : access token
        if (data.accessToken == null) {
          appendAlert(
            'liveAlertPlaceholder1',
            `로그인 실패 ${failCount}회.\n이메일 혹은 비밀번호를 확인하세요`,
            'danger'
          )
          return
        } else {
          localStorage.setItem('token', data.accessToken) // 로컬스토리지에 토큰 저장
          location.href = 'dashboard.html' // 메인 페이지로 이동
        }
      })
      .catch(error => console.error('An error occurred:', error))
  })

var failCount = 1
const appendAlert = (elementId, message, type) => {
  const alertPlaceholder = document.getElementById(elementId)
  failCount++
  alertPlaceholder.innerHTML = ''
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type}" role="alert">`,
    `   <div class="text-small">${message}</div>`,
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

// 모달 창 띄우기
function openModal () {
  const modalContainer = document.getElementById('modal-container')
  modalContainer.innerHTML = ''

  fetch('../partials/_modal.html')
    .then(res => res.text())
    .then(modalContent => {
      modalContainer.innerHTML = modalContent
      const modalTitle = document.getElementById('modal-title')
      modalTitle.innerHTML = '회원 가입 '

      const modalBody = document.getElementById('modal-body')
      modalBody.innerHTML = `
      <div class="row w-100">
            <div class="col-lg-10 mx-auto">
              <div class="auto-form-wrapper">
                <form id="registerForm">
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        type="text"
                        id="email"
                        name="email"
                        class="form-control"
                        placeholder="Email"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-control"
                        placeholder="Password"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <button 
                    type="submit"
                    class="btn btn-primary submit-btn btn-block" onclick="sendRegisterData()">
                      가입하기
                    </button>
                  </div>
                  <div id="liveAlertPlaceholder1"></div>
                </form>
              </div>
            </div>
      `
      $('#modal').modal('show')
    })
    .catch(error => {
      console.error('Error fetching modal:', error)
    })
}

// 회원가입 정보 전송

function sendRegisterData () {
  document
    .getElementById('registerForm')
    .addEventListener('submit', function (event) {
      // 폼의 기본제출동작 막기
      event.preventDefault()

      // 폼 데이터를 가져와 json 형식으로 변환
      const formData = new FormData(this)
      const data = Object.fromEntries(formData.entries())
      const jsonData = JSON.stringify(data)
      console.log(jsonData)
      // 서버에 POST 요청 전송
      fetch(serverUrl + '/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })
        .then(response => response.json())
        .then(data => {
          // 서버로부터 받은 응답 : access token
          if (data.accessToken) {
            // modalBody.innerHTML 을 회원가입 완료 화면으로 변경
            const modalBody = document.getElementById('modal-body')
            modalBody.innerHTML = `
                <div class="row w-100">
                      <div class="col-lg-10 mx-auto">
                        <div class="auto-form-wrapper">
                          <h3>회원가입이 완료되었습니다.</h3>
                        </div>
                      </div>
                </div>`
          } else {
            appendAlert(
              'liveAlertPlaceholder2',
              `회원가입 실패 ${failCount}회.\n이메일 혹은 비밀번호의 형식이 올바르지 않습니다`,
              'danger'
            )
            return
          }
        })
        .catch(error => console.error('An error occurred:', error))
    })
}
