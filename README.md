# 핑크런, 그날의 온도 — MARKEN × Pink Run 갤러리 마이크로사이트

MARKEN Pink Run 2023–2025 감성 아카이브. 시네마틱 스크롤(A안 "그날의 온도").

## 구성
```
index.html          메인 페이지
css/style.css       스타일 (Marken DSG 타이포 토큰 + 라임/네이비 + Pink Run 핑크)
js/config.js        사이트 설정 (메모리월 API 주소 · 신청하기 링크 — 여기만 수정)
js/data.js          사진 데이터 + 연도별 정보 (최신 연도가 배열 맨 앞)
js/main.js          인터랙션 (스크롤·라이트박스·메모리월)
backend/Code.gs     메모리월 백엔드 (Google Apps Script)
backend/SETUP.md    메모리월 연결 가이드 ← 메시지 기능 쓰려면 필독
assets/
  brand/            로고 · 파비콘
  hero/             히어로 이미지
  large/            라이트박스용 뷰 이미지 (2000px)
  thumb/            갤러리 썸네일 (900px)
  vendor/           GSAP · ScrollTrigger · Lenis (로컬 번들 — CDN 불필요)
```

> `assets/highlight-2024.mp4`, `assets/highlight-2024-poster.jpg`, `manifest.json` 은 더 이상 쓰지 않습니다. 지워도 됩니다.

## 기술
- GSAP + ScrollTrigger (스크롤 등장·패럴랙스·챕터 전환)
- Lenis (부드러운 스크롤)
- 순수 HTML/CSS/JS — 빌드 과정 없음, 정적 호스팅 그대로 동작
- 라이브러리는 `assets/vendor/`에 번들되어 있어 인터넷 CDN 없이도 작동
  (폰트만 Google Fonts / Pretendard CDN 사용 — 오프라인 시 시스템 폰트로 대체)

## GitHub Pages 배포
1. 새 저장소를 만들고 이 폴더의 내용을 전부 올립니다.
   ```
   git init
   git add .
   git commit -m "Pink Run gallery"
   git branch -M main
   git remote add origin https://github.com/<사용자>/<저장소>.git
   git push -u origin main
   ```
2. GitHub 저장소 → **Settings → Pages** → Source를 **main / root** 로 설정 → Save
3. 1~2분 뒤 `https://<사용자>.github.io/<저장소>/` 에서 확인

> `.nojekyll` 파일이 포함돼 있어 GitHub Pages가 파일을 그대로 서빙합니다.

## 사진 교체 / 추가
1. 새 사진을 `assets/large/`(2000px)와 `assets/thumb/`(900px)에 같은 파일명으로 넣습니다.
2. `js/data.js`의 `photos` 배열에 `{id, year, w, h, caption}` 항목을 추가합니다.
   - `id`는 확장자 없는 파일명 (예: `y2025-21`)
   - `w`,`h`는 실제 이미지 픽셀 크기 (마소니 비율 계산용)

## 메모리월 (참가자 메시지)
메시지는 Google 스프레드시트에 쌓입니다. 설정은 **`backend/SETUP.md`** 를 따라 하세요.

- 참가자는 누구나 글을 남길 수 있고, 등록 즉시 모두에게 보입니다
- 수정·삭제는 **관리자만** 가능합니다 — 사이트 주소 뒤에 `?admin` 을 붙이고 비밀번호를 입력
- 관리자 비밀번호는 Apps Script의 스크립트 속성(`ADMIN_PW`)에 저장돼 사이트 소스에 노출되지 않습니다
- `js/config.js` 의 `apiUrl` 이 비어 있으면 메모리월은 "준비 중" 안내만 표시합니다

## 로컬 미리보기
```
python3 -m http.server 8000
# http://localhost:8000
```
