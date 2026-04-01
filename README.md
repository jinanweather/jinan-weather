# Jinan Weather

어제와 오늘 비교에 초점을 둔 정적 웹 날씨앱입니다.

## 실행

아래 둘 중 하나로 열 수 있습니다.

1. `index.html`을 브라우저에서 바로 열기
2. 간단한 로컬 서버 실행 후 접속하기

```bash
python3 -m http.server 8000
```

그다음 브라우저에서 `http://localhost:8000`으로 접속하면 됩니다.

## 기능

- 도시 검색
- 현재 위치 기반 날씨 조회
- 어제와 오늘 비교
- 시간별 예보
- 10일 예보
- 미세먼지 비교
- 습도, 바람, 강수 비교

## 데이터 소스

- Open-Meteo Forecast API
- Open-Meteo Air Quality API
- Open-Meteo `KMA Seamless` 모델 우선 사용
- Open-Meteo Geocoding API
