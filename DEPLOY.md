# GitHub 저장소 만들고 배포하기

로컬 git 저장소는 이미 만들어져 있고 첫 커밋도 되어 있습니다.
남은 건 **GitHub에 올리고 Pages를 켜는 것**뿐입니다.

---

## 1. GitHub에 빈 저장소 만들기

1. [github.com/new](https://github.com/new) 접속
2. 아래처럼 입력

   | 항목 | 값 |
   |---|---|
   | Repository name | `pinkrun` (원하는 이름 아무거나) |
   | Public / Private | **Public** ← Pages 무료 사용하려면 Public |
   | Add a README | **체크 해제** ← 중요. 이미 파일이 있어서 충돌납니다 |
   | .gitignore / license | 둘 다 **None** |

3. **Create repository** 클릭
4. 다음 화면에 나오는 주소를 복사합니다 — `https://github.com/사용자명/pinkrun.git`

---

## 2. 터미널에서 올리기

터미널(Terminal.app)을 열고 아래를 순서대로 붙여넣습니다.
`사용자명`과 `pinkrun` 부분만 본인 것으로 바꾸세요.

```bash
cd "/Users/yoonyoung/Desktop/02_AI개발/Marken/PinkrunGallery/pinkrun-site"

git remote add origin https://github.com/사용자명/pinkrun.git
git push -u origin main
```

로그인 창이 뜨면 GitHub 계정으로 승인하면 됩니다.
(터미널에서 비밀번호를 물으면 계정 비밀번호가 아니라 **Personal Access Token**이 필요합니다.
번거로우면 아래 "GitHub Desktop" 방법을 쓰세요.)

### 터미널이 어려우면 — GitHub Desktop

1. [desktop.github.com](https://desktop.github.com) 설치 후 로그인
2. **File → Add Local Repository** → `pinkrun-site` 폴더 선택
3. 오른쪽 위 **Publish repository** 클릭 (Keep this code private 체크 해제)

---

## 3. GitHub Pages 켜기

1. 저장소 페이지 → **Settings** 탭
2. 왼쪽 메뉴 **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / 폴더: **/ (root)** → **Save**
5. 1~2분 뒤 상단에 주소가 뜹니다

```
https://사용자명.github.io/pinkrun/
```

`.nojekyll` 파일이 들어 있어서 파일이 그대로 서빙됩니다.

---

## 이후 수정할 때

파일을 고친 뒤 터미널에서:

```bash
cd "/Users/yoonyoung/Desktop/02_AI개발/Marken/PinkrunGallery/pinkrun-site"

git add -A
git commit -m "무엇을 바꿨는지 한 줄로"
git push
```

푸시하면 1~2분 뒤 사이트에 자동 반영됩니다.
GitHub Desktop을 쓰신다면 변경사항 요약을 적고 **Commit to main → Push origin** 을 누르면 됩니다.

되돌리고 싶을 때는 GitHub 저장소의 **Commits** 목록에서 이전 시점을 볼 수 있고,
잘못 올렸으면 터미널에서 `git revert 커밋번호` 로 되돌립니다.

---

## 커밋 메시지 예시

무엇을 바꿨는지 나중에 알아보기 쉽게 적어두면 좋습니다.

```
2025 사진 5장 교체
메모리월 문구 수정
신청 링크 2027년 폼으로 변경
```

---

## 참고 · 저장소에 담긴 것

```
index.html          메인 페이지
css/style.css       스타일
js/config.js        설정 (시트 주소 · 신청 링크) ← 여기만 고치면 되는 값들
js/data.js          사진 목록
js/main.js          인터랙션
assets/             사진 · 로고 · 라이브러리 (약 41MB)
backend/Code.gs     구글 시트 연동 스크립트 (사이트에는 안 쓰임, 보관용)
backend/SETUP.md    시트 연결 방법
```

`backend/` 폴더는 사이트 동작에 필요하진 않지만, 나중에 스크립트를 다시 손볼 때를 위해 같이 보관합니다.
