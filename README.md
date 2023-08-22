

# Team-ED
동국대학교 2023 여름학기 산학협력프로젝트 - 위성 데이터 수집 및 대시보드 개발

<img width="50%" alt="image" src="https://github.com/Ag-crane/Team-ED/assets/79622645/7dc4b4ab-85fb-4a3d-b275-1afc5858aba5">


## ❓배경
인공위성의 증가로 인한 데이터 관리 시스템 필요성 인식


## 🎯 목적
NASA API 인공위성 정보 수집 및 데이터 관리 시스템 구축



## 🧑‍💻 팀원 소개
<table>
  <tbody>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/112919689?v=4" width="100px" alt=""/><br /><sub><b>Leader, FE  : <a href="https://github.com/Ag-crane">이은학</a></b></sub><br /></td> 
    <td><img src="https://avatars.githubusercontent.com/u/79622645?s=400&u=899b91752320a9c72a3b8c00388f29baf836ce2e&v=4" width="100px" alt=""/><br /><sub><b>BE  : <a href="https://github.com/MIN0225">김광민</a></b></sub><br /></td> 
    <td><img src="https://avatars.githubusercontent.com/u/119364875?v=4" width="100px" alt=""/><br /><sub><b>데이터수집  : <a href="https://github.com/starht">한별</a></b></sub><br /></td> 
  </tbody>
</table>



## ⌨️ 기술 스택
### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white)
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white">
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white">
<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white">

### 💫 Front-end
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
<img src="https://img.shields.io/badge/Bootstrap4-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">


### 💫 Back-end
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> 
<img src="https://img.shields.io/badge/hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=black">  
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=black"> 
<img src="https://img.shields.io/badge/Java-FFFFFF?style=for-the-badge&logo=openjdk&logoColor=black"> 

### 💫 데이터 수집
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=black">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=black"> 
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">




# 1. 시스템 설치
### 환경설정
1. config.yml 생성
```
config.yml.example 파일을 config.yml 로 복사
```

1. config.yml 파일 수정
```
database 정보 수정

api 서버 포트 수정
...
```

### 데이터 수집기
1. node 설치

2. 의존성 파일 설치

```
cd apps/package.json
npm install
```

# 2. 실행
### 데이터 수집기
1. 데이터 수집기 data_collectors 위치로 이동
```
cd apps/data_collectors
```
2. PM2 를 이용한 데이터 수집기 실행
```
pm2 start nasa_data.js
```
2-1. 데이터 수집기 실횅
```
cd apps/data_collectors
node nasa_data.js
```

### API 서버 실행
1. API SERVER/satellite 위치로 이동
```
cd API_SERVER/satellite
```
2. 빌드
```
./gradlew clean build
```
3. jar 실행
```
API_SERVER/satellite/build/libs/satellite-0.0.1-SNAPSHOT.jar 에 있는 jar 파일 실행
nohup java -jar satellite-0.0.1-SNAPSHOT.jar &
만약 이미 nohup으로 실행중이라면 kill -9 {pid} 로 종료 후 실행
```

# 3. 종료 및 재시작
