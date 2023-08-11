document.getElementById('loginForm').addEventListener('submit', function(event) {
    // 폼의 기본제출동작 막기
    event.preventDefault();

    // 폼 데이터를 가져와 json 형식으로 변환
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data);
    console.log(jsonData)

    // 서버에 POST 요청 전송
    fetch('http://3.34.129.187:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
    .then(response => response.json())
    .then(data => { // 서버로부터 받은 응답 : access token
      if (data.accessToken == null) {
        alert('로그인 실패');
        return;
      }else{
        console.log(data);
        localStorage.setItem('token', data.accessToken);  // 로컬스토리지에 토큰 저장
        location.href = 'dashboard.html'; // 메인 페이지로 이동
      }
    }) 
    .catch(error => console.error('An error occurred:', error));
  });