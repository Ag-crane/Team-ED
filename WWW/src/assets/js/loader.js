document.addEventListener('DOMContentLoaded', function () {
    // 동시에 여러 개의 HTML 파일을 fetch하고 처리
    Promise.all([
      fetch("../partials/_footer.html").then((response) => response.text()),
      fetch("../partials/_sidebar.html").then((response) => response.text())
    ])
    .then(([footerHTML, sidebarHTML]) => {
      document.getElementById("footer").innerHTML = footerHTML;
      document.getElementById("sidebar").innerHTML = sidebarHTML;
  
      // sidebar 내용이 추가된 후에 로그아웃 이벤트 추가
      const logoutButton = document.getElementById('logoutButton');
      logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        alert('로그아웃 되었습니다.');
        window.location.href = '../pages/login.html';
      });
    })
    .catch((error) => console.warn(error));
  });