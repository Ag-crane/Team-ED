// 페이지 로드 전, 토큰 확인 후 없으면 로그인 페이지로 이동
if (localStorage.getItem('token') === null) {
  alert('로그인이 필요합니다.')
  location.href = 'login.html'
}
