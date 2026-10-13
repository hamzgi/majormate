"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  Application,
  categories,
  CommunityCategory,
  currentUser,
  MeetingType,
  PendingApplicant,
  Post,
  seedApplicants,
  seedApplications,
  seedPosts,
  seedStudies,
  Study,
  StudyStatus,
} from "@/lib/demo-data";

type Page = "home" | "community" | "studies" | "my";
type ToastTone = "success" | "neutral";

const navItems: { label: string; href: string; page: Page }[] = [
  { label: "홈", href: "/", page: "home" },
  { label: "커뮤니티", href: "/community", page: "community" },
  { label: "스터디", href: "/studies", page: "studies" },
  { label: "MY", href: "/my", page: "my" },
];

const subjectOptions = ["전체 과목", "알고리즘", "웹 보안", "데이터베이스", "운영체제"];
const dayOptions = ["전체 요일", "월", "화", "수", "목", "금", "토"];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="6.2" /><path d="m16 16 4 4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
    users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="7" r="4" /><path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.48 8.5 8.5 0 0 1-3.64-.8L4 19.5l1.22-3.62A7.36 7.36 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5c4.42 0 8 3.13 8 7Z" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    shield: <><path d="M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    sparkle: <><path d="m12 3-1.1 4.4L7 8.5l3.9 1.1L12 14l1.1-4.4L17 8.5l-3.9-1.1L12 3Z" /><path d="m19 15-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6L19 15Z" /><path d="m5 15-.5 2-2 .5 2 .5.5 2 .5-2 2-.5-2-.5-.5-2Z" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  return <span className={`avatar ${small ? "avatar--small" : ""}`}>{name === currentUser.name ? currentUser.initials : name.slice(0, 1)}</span>;
}

function StatusBadge({ status }: { status: StudyStatus | Application["status"] | PendingApplicant["status"] }) {
  const tone = status === "모집 중" || status === "승인됨" ? "good" : status === "검토 중" ? "wait" : "closed";
  return <span className={`status status--${tone}`}>{status}</span>;
}

function Toast({ message, tone }: { message: string; tone: ToastTone }) {
  return <div role="status" className={`toast toast--${tone}`}><Icon name="check" size={17} />{message}</div>;
}

export function MajorMateApp({ page }: { page: Page }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [studies, setStudies] = useState<Study[]>(seedStudies);
  const [applications, setApplications] = useState<Application[]>(seedApplications);
  const [applicants, setApplicants] = useState<PendingApplicant[]>(seedApplicants);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [form, setForm] = useState<"post" | "study" | "application" | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);

  function tell(message: string, tone: ToastTone = "success") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3600);
  }

  function addPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const content = String(data.get("content") ?? "").trim();
    if (!title || !content) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      category: String(data.get("category")) as CommunityCategory,
      title,
      content,
      tags: String(data.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 3),
      author: currentUser.name,
      createdAt: "방금 전",
      comments: [],
      views: 0,
    };
    setPosts((current) => [post, ...current]);
    setForm(null);
    tell("게시글이 커뮤니티에 등록됐어요.");
  }

  function addStudy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!title || !subject || !description) return;
    const study: Study = {
      id: `s-${Date.now()}`,
      title,
      subject,
      description,
      days: [String(data.get("day") ?? "월")],
      time: String(data.get("time") ?? "19:00 - 21:00"),
      meetingType: String(data.get("meetingType")) as MeetingType,
      currentMembers: 1,
      maxMembers: Number(data.get("maxMembers") ?? 4),
      deadline: String(data.get("deadline") ?? "10월 31일"),
      status: "모집 중",
      owner: currentUser.name,
      accent: "violet",
    };
    setStudies((current) => [study, ...current]);
    setForm(null);
    tell("스터디 모집글을 올렸어요. 이제 신청을 받아 보세요.");
  }

  function applyToStudy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedStudy) return;
    const message = String(new FormData(event.currentTarget).get("message") ?? "").trim();
    if (!message) return;
    setApplications((current) => [{ id: `a-${Date.now()}`, studyId: selectedStudy.id, studyTitle: selectedStudy.title, message, status: "검토 중", createdAt: "방금 전" }, ...current]);
    setForm(null);
    setSelectedStudy(null);
    tell("참여 신청을 보냈어요. 그룹장의 답변을 기다려 보세요.");
  }

  function decideApplicant(id: string, status: "승인됨" | "거절됨") {
    const applicant = applicants.find((person) => person.id === id);
    setApplicants((current) => current.map((person) => person.id === id ? { ...person, status } : person));
    if (status === "승인됨") {
      setStudies((current) => current.map((study) => study.id === "s2" && study.currentMembers < study.maxMembers ? { ...study, currentMembers: study.currentMembers + 1 } : study));
    }
    tell(`${applicant?.name ?? "신청자"}님의 신청을 ${status === "승인됨" ? "승인" : "거절"}했어요.`);
  }

  const postForModal = selectedPost ? posts.find((post) => post.id === selectedPost.id) ?? selectedPost : null;
  const studyForModal = selectedStudy ? studies.find((study) => study.id === selectedStudy.id) ?? selectedStudy : null;

  return <div className="app-shell">
    <header className="topbar">
      <Link href="/" className="brand" aria-label="MajorMate 홈"><span className="brand-mark">M</span><span>MajorMate</span></Link>
      <nav className="nav" aria-label="주요 메뉴">{navItems.map((item) => <Link key={item.page} href={item.href} className={`nav-link ${page === item.page ? "is-active" : ""}`}>{item.label}</Link>)}</nav>
      <div className="profile-area"><span className="demo-pill">DEMO</span><Link href="/my" className="profile-link"><Avatar name={currentUser.name} small /><span>{currentUser.name}</span></Link></div>
    </header>
    <main className="page-wrap">
      {page === "home" && <HomeView posts={posts} studies={studies} onPost={setSelectedPost} onStudy={setSelectedStudy} onNewPost={() => setForm("post")} onNewStudy={() => setForm("study")} />}
      {page === "community" && <CommunityView posts={posts} onPost={setSelectedPost} onNewPost={() => setForm("post")} />}
      {page === "studies" && <StudiesView studies={studies} onStudy={setSelectedStudy} onNewStudy={() => setForm("study")} />}
      {page === "my" && <MyView posts={posts} studies={studies} applications={applications} applicants={applicants} onDecide={decideApplicant} onNewStudy={() => setForm("study")} />}
    </main>
    <footer className="footer"><span>MajorMate</span><span>전공의 연결이 학업의 힘이 되도록.</span><span>데모 버전 · 클라이언트 데이터</span></footer>
    {postForModal && <PostModal post={postForModal} onClose={() => setSelectedPost(null)} onAddComment={(content) => {
      if (!content.trim()) return;
      setPosts((current) => current.map((post) => post.id === postForModal.id ? { ...post, comments: [...post.comments, { id: `c-${Date.now()}`, author: currentUser.name, content: content.trim(), createdAt: "방금 전" }] } : post));
      tell("댓글을 남겼어요.");
    }} />}
    {studyForModal && <StudyModal study={studyForModal} alreadyApplied={applications.some((application) => application.studyId === studyForModal.id)} onClose={() => setSelectedStudy(null)} onApply={() => setForm("application")} />}
    {form === "post" && <PostFormModal onClose={() => setForm(null)} onSubmit={addPost} />}
    {form === "study" && <StudyFormModal onClose={() => setForm(null)} onSubmit={addStudy} />}
    {form === "application" && studyForModal && <ApplicationModal study={studyForModal} onClose={() => setForm(null)} onSubmit={applyToStudy} />}
    {toast && <Toast message={toast.message} tone={toast.tone} />}
  </div>;
}

function HomeView({ posts, studies, onPost, onStudy, onNewPost, onNewStudy }: { posts: Post[]; studies: Study[]; onPost: (post: Post) => void; onStudy: (study: Study) => void; onNewPost: () => void; onNewStudy: () => void }) {
  return <>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="pulse-dot" />COMPUTING MAJOR COMMUNITY</div><h1>혼자 풀던 전공 고민,<br /><em>같이</em> 해답을 찾다.</h1><p>강의 정보부터 시험 준비, 스터디 매칭까지.<br />컴퓨터공학과 학생들을 위한 한 곳의 학업 커뮤니티입니다.</p><div className="hero-actions"><Link href="/studies" className="button button--primary">스터디 둘러보기 <Icon name="arrow" size={17} /></Link><Link href="/community" className="button button--ghost">커뮤니티 가기</Link></div></div>
      <div className="hero-art" aria-label="활성화된 학업 커뮤니티 현황"><div className="orbit orbit--one" /><div className="orbit orbit--two" /><div className="art-core"><span>이번 주</span><strong>17</strong><small>함께하는<br />스터디</small></div><div className="floating-card floating-card--top"><span className="mini-icon mini-icon--mint"><Icon name="message" size={17} /></span><div><b>새 질문 24개</b><small>답변을 기다리고 있어요</small></div></div><div className="floating-card floating-card--bottom"><span className="mini-icon mini-icon--orange"><Icon name="users" size={17} /></span><div><b>매칭률 86%</b><small>이번 주 스터디 기준</small></div></div><span className="hero-star hero-star--one">✦</span><span className="hero-star hero-star--two">✦</span></div>
    </section>
    <section className="stat-grid" aria-label="MajorMate 현황"><StatCard value="1,284" label="전공 커뮤니티 멤버" icon="users" tone="violet" /><StatCard value="17" label="지금 모집 중인 스터디" icon="book" tone="mint" /><StatCard value="86%" label="조건 기반 매칭 성공률" icon="sparkle" tone="orange" /></section>
    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">START HERE</span><h2>지금 필요한 학업 활동을<br />바로 시작해 보세요.</h2></div><span className="section-note">클릭해서 데모 흐름을 체험해 보세요</span></div><div className="feature-grid"><article className="feature-card feature-card--community"><div className="feature-visual"><div className="visual-message">자료구조 복습<br /><span>같이 하실 분?</span></div><div className="visual-typing">답변을 남겨 보세요 <span>↗</span></div></div><div className="feature-content"><span className="feature-number">01</span><h3>전공 커뮤니티</h3><p>강의·과제 정보와 전공 고민을 안전하게 나누세요.</p><button className="text-button" onClick={onNewPost}>게시글 작성 <Icon name="arrow" size={16} /></button></div></article><article className="feature-card feature-card--study"><div className="feature-visual"><div className="schedule-chip"><Icon name="calendar" size={15} /> 월 · 목</div><div className="study-stack"><b>알고리즘 Sprint</b><span><i /> 3 / 5 명 참여 중</span></div><span className="meeting-dot" /></div><div className="feature-content"><span className="feature-number">02</span><h3>스터디 매칭</h3><p>과목, 요일, 방식이 맞는 팀원을 찾아보세요.</p><button className="text-button" onClick={onNewStudy}>스터디 만들기 <Icon name="arrow" size={16} /></button></div></article></div></section>
    <section className="section-block split-section"><div className="feed-panel"><SectionHead kicker="COMMUNITY FEED" title="뜨거운 전공 이야기" href="/community" /> <div className="post-list">{posts.slice(0, 3).map((post) => <PostRow key={post.id} post={post} onClick={() => onPost(post)} />)}</div></div><div className="study-panel"><SectionHead kicker="STUDY PICK" title="이 스터디 어때요?" href="/studies" /> <div className="home-study-list">{studies.filter((study) => study.status === "모집 중").slice(0, 2).map((study) => <CompactStudy key={study.id} study={study} onClick={() => onStudy(study)} />)}</div></div></section>
  </>;
}

function StatCard({ value, label, icon, tone }: { value: string; label: string; icon: string; tone: string }) {
  return <article className="stat-card"><span className={`stat-icon stat-icon--${tone}`}><Icon name={icon} size={21} /></span><div><strong>{value}</strong><p>{label}</p></div></article>;
}

function SectionHead({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return <div className="section-heading section-heading--compact"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2></div>{href && <Link href={href} className="see-all">전체 보기 <Icon name="chevron" size={15} /></Link>}</div>;
}

function CommunityView({ posts, onPost, onNewPost }: { posts: Post[]; onPost: (post: Post) => void; onNewPost: () => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"전체" | CommunityCategory>("전체");
  const filtered = useMemo(() => posts.filter((post) => (category === "전체" || post.category === category) && `${post.title} ${post.content} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [posts, category, query]);
  return <><section className="page-intro"><div><div className="eyebrow eyebrow--dark"><span className="pulse-dot" />MAJOR COMMUNITY</div><h1>전공 이야기가<br /><em>쌓이는 곳.</em></h1><p>질문하고, 해결하고, 더 나은 학업 경험을 만들어 보세요.</p></div><button className="button button--primary" onClick={onNewPost}><Icon name="plus" size={18} /> 글쓰기</button></section><section className="community-layout"><div className="community-main"><div className="filter-bar"><div className="search-field"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 내용, 태그를 검색해 보세요" aria-label="게시글 검색" /></div><div className="category-tabs" aria-label="게시판 카테고리"><button onClick={() => setCategory("전체")} className={category === "전체" ? "is-selected" : ""}>전체</button>{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? "is-selected" : ""}>{item}</button>)}</div></div><div className="list-meta"><span><b>{filtered.length}</b>개의 게시글</span><span>최신순 ▾</span></div><div className="post-list post-list--full">{filtered.map((post) => <PostRow key={post.id} post={post} onClick={() => onPost(post)} />)}{filtered.length === 0 && <EmptyState title="검색 결과가 없어요" body="다른 검색어나 카테고리로 다시 찾아보세요." />}</div></div><aside className="community-aside"><div className="side-card side-card--notice"><div className="side-card-head"><span className="side-icon"><Icon name="shield" size={18} /></span><b>안전한 커뮤니티</b></div><p>MajorMate는 게시글과 댓글을 텍스트로 안전하게 표시하는 데모입니다.</p><span className="side-link">보안 원칙 보기 <Icon name="arrow" size={14} /></span></div><div className="side-card"><div className="side-card-head"><span className="side-icon side-icon--peach"><Icon name="calendar" size={18} /></span><b>이번 주 학업 리듬</b></div><ul className="mini-schedule"><li><span>MON</span><b>알고리즘 문제 풀이</b><small>19:30</small></li><li><span>WED</span><b>웹 보안 실습</b><small>18:00</small></li><li><span>SAT</span><b>운영체제 과제</b><small>13:00</small></li></ul></div></aside></section></>;
}

function StudiesView({ studies, onStudy, onNewStudy }: { studies: Study[]; onStudy: (study: Study) => void; onNewStudy: () => void }) {
  const [subject, setSubject] = useState("전체 과목");
  const [day, setDay] = useState("전체 요일");
  const [meetingType, setMeetingType] = useState<"전체" | MeetingType>("전체");
  const [status, setStatus] = useState<"전체" | StudyStatus>("모집 중");
  const filtered = useMemo(() => studies.filter((study) => (subject === "전체 과목" || study.subject === subject) && (day === "전체 요일" || study.days.includes(day)) && (meetingType === "전체" || study.meetingType === meetingType) && (status === "전체" || study.status === status)), [studies, subject, day, meetingType, status]);
  return <><section className="page-intro page-intro--study"><div><div className="eyebrow eyebrow--dark"><span className="pulse-dot" />STUDY MATCHING</div><h1>나와 맞는 시간,<br /><em>같은 목표의 사람.</em></h1><p>조건을 선택하면 함께 공부할 전공 친구를 더 쉽게 찾을 수 있어요.</p></div><button className="button button--primary" onClick={onNewStudy}><Icon name="plus" size={18} /> 스터디 모집</button></section><section className="study-search"><div className="filter-title"><Icon name="filter" size={19} /><b>내 조건으로 찾기</b></div><div className="study-filters"><label>과목<select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjectOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>요일<select value={day} onChange={(event) => setDay(event.target.value)}>{dayOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>진행 방식<div className="choice-toggle"><button onClick={() => setMeetingType("전체")} className={meetingType === "전체" ? "is-selected" : ""}>전체</button><button onClick={() => setMeetingType("온라인")} className={meetingType === "온라인" ? "is-selected" : ""}>온라인</button><button onClick={() => setMeetingType("오프라인")} className={meetingType === "오프라인" ? "is-selected" : ""}>오프라인</button></div></label><label>모집 상태<div className="choice-toggle"><button onClick={() => setStatus("모집 중")} className={status === "모집 중" ? "is-selected" : ""}>모집 중</button><button onClick={() => setStatus("전체")} className={status === "전체" ? "is-selected" : ""}>전체</button></div></label></div></section><div className="results-head"><span><b>{filtered.length}</b>개의 스터디를 찾았어요</span><span>추천순 ▾</span></div><section className="study-grid">{filtered.map((study) => <StudyCard key={study.id} study={study} onClick={() => onStudy(study)} />)}{filtered.length === 0 && <EmptyState title="조건에 맞는 스터디가 없어요" body="필터를 조금 넓혀서 다시 찾아보세요." />}</section><section className="match-banner"><div><span className="banner-icon"><Icon name="sparkle" size={23} /></span><div><b>딱 맞는 스터디가 보이지 않나요?</b><p>모집글을 올리면 비슷한 조건의 학생에게 더 빨리 닿을 수 있어요.</p></div></div><button className="button button--light" onClick={onNewStudy}>내 스터디 만들기 <Icon name="arrow" size={16} /></button></section></>;
}

function MyView({ posts, studies, applications, applicants, onDecide, onNewStudy }: { posts: Post[]; studies: Study[]; applications: Application[]; applicants: PendingApplicant[]; onDecide: (id: string, status: "승인됨" | "거절됨") => void; onNewStudy: () => void }) {
  const myStudies = studies.filter((study) => study.owner === currentUser.name);
  const myPosts = posts.filter((post) => post.author === currentUser.name);
  return <><section className="my-hero"><div className="my-avatar"><Avatar name={currentUser.name} /></div><div><span className="eyebrow eyebrow--dark">MY MAJORMATE</span><h1>안녕하세요, <em>민서님</em>!</h1><p>{currentUser.major} · 이번 주도 한 걸음씩 함께해요.</p></div><div className="my-hero-stat"><strong>{applications.filter((application) => application.status === "검토 중").length}</strong><span>답변 대기 중인<br />스터디 신청</span></div></section><section className="my-grid"><div className="my-main"><SectionHead kicker="MY APPLICATIONS" title="내 스터디 신청" /><div className="application-list">{applications.map((application) => <article className="application-item" key={application.id}><div className="application-mark"><Icon name="book" size={19} /></div><div><b>{application.studyTitle}</b><p>{application.message}</p><small>{application.createdAt} 신청</small></div><StatusBadge status={application.status} /></article>)}</div><div className="my-section-gap"><SectionHead kicker="MY POSTS" title="내가 쓴 글" /></div><div className="post-list">{myPosts.length ? myPosts.map((post) => <PostRow key={post.id} post={post} onClick={() => undefined} />) : <EmptyState title="아직 작성한 글이 없어요" body="커뮤니티에서 전공 이야기를 나눠 보세요." />}</div></div><aside className="my-aside"><div className="my-study-card"><div className="my-study-top"><span><Icon name="users" size={18} /></span><b>내가 모집 중인 스터디</b></div>{myStudies.map((study) => <div className="owned-study" key={study.id}><div><h3>{study.title}</h3><p>{study.subject} · {study.days.join(" · ")} {study.time}</p></div><div className="capacity"><b>{study.currentMembers}<small>/{study.maxMembers}</small></b><span>현재 인원</span></div></div>)}<button className="button button--outline button--full" onClick={onNewStudy}><Icon name="plus" size={16} /> 새 스터디 모집</button></div><div className="approval-card"><div className="approval-title"><div><span className="section-kicker">LEADER DESK</span><h2>참여 신청 관리</h2></div><span className="pending-counter">{applicants.filter((applicant) => applicant.status === "검토 중").length}</span></div>{applicants.map((applicant) => <article className="applicant" key={applicant.id}><Avatar name={applicant.name} small /><div className="applicant-info"><b>{applicant.name}</b><small>{applicant.major}</small><p>“{applicant.message}”</p>{applicant.status === "검토 중" ? <div className="decision-buttons"><button onClick={() => onDecide(applicant.id, "거절됨")}>거절</button><button onClick={() => onDecide(applicant.id, "승인됨")}>승인</button></div> : <StatusBadge status={applicant.status} />}</div></article>)}</div></aside></section></>;
}

function PostRow({ post, onClick }: { post: Post; onClick: () => void }) {
  return <button type="button" className="post-row" onClick={onClick}><div className="post-row-top"><span className={`category category--${post.category.replace("·", "-")}`}>{post.category}</span><span className="post-time">{post.createdAt}</span></div><h3>{post.title}</h3><p>{post.content}</p><div className="post-meta"><span><Avatar name={post.author} small />{post.author}</span><span><Icon name="message" size={14} /> {post.comments.length}</span><span>조회 {post.views}</span></div></button>;
}

function CompactStudy({ study, onClick }: { study: Study; onClick: () => void }) {
  return <button className={`compact-study compact-study--${study.accent}`} onClick={onClick}><div><div className="compact-study-heading"><span>{study.subject}</span><StatusBadge status={study.status} /></div><h3>{study.title}</h3><p><Icon name="calendar" size={14} /> {study.days.join(" · ")} · {study.time}</p></div><div className="compact-study-count"><b>{study.currentMembers}<small>/{study.maxMembers}</small></b><span>명 참여 중</span></div></button>;
}

function StudyCard({ study, onClick }: { study: Study; onClick: () => void }) {
  const percentage = Math.round((study.currentMembers / study.maxMembers) * 100);
  return <button className={`study-card study-card--${study.accent}`} onClick={onClick}><div className="study-card-top"><span className="study-subject">{study.subject}</span><StatusBadge status={study.status} /></div><h2>{study.title}</h2><p>{study.description}</p><div className="study-info"><span><Icon name="calendar" size={15} />{study.days.join(" · ")}</span><span><Icon name="clock" size={15} />{study.time}</span><span><Icon name={study.meetingType === "온라인" ? "message" : "pin"} size={15} />{study.meetingType}</span></div><div className="study-card-footer"><div className="member-progress"><div><span>참여 인원</span><b>{study.currentMembers}<small> / {study.maxMembers}</small></b></div><div className="progress"><i style={{ width: `${percentage}%` }} /></div></div><span className="deadline">~ {study.deadline}</span></div></button>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><span><Icon name="search" size={24} /></span><b>{title}</b><p>{body}</p></div>;
}

function Modal({ children, onClose, wide = false }: { children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`modal ${wide ? "modal--wide" : ""}`} role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="닫기"><Icon name="close" size={20} /></button>{children}</section></div>;
}

function PostModal({ post, onClose, onAddComment }: { post: Post; onClose: () => void; onAddComment: (content: string) => void }) {
  const [comment, setComment] = useState("");
  function submitComment(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onAddComment(comment); setComment(""); }
  return <Modal onClose={onClose} wide><div className="modal-category"><span className={`category category--${post.category.replace("·", "-")}`}>{post.category}</span><span>{post.createdAt} · 조회 {post.views}</span></div><h2 className="modal-title">{post.title}</h2><div className="modal-author"><Avatar name={post.author} /><div><b>{post.author}</b><span>컴퓨터공학과</span></div></div><p className="post-content">{post.content}</p><div className="tag-row">{post.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="comments"><h3>댓글 <span>{post.comments.length}</span></h3>{post.comments.map((item) => <article className="comment" key={item.id}><Avatar name={item.author} small /><div><div><b>{item.author}</b><small>{item.createdAt}</small></div><p>{item.content}</p></div></article>)}<form className="comment-form" onSubmit={submitComment}><Avatar name={currentUser.name} small /><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="안전한 댓글을 남겨 보세요" aria-label="댓글 내용" /><button type="submit">등록</button></form></div></Modal>;
}

function StudyModal({ study, alreadyApplied, onClose, onApply }: { study: Study; alreadyApplied: boolean; onClose: () => void; onApply: () => void }) {
  const isMine = study.owner === currentUser.name;
  return <Modal onClose={onClose} wide><div className="study-modal-header"><div><div className="compact-study-heading"><span className="study-subject">{study.subject}</span><StatusBadge status={study.status} /></div><h2 className="modal-title">{study.title}</h2><div className="modal-author"><Avatar name={study.owner} /><div><b>{study.owner}</b><span>스터디 그룹장</span></div></div></div><div className={`modal-study-icon modal-study-icon--${study.accent}`}><Icon name="book" size={28} /></div></div><p className="post-content">{study.description}</p><div className="study-detail-grid"><div><Icon name="calendar" size={18} /><div><small>모임 요일</small><b>{study.days.join(" · ")}</b></div></div><div><Icon name="clock" size={18} /><div><small>모임 시간</small><b>{study.time}</b></div></div><div><Icon name={study.meetingType === "온라인" ? "message" : "pin"} size={18} /><div><small>진행 방식</small><b>{study.meetingType}</b></div></div><div><Icon name="users" size={18} /><div><small>참여 인원</small><b>{study.currentMembers} / {study.maxMembers}명</b></div></div></div><div className="modal-study-actions">{isMine ? <div className="owner-message"><Icon name="check" size={18} />내가 모집 중인 스터디예요. MY에서 신청을 관리해 보세요.</div> : study.status === "마감" ? <button className="button button--disabled" disabled>모집이 마감됐어요</button> : alreadyApplied ? <div className="owner-message"><Icon name="clock" size={18} />참여 신청을 보냈어요. 승인 결과를 기다려 보세요.</div> : <button className="button button--primary button--wide" onClick={onApply}>이 스터디에 참여 신청 <Icon name="arrow" size={17} /></button>}</div></Modal>;
}

function PostFormModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal onClose={onClose}><form className="entry-form" onSubmit={onSubmit}><div className="form-heading"><span className="form-icon"><Icon name="message" size={21} /></span><div><span className="section-kicker">NEW POST</span><h2>전공 이야기를 나눠요</h2></div></div><label>카테고리<select name="category" defaultValue="질문">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>제목<input name="title" maxLength={80} placeholder="예: 자료구조 중간고사 같이 복습할 분" required /></label><label>내용<textarea name="content" rows={5} maxLength={1000} placeholder="질문이나 공유하고 싶은 정보를 작성해 주세요." required /></label><label>태그 <small>쉼표로 구분</small><input name="tags" maxLength={80} placeholder="예: 자료구조, 중간고사, 복습" /></label><button className="button button--primary button--wide" type="submit">게시글 등록하기 <Icon name="arrow" size={17} /></button></form></Modal>;
}

function StudyFormModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal onClose={onClose} wide><form className="entry-form" onSubmit={onSubmit}><div className="form-heading"><span className="form-icon form-icon--mint"><Icon name="users" size={21} /></span><div><span className="section-kicker">NEW STUDY</span><h2>함께할 스터디를 모집해요</h2></div></div><div className="form-two"><label>스터디 제목<input name="title" maxLength={60} placeholder="예: 알고리즘 4주 완주" required /></label><label>과목 또는 분야<input name="subject" maxLength={30} placeholder="예: 알고리즘" required /></label></div><label>스터디 목표<textarea name="description" rows={3} maxLength={500} placeholder="어떤 방식으로, 무엇을 공부할지 알려 주세요." required /></label><div className="form-three"><label>선호 요일<select name="day" defaultValue="월">{dayOptions.slice(1).map((day) => <option key={day}>{day}</option>)}</select></label><label>시간<input name="time" defaultValue="19:00 - 21:00" required /></label><label>진행 방식<select name="meetingType" defaultValue="온라인"><option>온라인</option><option>오프라인</option></select></label></div><div className="form-two"><label>모집 인원<select name="maxMembers" defaultValue="4"><option value="3">3명</option><option value="4">4명</option><option value="5">5명</option><option value="6">6명</option></select></label><label>모집 마감일<input name="deadline" defaultValue="10월 31일" required /></label></div><button className="button button--primary button--wide" type="submit">스터디 모집글 등록 <Icon name="arrow" size={17} /></button></form></Modal>;
}

function ApplicationModal({ study, onClose, onSubmit }: { study: Study; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal onClose={onClose}><form className="entry-form" onSubmit={onSubmit}><div className="form-heading"><span className="form-icon form-icon--mint"><Icon name="sparkle" size={21} /></span><div><span className="section-kicker">STUDY APPLICATION</span><h2>참여 신청하기</h2></div></div><div className="application-study"><span>{study.subject}</span><b>{study.title}</b><small>{study.days.join(" · ")} · {study.time} · {study.meetingType}</small></div><label>그룹장에게 남길 메시지<textarea name="message" rows={5} maxLength={500} placeholder="예: 관련 과목을 수강했고, 매주 성실하게 참여할 수 있습니다." required /></label><p className="form-notice"><Icon name="shield" size={15} />작성한 내용은 이 데모 브라우저 세션에서만 표시됩니다.</p><button className="button button--primary button--wide" type="submit">참여 신청 보내기 <Icon name="arrow" size={17} /></button></form></Modal>;
}
