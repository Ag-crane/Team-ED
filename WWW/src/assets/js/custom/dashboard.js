fetch("http://3.34.129.187:8080/data/page/timestamp/1")
.then((res) => {
  if (!res.ok) {
    throw new Error("Network response was not ok.");
  }
  return res.json();
})
.then((data) => {

  // 데이터를 date 순으로 정렬
  data.content.sort(function (a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  // 최근 수집한 데이터 5개만 테이블에 추가
  data.content.slice(0, 5).forEach((item, index) => {
    document.getElementById("table1-body").innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${item.date.slice(0, 10)} ${item.date.slice(11, 19)}</td>
      <td>${item.name}</td>
    </tr>
  `;
  });
})
.catch((error) => {
  console.error("Error:", error);
});