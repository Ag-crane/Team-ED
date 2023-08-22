document.addEventListener('DOMContentLoaded', function () {
  const logoutButton = document.getElementById('logoutButton')

  logoutButton.addEventListener('click', function () {
    localStorage.removeItem('token')

    alert('로그아웃 되었습니다.')

    window.location.href = '../pages/login.html'
  })
})
