# StoryForge AI - 웹소설 창작 스튜디오

## 🚀 GitHub Pages 배포 설정 방법 (1분 완료)

본 레포지토리는 GitHub에 커밋/푸시하면 **자동으로 Vite 빌드 및 GitHub Pages 배포**가 진행되도록 `.github/workflows/deploy.yml`이 구성되어 있습니다.

### 1단계: GitHub Pages 소스 설정
1. 깃허브 저장소 상단의 **[Settings]** 탭을 클릭합니다.
2. 좌측 메뉴에서 **[Pages]** 를 클릭합니다.
3. **Build and deployment** 항목의 **Source**를 `Deploy from a branch` 대신 **`GitHub Actions`** 로 변경합니다.

### 2단계: 자동 배포 확인
1. 저장소 상단의 **[Actions]** 탭을 확인하면 `Deploy to GitHub Pages` 워크플로우가 자동으로 실행됩니다.
2. 약 1분 후 녹색 체크표시(`✓`)가 뜨며 생성된 GitHub Pages URL로 즉시 접속할 수 있습니다.

### (선택) Gemini API_KEY 등록
1. 저장소 **[Settings]** -> **[Secrets and variables]** -> **[Actions]** 로 이동합니다.
2. **New repository secret**을 누르고 Name에 `API_KEY`, Secret에 본인의 Google Gemini API 키를 입력하면 배포된 사이트에서도 정상 연동됩니다.
