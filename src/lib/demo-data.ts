export type CommunityCategory = "자유" | "질문" | "강의·과제" | "공지";
export type MeetingType = "온라인" | "오프라인";
export type StudyStatus = "모집 중" | "마감";

export type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: string;
  comments: Comment[];
  views: number;
};

export type Study = {
  id: string;
  title: string;
  subject: string;
  description: string;
  days: string[];
  time: string;
  meetingType: MeetingType;
  currentMembers: number;
  maxMembers: number;
  deadline: string;
  status: StudyStatus;
  owner: string;
  accent: "violet" | "mint" | "orange" | "blue";
};

export type Application = {
  id: string;
  studyId: string;
  studyTitle: string;
  message: string;
  status: "검토 중" | "승인됨" | "거절됨";
  createdAt: string;
};

export type PendingApplicant = {
  id: string;
  name: string;
  major: string;
  message: string;
  status: "검토 중" | "승인됨" | "거절됨";
};

export const currentUser = {
  name: "김민서",
  major: "컴퓨터공학과 · 3학년",
  initials: "MS",
};

export const categories: CommunityCategory[] = ["자유", "질문", "강의·과제", "공지"];

export const seedPosts: Post[] = [
  {
    id: "p1",
    category: "질문",
    title: "자료구조 중간고사, 어디부터 복습하시나요?",
    content:
      "트리와 그래프 파트에서 막히는 부분이 많아요. 이번 주말에 같이 복습할 분이 있다면 댓글 남겨 주세요. 기출 문제를 기준으로 정리해 보려고 합니다.",
    tags: ["자료구조", "중간고사", "복습"],
    author: "이도윤",
    createdAt: "12분 전",
    comments: [
      { id: "c1", author: "박서연", content: "그래프 BFS/DFS부터 보면 전체 구조가 잘 잡혀요!", createdAt: "8분 전" },
      { id: "c2", author: "한유진", content: "저도 같이 하고 싶어요. 토요일 오후는 어떠세요?", createdAt: "3분 전" },
    ],
    views: 48,
  },
  {
    id: "p2",
    category: "강의·과제",
    title: "웹보안 팀플 역할 분담 템플릿 공유해요",
    content:
      "레드팀, 블루팀, 발표 자료 역할을 나눌 때 사용한 간단한 템플릿입니다. 주간 단위로 취약점 재현과 방어 코드 검토를 나누면 진행하기 편했어요.",
    tags: ["웹보안", "팀플", "역할분담"],
    author: "김민서",
    createdAt: "46분 전",
    comments: [{ id: "c3", author: "정우진", content: "정리 감사합니다! 발표 순서에도 도움이 되겠네요.", createdAt: "31분 전" }],
    views: 91,
  },
  {
    id: "p3",
    category: "자유",
    title: "이번 주 코딩테스트 스터디, 문제 난이도 추천 받습니다",
    content:
      "백준 실버 상위~골드 초반 정도로 3문제 풀어 보려고 해요. DP나 그래프 문제 추천 부탁드립니다.",
    tags: ["코딩테스트", "알고리즘"],
    author: "최하린",
    createdAt: "1시간 전",
    comments: [],
    views: 35,
  },
  {
    id: "p4",
    category: "공지",
    title: "[학과] 캡스톤디자인 중간 점검 일정 안내",
    content:
      "중간 점검은 10월 24일(목)부터 진행됩니다. 팀별 발표 순서와 제출 형식은 학과 홈페이지 공지를 확인해 주세요.",
    tags: ["캡스톤", "일정"],
    author: "컴공 학생회",
    createdAt: "3시간 전",
    comments: [],
    views: 214,
  },
];

export const seedStudies: Study[] = [
  {
    id: "s1",
    title: "알고리즘 Sprint 4주 완주",
    subject: "알고리즘",
    description: "주 2회 문제 풀이와 코드 리뷰를 진행합니다. 그래프와 DP를 집중적으로 다뤄요.",
    days: ["월", "목"],
    time: "19:30 - 21:30",
    meetingType: "온라인",
    currentMembers: 3,
    maxMembers: 5,
    deadline: "10월 18일",
    status: "모집 중",
    owner: "최하린",
    accent: "violet",
  },
  {
    id: "s2",
    title: "웹 보안 실습 같이 끝내요",
    subject: "웹 보안",
    description: "XSS, 인증/인가, 입력 검증 실습을 함께 진행할 팀원을 찾습니다. 초보도 환영해요.",
    days: ["수"],
    time: "18:00 - 20:00",
    meetingType: "오프라인",
    currentMembers: 2,
    maxMembers: 4,
    deadline: "10월 20일",
    status: "모집 중",
    owner: "김민서",
    accent: "mint",
  },
  {
    id: "s3",
    title: "데이터베이스 정규화 정복",
    subject: "데이터베이스",
    description: "중간고사 대비 개념 요약과 SQL 문제 풀이를 병행합니다.",
    days: ["화", "금"],
    time: "17:00 - 18:30",
    meetingType: "온라인",
    currentMembers: 4,
    maxMembers: 4,
    deadline: "마감",
    status: "마감",
    owner: "서지훈",
    accent: "orange",
  },
  {
    id: "s4",
    title: "OS 과제 같이 디버깅해요",
    subject: "운영체제",
    description: "C와 Linux 환경이 익숙하지 않아도 괜찮습니다. 과제 진행 전 개념부터 함께 봐요.",
    days: ["토"],
    time: "13:00 - 16:00",
    meetingType: "오프라인",
    currentMembers: 1,
    maxMembers: 4,
    deadline: "10월 19일",
    status: "모집 중",
    owner: "이도윤",
    accent: "blue",
  },
];

export const seedApplications: Application[] = [
  {
    id: "a1",
    studyId: "s1",
    studyTitle: "알고리즘 Sprint 4주 완주",
    message: "그래프와 DP를 집중적으로 복습하고 싶어 신청합니다.",
    status: "검토 중",
    createdAt: "오늘",
  },
];

export const seedApplicants: PendingApplicant[] = [
  {
    id: "u1",
    name: "정우진",
    major: "컴퓨터공학과 · 2학년",
    message: "보안 기초부터 차근차근 실습해 보고 싶습니다.",
    status: "검토 중",
  },
  {
    id: "u2",
    name: "윤소희",
    major: "소프트웨어학과 · 3학년",
    message: "팀플에서 입력 검증 파트를 맡고 있어 함께 공부하고 싶어요.",
    status: "검토 중",
  },
];
