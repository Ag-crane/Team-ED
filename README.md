# Team-ED
동국대학교 2023 여름학기 산학협력프로젝트 - 위성 데이터 수집 및 대시보드 개발

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
