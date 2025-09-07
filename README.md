# UnBirthday 🎉

생일 주인공이 하루 동안 특별한 축하 경험을 받을 수 있도록 하는 몰입형 하루 전용 생일 축하 사이트입니다.

## 🚀 프로젝트 개요

UnBirthday는 가족과 친구들이 사진, 영상, 메시지를 공유하며 참여할 수 있는 **하루만 존재하는** 특별한 생일 축하 웹사이트입니다.

### 핵심 특징
- 🕐 **24시간 제한**: 생일 당일에만 접근 가능한 페이지
- 📸 **갤러리 & 메시지**: 실시간 사진/영상 업로드 및 축하 메시지
- 🎨 **몰입형 경험**: 인터랙티브 애니메이션 및 테마
- 🔒 **간편한 참여**: 링크만으로 누구나 참여 가능
- 💎 **희소성 가치**: 하루 후 자동 삭제되는 특별함

## 🛠 기술 스택

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Styled Components** - 컴포넌트 스타일링
- **React Router DOM** - 라우팅 (랜딩/편집/참여자 페이지)
- **HeroIcons** - 아이콘
- **React Dropzone** - 파일 업로드
- **Browser Image Compression** - 이미지 최적화

### Backend & Services
- **Firebase Firestore** - 메시지 및 메타데이터 저장
- **Firebase Storage** - 이미지/영상 저장
- **Firebase Auth** - 인증
- **Firebase Cloud Functions** - 자동 삭제 및 알림

### Utilities
- **js-cookie** - 토큰 관리
- **uuid** - 고유 ID 생성
- **dayjs** - 날짜 관리

## 🏗 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── Landing.tsx     # 랜딩 페이지
│   ├── Edit.tsx        # 편집 페이지 (/edit/UUID?token=xxx)
│   └── Birthday.tsx    # 참여자 페이지 (/happy-birthday/UUID)
├── firebase/           # Firebase 설정 및 서비스
├── hooks/              # 커스텀 훅
├── utils/              # 유틸리티 함수
└── types/              # TypeScript 타입 정의
```

## 🎯 주요 페이지

### 1. 랜딩 페이지 (`/`)
- 서비스 소개 및 "생일 페이지 생성하기" 버튼
- 간단한 안내와 시작 버튼

### 2. 편집 페이지 (`/edit/{UUID}?token={token}`)
- 생성자만 접근 가능 (토큰 기반 인증)
- 테마 선택, 배경 이미지 설정
- 기본 메시지 및 설정 입력
- 참여자 링크 생성

### 3. 참여자 페이지 (`/happy-birthday/{UUID}`)
- 모든 방문자가 접근 가능
- 사진/영상/메시지 업로드
- 실시간 갤러리 및 메시지 피드
- 인터랙티브 애니메이션 (풍선, 촛불, 폭죽 등)

## 🔐 보안 및 권한

### 권한 구조
- **생성자**: 편집, 삭제, 설정 변경 가능 (토큰 기반)
- **참여자**: 메시지/사진 업로드만 가능

### 보안 기능
- UUID 기반 난수화된 URL
- 브라우저 세션 기반 임시 토큰
- 파일 업로드 용량 및 확장자 제한
- XSS 방지 및 입력값 검증

## 📦 설치 및 실행

### 환경 설정
1. 저장소 클론
```bash
git clone https://github.com/nwewave32/unbirthday.git
cd unbirthday
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정
```bash
cp .env.example .env
# .env 파일에 Firebase 설정 입력
```

4. 개발 서버 실행
```bash
npm run dev
```

### 빌드 및 배포
```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 🎪 구독 모델

### 무료 플랜
- 기본 테마 1종
- 업로드 50MB 제한
- 기본 기능 제공

### 프리미엄 (월 3,000원)
- 추가 테마 및 애니메이션
- 업로드 200MB
- 배경음악 및 GIF 지원

### VIP (월 5,000~6,000원)
- 무제한 테마 및 용량
- PDF/앨범 다운로드
- 하루 후 기록 보관
- 고급 인터랙션

## 📊 주요 지표

- 월간 활성 사용자 (MAU)
- 유료 전환율
- 페이지 생성 및 참여율
- 메시지/사진 업로드 수
- 공유 횟수

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!