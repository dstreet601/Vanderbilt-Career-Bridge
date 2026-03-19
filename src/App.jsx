import { useState, useRef, useCallback } from "react";
import mammoth from "mammoth";
import InterviewQuestionGenerator from "./InterviewQuestionGenerator";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GOLD = "#CFB53B";
const GOLD_DIM = "rgba(207,181,59,0.12)";
const GOLD_BORDER = "rgba(207,181,59,0.28)";
const BG = "#080808";
const SURFACE = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const GREEN = "#4ade80";
const GREEN_DIM = "rgba(74,222,128,0.1)";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const VANDERBILT_ORGS = [
  // ── FINANCE & BUSINESS ──
  { id: 1, name: "Vanderbilt Investment Club", acronym: "VIC", category: "Finance & Business", mission: "Educating students about financial markets, investment strategies, and portfolio management through hands-on stock pitching and research.", skills: ["Financial analysis", "Research & due diligence", "Presentation & pitching", "Risk assessment", "Quantitative modeling", "Excel & data tools"], icon: "📈", members: 120, founded: 2008 },
  { id: 2, name: "Vanderbilt Finance and Real Estate Club", acronym: "VFREC", category: "Finance & Business", mission: "Exploring real estate investment, development, and finance through case competitions, site visits, and industry speaker events.", skills: ["Real estate valuation", "Financial modeling", "Market analysis", "Deal structuring", "Due diligence", "Presentation skills"], icon: "🏗️", members: 75, founded: 2015 },
  { id: 3, name: "Vanderbilt Women in Business", acronym: "VWiB", category: "Finance & Business", mission: "Empowering women in business through networking, mentorship, speaker events, and case competitions with leading companies.", skills: ["Networking", "Leadership development", "Public speaking", "Mentorship", "Career development", "Stakeholder relations"], icon: "💼", members: 160, founded: 2011 },
  { id: 4, name: "Vanderbilt Business Review", acronym: "VBR", category: "Finance & Business", mission: "Publishing student analysis of business strategy, economics, and management to develop rigorous business research and writing skills.", skills: ["Business research", "Academic writing", "Editing & peer review", "Strategic analysis", "Content curation", "Deadline management"], icon: "📰", members: 50, founded: 2013 },
  { id: 5, name: "Vanderbilt Black Business Student Association", acronym: "VBBSA", category: "Finance & Business", mission: "Supporting Black students in business through professional development, networking, and mentorship with industry leaders.", skills: ["Networking", "Community organizing", "Advocacy & DEI", "Career development", "Event planning", "Partnership development"], icon: "🤝", members: 90, founded: 2009 },
  { id: 6, name: "Vanderbilt Commodores Capital Management", acronym: "VCCM", category: "Finance & Business", mission: "Managing a real student-run investment fund with actual capital, providing hands-on portfolio management and securities analysis experience.", skills: ["Portfolio management", "Securities analysis", "Financial modeling", "Quantitative modeling", "Risk assessment", "Excel & data tools"], icon: "💰", members: 35, founded: 2014 },
  { id: 7, name: "Vanderbilt Private Equity & Venture Capital Club", acronym: "VPEVC", category: "Finance & Business", mission: "Exploring private equity and venture capital through deal sourcing, due diligence projects, and networking with fund professionals.", skills: ["Due diligence", "Deal structuring", "Financial modeling", "Market research", "Fundraising & pitching", "Networking"], icon: "🏦", members: 60, founded: 2016 },

  // ── CONSULTING ──
  { id: 8, name: "Vanderbilt Consulting Group", acronym: "VCG", category: "Consulting", mission: "Providing pro-bono consulting services to Nashville nonprofits and startups while developing students' strategic problem-solving abilities.", skills: ["Strategic thinking", "Client management", "Data analysis", "Slide deck creation", "Team leadership", "Project scoping"], icon: "💡", members: 85, founded: 2012 },
  { id: 9, name: "180 Degrees Consulting", acronym: "180DC", category: "Consulting", mission: "The world's largest student consulting organization, delivering impactful consulting projects to nonprofits and social enterprises in Nashville.", skills: ["Strategic thinking", "Client management", "Project management", "Data analysis", "Social impact", "Team leadership"], icon: "🔄", members: 65, founded: 2013 },
  { id: 10, name: "Vanderbilt Healthcare Consulting Group", acronym: "VHCG", category: "Consulting", mission: "Applying consulting frameworks to healthcare challenges, partnering with Nashville's healthcare industry on strategy and operations projects.", skills: ["Healthcare strategy", "Data analysis", "Client management", "Regulatory knowledge", "Research", "Presentation & pitching"], icon: "🏥", members: 45, founded: 2017 },

  // ── TECHNOLOGY ──
  { id: 11, name: "Vanderbilt Data Science Club", acronym: "VDSC", category: "Technology", mission: "Building data literacy through workshops, Kaggle competitions, and real-world machine learning projects with industry partners.", skills: ["Machine learning", "Python & SQL", "Data visualization", "Statistical modeling", "Project management", "A/B testing"], icon: "🔬", members: 95, founded: 2016 },
  { id: 12, name: "Vanderbilt Coding Bootcamp Club", acronym: "VCBC", category: "Technology", mission: "Teaching students to code from scratch through project-based learning, hackathons, and industry mentorship programs.", skills: ["Full-stack development", "JavaScript & React", "Version control (Git)", "API integration", "Debugging", "Agile methodology"], icon: "💻", members: 180, founded: 2017 },
  { id: 13, name: "VandyHacks", acronym: "VH", category: "Technology", mission: "Organizing Vanderbilt's annual 24-hour hackathon, bringing together hundreds of students to build innovative tech projects and compete for prizes.", skills: ["Event planning", "Sponsorship & fundraising", "Project management", "Tech community building", "Logistics", "Team leadership"], icon: "⚡", members: 120, founded: 2014 },
  { id: 14, name: "Vanderbilt Blockchain Club", acronym: "VBC", category: "Technology", mission: "Exploring blockchain technology, Web3, and decentralized finance through research, workshops, and industry connections.", skills: ["Blockchain development", "Financial analysis", "Research", "Emerging technology", "Community building", "Technical writing"], icon: "⛓️", members: 70, founded: 2018 },
  { id: 15, name: "Vanderbilt AI Club", acronym: "VAIC", category: "Technology", mission: "Fostering AI literacy and applied machine learning skills through project teams, reading groups, and industry speaker events.", skills: ["Machine learning", "Python & SQL", "Research", "Technical writing", "Emerging technology", "A/B testing"], icon: "🤖", members: 110, founded: 2019 },
  { id: 16, name: "Vanderbilt IEEE Student Branch", acronym: "IEEE-VU", category: "Technology", mission: "Connecting electrical and computer engineering students with professional development, technical workshops, and the global IEEE network.", skills: ["Electrical engineering", "Technical presentations", "Networking", "Project management", "Circuit design", "Research"], icon: "⚙️", members: 80, founded: 1995 },
  { id: 17, name: "Association for Computing Machinery", acronym: "ACM-VU", category: "Technology", mission: "Building a community for computer science students through coding competitions, technical talks, and career development resources.", skills: ["Algorithms", "Full-stack development", "Problem-solving", "Technical presentations", "Community building", "Version control (Git)"], icon: "🖥️", members: 150, founded: 2000 },
  { id: 18, name: "Vanderbilt Cybersecurity Club", acronym: "VCC", category: "Technology", mission: "Developing cybersecurity skills through CTF competitions, ethical hacking workshops, and networking with security professionals.", skills: ["Cybersecurity", "Problem-solving", "Debugging", "Attention to detail", "Research", "Technical writing"], icon: "🔐", members: 60, founded: 2018 },

  // ── ENGINEERING ──
  { id: 19, name: "Engineers Without Borders", acronym: "EWB", category: "Engineering", mission: "Partnering with communities in developing regions to implement sustainable engineering solutions for water, sanitation, and infrastructure.", skills: ["Engineering design", "Cross-cultural communication", "Project management", "Sustainability", "Problem-solving", "Field research"], icon: "🌍", members: 70, founded: 2004 },
  { id: 20, name: "Vanderbilt Society of Women Engineers", acronym: "SWE-VU", category: "Engineering", mission: "Inspiring and supporting women in engineering through mentorship, outreach, career fairs, and community building.", skills: ["Mentorship", "Community organizing", "Engineering design", "Career development", "Advocacy & DEI", "Networking"], icon: "👩‍🔬", members: 100, founded: 2000 },
  { id: 21, name: "American Society of Civil Engineers", acronym: "ASCE-VU", category: "Engineering", mission: "Developing civil engineers through design competitions, technical workshops, and exposure to infrastructure and environmental projects.", skills: ["Engineering design", "Sustainability", "Project management", "Teamwork", "Technical presentations", "Problem-solving"], icon: "🏛️", members: 55, founded: 1985 },
  { id: 22, name: "Vanderbilt Aerospace Club", acronym: "VAC", category: "Engineering", mission: "Designing and launching high-powered rockets and drones through competitions including NASA Student Launch and AIAA Design/Build/Fly.", skills: ["Engineering design", "Systems thinking", "Project management", "Problem-solving", "Teamwork", "Technical writing"], icon: "🚀", members: 65, founded: 2008 },
  { id: 23, name: "Vanderbilt Biomedical Engineering Society", acronym: "VBMES", category: "Engineering", mission: "Connecting pre-health and engineering students through medical device design projects, clinical shadowing, and industry networking.", skills: ["Biomedical research", "Engineering design", "Cross-disciplinary collaboration", "Research", "Technical presentations", "Problem-solving"], icon: "🧬", members: 85, founded: 2005 },
  { id: 24, name: "Formula SAE Vanderbilt", acronym: "FSAE-VU", category: "Engineering", mission: "Designing, building, and racing a formula-style race car each year, competing in national FSAE competitions.", skills: ["Engineering design", "Project management", "Teamwork", "Problem-solving", "Budget management", "Technical writing"], icon: "🏎️", members: 90, founded: 2002 },
  { id: 25, name: "Vanderbilt Robotics Club", acronym: "VRC", category: "Engineering", mission: "Building autonomous robots for national competitions including RoboSub and ground vehicle challenges.", skills: ["Robotics", "Python & SQL", "Engineering design", "Problem-solving", "Project management", "Teamwork"], icon: "🤖", members: 55, founded: 2010 },

  // ── HEALTHCARE & PRE-MED ──
  { id: 26, name: "Vanderbilt Medical Ethics Society", acronym: "VMES", category: "Healthcare", mission: "Exploring the intersection of medicine, law, and philosophy to prepare future healthcare leaders for complex ethical decisions.", skills: ["Critical thinking", "Written communication", "Research", "Ethical reasoning", "Cross-disciplinary collaboration", "Regulatory knowledge"], icon: "⚕️", members: 60, founded: 2005 },
  { id: 27, name: "Vanderbilt Global Health Initiative", acronym: "VGHI", category: "Healthcare", mission: "Connecting students to global health fieldwork, research partnerships, and policy advocacy to address health disparities worldwide.", skills: ["Public health research", "Grant writing", "Community outreach", "Data collection", "Cross-cultural awareness", "Program evaluation"], icon: "🌐", members: 90, founded: 2009 },
  { id: 28, name: "American Medical Student Association – Vanderbilt", acronym: "AMSA-VU", category: "Healthcare", mission: "Advocating for progressive change in healthcare and developing future physicians through education, advocacy, and community health projects.", skills: ["Healthcare advocacy", "Community outreach", "Research", "Ethical reasoning", "Public health research", "Event planning"], icon: "🩺", members: 200, founded: 1996 },
  { id: 29, name: "Vanderbilt Student Volunteers for Science", acronym: "VSVS", category: "Healthcare", mission: "Teaching hands-on science lessons to 5th–8th grade students in Nashville public schools, making science accessible and exciting.", skills: ["Science communication", "Teaching & tutoring", "Community outreach", "Curriculum development", "Cross-cultural communication", "Teamwork"], icon: "🔭", members: 150, founded: 1992 },
  { id: 30, name: "Pre-Dental Society at Vanderbilt", acronym: "VPD", category: "Healthcare", mission: "Supporting pre-dental students through DAT prep, dental school advising, shadowing opportunities, and community dental outreach.", skills: ["Community outreach", "Research", "Leadership development", "Mentorship", "Career development", "Event planning"], icon: "🦷", members: 80, founded: 2008 },
  { id: 31, name: "Vanderbilt Emergency Medical Services", acronym: "VEMS", category: "Healthcare", mission: "Providing emergency medical response on campus while training students in EMT skills and pre-hospital care.", skills: ["Emergency response", "Crisis management", "Team coordination", "Decision-making under pressure", "Medical training", "Community service"], icon: "🚑", members: 45, founded: 2000 },
  { id: 32, name: "Vanderbilt Psychiatric Outreach", acronym: "VPO", category: "Healthcare", mission: "Reducing mental health stigma and increasing access to mental health resources through outreach, education, and peer support programs.", skills: ["Mental health advocacy", "Community outreach", "Program development", "Communication", "Advocacy & DEI", "Event planning"], icon: "🧠", members: 70, founded: 2015 },

  // ── LEGAL & POLICY ──
  { id: 33, name: "Vanderbilt Pre-Law Society", acronym: "VPLS", category: "Legal & Policy", mission: "Preparing aspiring attorneys through mock trial, moot court, law school advising, and networking with legal professionals.", skills: ["Legal research", "Argumentation", "Writing & brief drafting", "Case analysis", "Oral advocacy", "Attention to detail"], icon: "⚖️", members: 130, founded: 1999 },
  { id: 34, name: "Vanderbilt Mock Trial", acronym: "VMT", category: "Legal & Policy", mission: "Competing in regional and national mock trial tournaments, developing courtroom advocacy, witness examination, and legal argumentation skills.", skills: ["Oral advocacy", "Argumentation", "Critical analysis", "Writing & brief drafting", "Performance under pressure", "Teamwork"], icon: "🏛️", members: 60, founded: 2002 },
  { id: 35, name: "Vanderbilt Political Review", acronym: "VPR", category: "Legal & Policy", mission: "Publishing non-partisan political analysis and commentary to foster informed civic engagement and policy discussion at Vanderbilt.", skills: ["Policy analysis", "Academic writing", "Editing & peer review", "Research", "Critical thinking", "Deadline management"], icon: "🗳️", members: 55, founded: 2010 },
  { id: 36, name: "Vandy College Democrats", acronym: "VCD", category: "Legal & Policy", mission: "Engaging Vanderbilt students in the democratic process through voter registration, candidate campaigns, and progressive policy advocacy.", skills: ["Political organizing", "Advocacy & DEI", "Canvassing", "Public speaking", "Community organizing", "Coalition building"], icon: "🔵", members: 110, founded: 2004 },
  { id: 37, name: "Vandy College Republicans", acronym: "VCR", category: "Legal & Policy", mission: "Promoting conservative and libertarian principles through campus events, debates, and engagement with elected officials.", skills: ["Political organizing", "Debate", "Public speaking", "Policy analysis", "Community organizing", "Event planning"], icon: "🔴", members: 90, founded: 2000 },
  { id: 38, name: "Vanderbilt International Law Society", acronym: "VILS", category: "Legal & Policy", mission: "Exploring international law and global governance through speaker events, moot court competitions, and cross-cultural dialogue.", skills: ["Legal research", "Argumentation", "Cross-cultural communication", "Policy analysis", "Written communication", "Networking"], icon: "🌏", members: 50, founded: 2007 },

  // ── LEADERSHIP & GOVERNANCE ──
  { id: 39, name: "Vanderbilt Student Government", acronym: "VSG", category: "Leadership", mission: "Representing all Vanderbilt students in university governance, managing a multimillion-dollar student activities budget, and driving campus change.", skills: ["Public speaking", "Budget management", "Policy analysis", "Stakeholder relations", "Conflict resolution", "Coalition building"], icon: "🏛️", members: 200, founded: 1875 },
  { id: 40, name: "Honor Council", acronym: "HC", category: "Leadership", mission: "Upholding Vanderbilt's honor code through peer-led investigations, adjudications, and academic integrity education for the entire student body.", skills: ["Ethical reasoning", "Conflict resolution", "Attention to detail", "Written communication", "Oral advocacy", "Decision-making"], icon: "⚖️", members: 40, founded: 1875 },
  { id: 41, name: "Vanderbilt Residential College Association", acronym: "VRCA", category: "Leadership", mission: "Coordinating residential college community building, programming, and student government across all of Vanderbilt's residential colleges.", skills: ["Community organizing", "Event planning", "Budget management", "Stakeholder relations", "Team leadership", "Communication"], icon: "🏠", members: 80, founded: 1980 },
  { id: 42, name: "Vanderbilt Programming Board", acronym: "VPB", category: "Leadership", mission: "Producing Vanderbilt's major campus events, including the annual Rites of Spring concert, Homecoming, and Late Night programming.", skills: ["Event planning", "Budget management", "Vendor management", "Marketing", "Logistics", "Team leadership"], icon: "🎭", members: 100, founded: 1975 },

  // ── CULTURAL & IDENTITY ──
  { id: 43, name: "Black Student Alliance", acronym: "BSA", category: "Cultural & Identity", mission: "Celebrating Black culture, fostering community, and advocating for equity and inclusion across Vanderbilt and the greater Nashville area.", skills: ["Community organizing", "Event planning", "Advocacy & DEI", "Partnership development", "Cultural programming", "Budget oversight"], icon: "✊", members: 300, founded: 1968 },
  { id: 44, name: "Asian American Student Association", acronym: "AASA", category: "Cultural & Identity", mission: "Celebrating Asian and Pacific Islander cultures, providing community for Asian American students, and educating the broader Vanderbilt community.", skills: ["Cultural programming", "Event planning", "Community organizing", "Advocacy & DEI", "Budget management", "Partnership development"], icon: "🌸", members: 250, founded: 1991 },
  { id: 45, name: "Association of Latin American Students", acronym: "ALAS", category: "Cultural & Identity", mission: "Celebrating Latino and Hispanic heritage through cultural events, community support, and advocacy for Latin American students on campus.", skills: ["Cultural programming", "Event planning", "Community organizing", "Advocacy & DEI", "Budget management", "Cross-cultural communication"], icon: "🌺", members: 180, founded: 1988 },
  { id: 46, name: "South Asian Cultural Exchange", acronym: "SACE", category: "Cultural & Identity", mission: "Sharing South Asian culture through Diwali and other major cultural festivals, community programming, and cross-cultural dialogue.", skills: ["Cultural programming", "Event planning", "Performance", "Budget management", "Sponsorship & fundraising", "Community organizing"], icon: "🪔", members: 220, founded: 1995 },
  { id: 47, name: "Vanderbilt African Student Union", acronym: "ASU", category: "Cultural & Identity", mission: "Connecting students of African heritage, celebrating African cultures, and fostering Pan-African dialogue and community at Vanderbilt.", skills: ["Cultural programming", "Community organizing", "Event planning", "Advocacy & DEI", "Cross-cultural communication", "Budget oversight"], icon: "🌍", members: 150, founded: 2002 },
  { id: 48, name: "Vanderbilt Hillel", acronym: "Hillel", category: "Cultural & Identity", mission: "Enriching the lives of Jewish students at Vanderbilt through Jewish learning, Israel engagement, social justice, and community building.", skills: ["Community organizing", "Event planning", "Cultural programming", "Advocacy", "Mentorship", "Interfaith dialogue"], icon: "✡️", members: 200, founded: 1946 },
  { id: 49, name: "Vanderbilt Multicultural Leadership Council", acronym: "MLC", category: "Cultural & Identity", mission: "Coordinating Vanderbilt's multicultural student organizations to promote inclusion, celebrate diversity, and produce campus-wide cultural events.", skills: ["Coalition building", "Event planning", "Advocacy & DEI", "Stakeholder relations", "Budget management", "Cultural programming"], icon: "🌈", members: 50, founded: 2000 },
  { id: 50, name: "K.C. Potter Center – LGBTQI+ Alliance", acronym: "LGBTQI+", category: "Cultural & Identity", mission: "Building community and advocating for LGBTQI+ students through social events, education, and peer support resources.", skills: ["Advocacy & DEI", "Community organizing", "Event planning", "Peer counseling", "Policy advocacy", "Cultural programming"], icon: "🏳️‍🌈", members: 120, founded: 1983 },
  { id: 51, name: "Vanderbilt International Students Association", acronym: "VISA", category: "Cultural & Identity", mission: "Supporting international students' transition to Vanderbilt and fostering cross-cultural connections across the global student community.", skills: ["Cross-cultural communication", "Event planning", "Community organizing", "Mentorship", "Cultural programming", "Networking"], icon: "✈️", members: 200, founded: 1990 },
  { id: 52, name: "Muslim Student Association", acronym: "MSA", category: "Cultural & Identity", mission: "Nurturing a vibrant Muslim community at Vanderbilt through religious education, social events, and interfaith engagement.", skills: ["Community organizing", "Interfaith dialogue", "Event planning", "Cultural programming", "Mentorship", "Advocacy"], icon: "☪️", members: 120, founded: 1996 },

  // ── SERVICE & SOCIAL IMPACT ──
  { id: 53, name: "Vanderbilt Relay for Life", acronym: "RFL", category: "Service & Social Impact", mission: "Raising funds and awareness for cancer research through the American Cancer Society, organizing Vanderbilt's annual overnight Relay event.", skills: ["Fundraising & pitching", "Event planning", "Community organizing", "Team leadership", "Marketing", "Budget management"], icon: "🎗️", members: 300, founded: 2003 },
  { id: 54, name: "Habitat for Humanity at Vanderbilt", acronym: "HFH-VU", category: "Service & Social Impact", mission: "Building affordable homes in Nashville alongside partner families, and advocating for equitable housing policy.", skills: ["Community service", "Project management", "Advocacy & DEI", "Fundraising & pitching", "Team coordination", "Partnership development"], icon: "🏠", members: 120, founded: 2001 },
  { id: 55, name: "Vanderbilt Alternative Spring Break", acronym: "ASB", category: "Service & Social Impact", mission: "Organizing immersive service experiences during spring break to address social issues including poverty, education, and environmental justice.", skills: ["Community organizing", "Project management", "Cross-cultural communication", "Social impact", "Budget management", "Reflection & learning"], icon: "🌟", members: 100, founded: 1994 },
  { id: 56, name: "Vanderbilt Dance Marathon", acronym: "VDM", category: "Service & Social Impact", mission: "Raising funds for children's hospitals through Vanderbilt's annual dance marathon, one of the largest student-run philanthropic events on campus.", skills: ["Fundraising & pitching", "Event planning", "Budget management", "Community organizing", "Marketing", "Team leadership"], icon: "💃", members: 250, founded: 2008 },
  { id: 57, name: "Project Pyramid", acronym: "PP", category: "Service & Social Impact", mission: "Connecting Vanderbilt students with Nashville-area schools to provide tutoring, mentoring, and academic enrichment to K-12 students.", skills: ["Teaching & tutoring", "Mentorship", "Community outreach", "Program development", "Cross-cultural communication", "Curriculum development"], icon: "📐", members: 80, founded: 2006 },
  { id: 58, name: "Vanderbilt NAACP Chapter", acronym: "NAACP-VU", category: "Service & Social Impact", mission: "Advancing racial justice and civil rights through advocacy, voter registration, community organizing, and educational programming.", skills: ["Advocacy & DEI", "Community organizing", "Political organizing", "Public speaking", "Coalition building", "Policy analysis"], icon: "✊", members: 90, founded: 1970 },

  // ── ENTREPRENEURSHIP ──
  { id: 59, name: "Vanderbilt Entrepreneurship Association", acronym: "VEA", category: "Entrepreneurship", mission: "Fostering an entrepreneurial ecosystem at Vanderbilt by connecting students with mentors, resources, and startup competitions.", skills: ["Product development", "Fundraising & pitching", "Market research", "Networking", "Go-to-market strategy", "Prototyping"], icon: "🚀", members: 150, founded: 2010 },
  { id: 60, name: "Vanderbilt Social Entrepreneurship Collaborative", acronym: "VSEC", category: "Entrepreneurship", mission: "Supporting startups that create positive social impact through mentorship, pitch competitions, and connections to impact investors.", skills: ["Social impact", "Fundraising & pitching", "Market research", "Go-to-market strategy", "Stakeholder relations", "Program evaluation"], icon: "💚", members: 70, founded: 2015 },
  { id: 61, name: "Vanderbilt Undergraduate Business Council", acronym: "VUBC", category: "Entrepreneurship", mission: "Connecting business-minded undergraduates through speaker series, case competitions, and professional development workshops.", skills: ["Business strategy", "Networking", "Case analysis", "Career development", "Event planning", "Presentation & pitching"], icon: "🏢", members: 100, founded: 2012 },

  // ── ARTS & MEDIA ──
  { id: 62, name: "The Vanderbilt Hustler", acronym: "VH", category: "Arts & Media", mission: "Vanderbilt's independent student newspaper, covering campus news, politics, sports, and arts with rigorous journalistic standards since 1888.", skills: ["Journalism", "Editing & peer review", "Research", "Deadline management", "Photography", "Digital content"], icon: "📰", members: 80, founded: 1888 },
  { id: 63, name: "WRVU Vanderbilt Radio", acronym: "WRVU", category: "Arts & Media", mission: "Running Vanderbilt's student radio station, providing programming, music curation, and on-air talent development for student broadcasters.", skills: ["Audio production", "Content creation", "Broadcasting", "Social media management", "Creative direction", "Team coordination"], icon: "📻", members: 70, founded: 1951 },
  { id: 64, name: "Vanderbilt Marketing & PR Club", acronym: "VMP", category: "Arts & Media", mission: "Developing students' marketing, branding, and public relations skills through campaigns, competitions, and industry mentorship.", skills: ["Brand strategy", "Content creation", "Social media management", "Copywriting", "Consumer research", "Campaign analytics"], icon: "📣", members: 110, founded: 2014 },
  { id: 65, name: "Vanderbilt Camerata", acronym: "VC", category: "Arts & Media", mission: "Vanderbilt's premier a cappella group performing across campus and at competitions, developing musicianship and vocal performance skills.", skills: ["Performance", "Music production", "Teamwork", "Attention to detail", "Creative collaboration", "Event planning"], icon: "🎵", members: 20, founded: 1994 },
  { id: 66, name: "Vanderbilt Film Society", acronym: "VFS", category: "Arts & Media", mission: "Producing student short films and documentaries, hosting film screenings, and connecting aspiring filmmakers with industry professionals.", skills: ["Video production", "Storytelling", "Creative direction", "Project management", "Editing", "Collaboration"], icon: "🎬", members: 55, founded: 2008 },
  { id: 67, name: "Vanderbilt Ballet Theatre", acronym: "VBT", category: "Arts & Media", mission: "Producing professional-quality ballet performances including an annual Nutcracker, with live orchestra and full stage production.", skills: ["Performance", "Discipline", "Teamwork", "Budget management", "Event planning", "Creative direction"], icon: "🩰", members: 40, founded: 1985 },

  // ── ACADEMIC & RESEARCH ──
  { id: 68, name: "Vanderbilt Undergraduate Research Journal", acronym: "VURJ", category: "Academic & Research", mission: "Publishing outstanding undergraduate research across all disciplines, training students in academic writing and rigorous peer review.", skills: ["Academic writing", "Editing & peer review", "Research methodology", "Content curation", "Publication management", "Deadline management"], icon: "📚", members: 40, founded: 2003 },
  { id: 69, name: "Vanderbilt Debate Team", acronym: "VDT", category: "Academic & Research", mission: "Competing nationally in parliamentary and policy debate while developing rigorous argumentation, research, and public speaking skills.", skills: ["Persuasive communication", "Rapid research", "Critical analysis", "Time management", "Adaptability under pressure", "Logical structuring"], icon: "🎤", members: 45, founded: 1990 },
  { id: 70, name: "Phi Beta Kappa Society – VU Chapter", acronym: "PBK", category: "Academic & Research", mission: "Honoring exceptional liberal arts achievement and fostering lifelong intellectual engagement among Vanderbilt's highest-achieving students.", skills: ["Academic excellence", "Research", "Intellectual leadership", "Written communication", "Critical thinking", "Mentorship"], icon: "🏆", members: 100, founded: 1901 },
  { id: 71, name: "Vanderbilt Economics Students Association", acronym: "VESA", category: "Academic & Research", mission: "Engaging economics students through research presentations, alumni networking, policy discussions, and undergraduate research opportunities.", skills: ["Economic analysis", "Research", "Quantitative modeling", "Data analysis", "Academic writing", "Policy analysis"], icon: "📊", members: 90, founded: 2005 },
  { id: 72, name: "Vanderbilt Political Science Students Association", acronym: "VPSSA", category: "Academic & Research", mission: "Connecting political science students with faculty research, internship opportunities, and career paths in government, law, and policy.", skills: ["Policy analysis", "Research", "Academic writing", "Stakeholder relations", "Public speaking", "Networking"], icon: "🌐", members: 70, founded: 2009 },

  // ── ENVIRONMENT & SUSTAINABILITY ──
  { id: 73, name: "Vanderbilt Student Environmental Association", acronym: "VSEA", category: "Environment", mission: "Promoting environmental sustainability on campus and in Nashville through advocacy, education, and hands-on conservation projects.", skills: ["Environmental advocacy", "Community organizing", "Grant writing", "Event planning", "Research", "Sustainability"], icon: "🌿", members: 100, founded: 2000 },
  { id: 74, name: "Vanderbilt Green Fund", acronym: "VGF", category: "Environment", mission: "Funding student-led sustainability projects on campus, managing an endowment to drive green infrastructure and environmental programs at Vanderbilt.", skills: ["Grant writing", "Budget management", "Project management", "Sustainability", "Stakeholder relations", "Program evaluation"], icon: "♻️", members: 30, founded: 2012 },
  { id: 75, name: "WilSkills Outdoor Recreation", acronym: "WilSkills", category: "Environment", mission: "Making outdoor adventures accessible to all Vanderbilt students through weekly trips including kayaking, hiking, rock climbing, and caving.", skills: ["Outdoor leadership", "Risk management", "Logistics", "Inclusivity", "Team coordination", "Budget management"], icon: "🧗", members: 120, founded: 2005 },

  // ── RELIGIOUS & SPIRITUAL ──
  { id: 76, name: "Vanderbilt Catholic Community", acronym: "VCC", category: "Religious & Spiritual", mission: "Providing a spiritual home for Catholic students through Mass, retreats, service opportunities, and fellowship events.", skills: ["Community organizing", "Event planning", "Mentorship", "Interfaith dialogue", "Volunteer coordination", "Pastoral care"], icon: "✝️", members: 150, founded: 1950 },
  { id: 77, name: "Cru at Vanderbilt", acronym: "Cru", category: "Religious & Spiritual", mission: "Building a diverse Christian community through Bible studies, worship, and mission trips designed to develop faith and leadership.", skills: ["Community organizing", "Event planning", "Mentorship", "Cross-cultural communication", "Leadership development", "Small group facilitation"], icon: "✝️", members: 200, founded: 1960 },
  { id: 78, name: "Vanderbilt InterVarsity Christian Fellowship", acronym: "IVCF", category: "Religious & Spiritual", mission: "Engaging students from all backgrounds in Christian faith through small groups, evangelism training, and multiethnic community building.", skills: ["Community organizing", "Evangelism", "Mentorship", "Advocacy & DEI", "Event planning", "Interfaith dialogue"], icon: "✝️", members: 130, founded: 1948 },

  // ── HEALTH & WELLNESS ──
  { id: 79, name: "Vanderbilt Active Minds", acronym: "VAM", category: "Health & Wellness", mission: "Changing the conversation about mental health through stigma reduction, peer support, and advocacy for mental health resources on campus.", skills: ["Mental health advocacy", "Peer support", "Community organizing", "Event planning", "Advocacy & DEI", "Communication"], icon: "💚", members: 90, founded: 2009 },
  { id: 80, name: "Vanderbilt Running Club", acronym: "VRC", category: "Health & Wellness", mission: "Building community through weekly group runs, training for road races, and participating in Nashville-area 5K and half-marathon events.", skills: ["Community building", "Event coordination", "Goal setting", "Coaching", "Inclusivity", "Health promotion"], icon: "🏃", members: 150, founded: 2006 },
  { id: 81, name: "Vanderbilt Club Swimming", acronym: "VCS", category: "Health & Wellness", mission: "Providing a competitive and recreational swimming community for students outside the NCAA program, competing in club meets regionally.", skills: ["Athletic discipline", "Teamwork", "Fundraising & pitching", "Event planning", "Budget management", "Time management"], icon: "🏊", members: 60, founded: 2010 },

  // ── INTERNATIONAL & LANGUAGES ──
  { id: 82, name: "Vanderbilt Model United Nations", acronym: "VUMUN", category: "International", mission: "Training diplomats through competitive Model UN conferences, developing skills in negotiation, research, and international relations.", skills: ["Diplomatic negotiation", "Research", "Public speaking", "Policy analysis", "Argumentation", "Cross-cultural communication"], icon: "🌏", members: 80, founded: 1998 },
  { id: 83, name: "Vanderbilt International Relations Council", acronym: "VIRC", category: "International", mission: "Fostering dialogue on global affairs through speaker events, conferences, and partnerships with diplomatic institutions.", skills: ["Policy analysis", "Event planning", "Research", "Cross-cultural communication", "Partnership development", "Networking"], icon: "🌐", members: 70, founded: 2006 },
  { id: 84, name: "Vanderbilt Association of South Asians", acronym: "VASA", category: "International", mission: "Celebrating South Asian culture and supporting South Asian students through cultural events, mentorship, and professional networking.", skills: ["Cultural programming", "Community organizing", "Event planning", "Networking", "Mentorship", "Partnership development"], icon: "🌺", members: 130, founded: 2003 },
];

const EMPLOYERS = [
  { id: 1, name: "Goldman Sachs", industry: "Investment Banking", tags: ["Financial analysis", "Risk assessment", "Quantitative modeling", "Presentation & pitching", "Research & due diligence", "Excel & data tools"], logo: "GS", color: "#003366", size: "100,000+", roles: ["Analyst", "Associate", "Summer Intern"] },
  { id: 2, name: "McKinsey & Company", industry: "Management Consulting", tags: ["Strategic thinking", "Client management", "Data analysis", "Slide deck creation", "Persuasive communication", "Project scoping"], logo: "McK", color: "#2C5F8A", size: "45,000+", roles: ["Business Analyst", "Associate", "Summer Fellow"] },
  { id: 3, name: "Google", industry: "Technology", tags: ["Machine learning", "Python & SQL", "Data visualization", "Product development", "Project management", "A/B testing", "JavaScript & React"], logo: "G", color: "#4285F4", size: "190,000+", roles: ["SWE", "PM", "Data Analyst", "APM"] },
  { id: 4, name: "Andreessen Horowitz", industry: "Venture Capital", tags: ["Fundraising & pitching", "Market research", "Go-to-market strategy", "Networking", "Financial analysis", "Prototyping"], logo: "a16z", color: "#1a1a2e", size: "500+", roles: ["Deal Team", "Growth", "Portfolio Support"] },
  { id: 5, name: "Johnson & Johnson", industry: "Healthcare", tags: ["Ethical reasoning", "Research", "Cross-disciplinary collaboration", "Sustainability", "Regulatory knowledge", "Public health research"], logo: "J&J", color: "#cc0000", size: "150,000+", roles: ["Associate", "Leadership Development"] },
  { id: 6, name: "Boston Consulting Group", industry: "Management Consulting", tags: ["Strategic thinking", "Data analysis", "Client management", "Team leadership", "Research & due diligence", "Logical structuring"], logo: "BCG", color: "#00843D", size: "32,000+", roles: ["Analyst", "Consultant", "Summer Associate"] },
  { id: 7, name: "Meta", industry: "Technology", tags: ["Product development", "Data visualization", "Machine learning", "Go-to-market strategy", "Community organizing", "A/B testing", "JavaScript & React"], logo: "Meta", color: "#0668E1", size: "70,000+", roles: ["SWE", "PM", "Data Science", "UX Research"] },
  { id: 8, name: "Deloitte", industry: "Professional Services", tags: ["Budget management", "Strategic thinking", "Client management", "Data analysis", "Ethical reasoning", "Attention to detail"], logo: "D", color: "#86BC25", size: "450,000+", roles: ["Analyst", "Consultant", "Technology Analyst"] },
  { id: 9, name: "Teach For America", industry: "Education & Nonprofits", tags: ["Community organizing", "Advocacy & DEI", "Cultural programming", "Partnership development", "Community outreach", "Program evaluation"], logo: "TFA", color: "#E8002D", size: "10,000+", roles: ["Corps Member", "Program Staff"] },
  { id: 10, name: "Amazon", industry: "Technology & E-Commerce", tags: ["Project management", "Data analysis", "Go-to-market strategy", "Quantitative modeling", "Product development", "Agile methodology"], logo: "AMZ", color: "#FF9900", size: "1.5M+", roles: ["SDE", "PM", "Business Analyst"] },
  { id: 11, name: "CDC / NIH", industry: "Public Health", tags: ["Research methodology", "Ethical reasoning", "Statistical modeling", "Written communication", "Public health research", "Grant writing", "Data collection"], logo: "NIH", color: "#005EA2", size: "20,000+", roles: ["Research Fellow", "Public Health Analyst"] },
  { id: 12, name: "The New York Times", industry: "Media & Journalism", tags: ["Academic writing", "Research", "Editing & peer review", "Critical analysis", "Content curation", "Copywriting"], logo: "NYT", color: "#121212", size: "5,000+", roles: ["Editorial Intern", "Digital Strategist"] },
  { id: 13, name: "SpaceX", industry: "Aerospace & Engineering", tags: ["Engineering design", "Problem-solving", "Sustainability", "Project management", "Adaptability under pressure", "Debugging"], logo: "SpX", color: "#2a2a2a", size: "13,000+", roles: ["Avionics Engineer", "Software Engineer"] },
  { id: 14, name: "Salesforce", industry: "Enterprise Software", tags: ["Client management", "Stakeholder relations", "Networking", "Go-to-market strategy", "Product development"], logo: "SF", color: "#00A1E0", size: "80,000+", roles: ["Account Exec", "Solutions Engineer", "PM"] },
  { id: 15, name: "ACLU", industry: "Legal & Advocacy", tags: ["Advocacy & DEI", "Policy analysis", "Persuasive communication", "Research", "Community organizing", "Legal research"], logo: "ACLU", color: "#C60C30", size: "2,000+", roles: ["Staff Attorney", "Policy Advocate"] },
  { id: 16, name: "Morgan Stanley", industry: "Financial Services", tags: ["Financial analysis", "Research & due diligence", "Risk assessment", "Quantitative modeling", "Client management", "Excel & data tools"], logo: "MS", color: "#002B5C", size: "80,000+", roles: ["Analyst", "Research Associate"] },
  { id: 17, name: "Palantir", industry: "Data & Defense Tech", tags: ["Data visualization", "Statistical modeling", "Python & SQL", "Strategic thinking", "Machine learning", "Field research"], logo: "PLT", color: "#1a1a1a", size: "4,000+", roles: ["Forward Deployed Engineer", "Data Engineer"] },
  { id: 18, name: "KPMG", industry: "Audit & Advisory", tags: ["Budget management", "Policy analysis", "Stakeholder relations", "Data analysis", "Ethical reasoning", "Attention to detail"], logo: "KPMG", color: "#00338D", size: "250,000+", roles: ["Audit Associate", "Advisory Analyst"] },
  { id: 19, name: "Bain & Company", industry: "Management Consulting", tags: ["Strategic thinking", "Client management", "Data analysis", "Team leadership", "Presentation & pitching", "Market research"], logo: "Bain", color: "#CC0000", size: "12,000+", roles: ["Associate Consultant", "Summer Associate"] },
  { id: 20, name: "Citi", industry: "Banking & Financial Services", tags: ["Financial analysis", "Risk assessment", "Excel & data tools", "Client management", "Research & due diligence", "Deal structuring"], logo: "Citi", color: "#003B70", size: "240,000+", roles: ["Analyst", "Summer Analyst"] },
  { id: 21, name: "Microsoft", industry: "Technology", tags: ["Full-stack development", "JavaScript & React", "Product development", "Project management", "Agile methodology", "Version control (Git)"], logo: "MSFT", color: "#00A4EF", size: "220,000+", roles: ["SWE", "PM", "EXPLORE Intern"] },
  { id: 22, name: "WilmerHale", industry: "Law", tags: ["Legal research", "Argumentation", "Writing & brief drafting", "Case analysis", "Oral advocacy", "Attention to detail"], logo: "WH", color: "#1B3A6B", size: "1,000+", roles: ["Summer Associate", "Paralegal"] },
  { id: 23, name: "Apple", industry: "Consumer Technology", tags: ["Product development", "Brand strategy", "Consumer research", "Machine learning", "JavaScript & React", "Content creation"], logo: "AAPL", color: "#1d1d1f", size: "164,000+", roles: ["SWE", "PM", "Marketing Assoc"] },
  { id: 24, name: "LVMH / Luxury Brands", industry: "Luxury & Retail", tags: ["Brand strategy", "Content creation", "Consumer research", "Copywriting", "Campaign analytics", "Cultural programming"], logo: "LVMH", color: "#2d1b4e", size: "196,000+", roles: ["Brand Associate", "Digital Marketing"] },
];

const ALUMNI_TESTIMONIALS = {
  1: [
    { name: "Maya R. '21", org: "VIC", role: "Analyst, Goldman Sachs", quote: "Running the VIC portfolio taught me to defend every thesis under pressure. GS interviews felt familiar because I'd already survived ten stock pitch Q&As." },
    { name: "James K. '22", org: "SGA", role: "IBD Summer Analyst", quote: "Managing SGA's $4M budget gave me real experience with financial oversight. I walked into my Goldman interview talking about actual numbers." },
  ],
  2: [
    { name: "Sarah L. '20", org: "VCG", role: "Business Analyst, McKinsey", quote: "VCG was the best training ground imaginable. We ran real engagements with real clients. McKinsey saw that immediately." },
    { name: "Priya M. '22", org: "VDT", role: "Junior Associate, McKinsey", quote: "Debate trained me to structure arguments on the fly. Case interviews are just debates with spreadsheets—I was more prepared than I knew." },
  ],
  3: [
    { name: "Alex T. '21", org: "VDSC", role: "Data Analyst, Google", quote: "Our Kaggle projects and Python workshops were the exact skills Google tested in their technical rounds. The club made me hireable." },
    { name: "Jordan W. '23", org: "VCBC", role: "SWE Intern, Google", quote: "Every project I built in the coding club went on my GitHub. Recruiters actually looked at it. That portfolio got me the interview." },
  ],
  6: [
    { name: "Tom H. '20", org: "VCG", role: "Analyst, BCG", quote: "I basically ran mini-consulting projects for two years at VCG. When BCG asked about client work, I had real stories to tell." },
    { name: "Aisha P. '22", org: "SGA", role: "Associate, BCG", quote: "Navigating university administration taught me stakeholder management. BCG partners actually commented on how mature my communication style was." },
  ],
  9: [
    { name: "Marcus J. '21", org: "BSA", role: "Corps Member, Teach For America", quote: "Everything I did organizing BSA events and building community partnerships directly prepared me for classroom leadership in TFA." },
  ],
  11: [
    { name: "Divya N. '21", org: "VMES", role: "Research Fellow, NIH", quote: "Medical ethics gave me the vocabulary and nuance for bioethics review processes. My application stood out immediately." },
    { name: "Ben C. '22", org: "VURJ", role: "Public Health Analyst, CDC", quote: "Editing undergraduate research for VURJ made me a sharper scientific writer. CDC noticed the quality of my writing samples." },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, messages) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, system: systemPrompt, messages }),
  });
  const data = await res.json();
  return data.content[0].text;
}

function matchEmployers(org, resumeData) {
  return EMPLOYERS.map(emp => {
    const orgMatched = org.skills.filter(s => emp.tags.includes(s));
    // bonus points from resume skills
    const resumeBonus = resumeData
      ? (resumeData.skills || []).filter(rs => emp.tags.some(t => t.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(t.toLowerCase()))).length
      : 0;
    const score = orgMatched.length + Math.min(resumeBonus, 3); // cap bonus at 3
    return { ...emp, matchedSkills: orgMatched, resumeBoostSkills: resumeData ? resumeData.skills?.filter(rs => emp.tags.some(t => t.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(t.toLowerCase()))) : [], score, resumeBonus: Math.min(resumeBonus, 3) };
  }).filter(e => e.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

const categories = ["All", "Finance & Business", "Consulting", "Technology", "Engineering", "Healthcare", "Legal & Policy", "Leadership", "Cultural & Identity", "Service & Social Impact", "Entrepreneurship", "Arts & Media", "Academic & Research", "Environment", "Religious & Spiritual", "Health & Wellness", "International"];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: "", email: "", major: "", gradYear: "" });
  const [activeTab, setActiveTab] = useState("resume");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [resumeBullets, setResumeBullets] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [savedMatches, setSavedMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [resumeData, setResumeData] = useState(null); // parsed resume
  const [resumeFile, setResumeFile] = useState(null); // {name, type}
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const detailRef = useRef(null);

  const filteredOrgs = VANDERBILT_ORGS.filter(org => {
    const s = searchTerm.toLowerCase();
    return (org.name.toLowerCase().includes(s) || org.mission.toLowerCase().includes(s) || org.category.toLowerCase().includes(s)) &&
      (activeCategory === "All" || org.category === activeCategory);
  });

  function handleLogin() {
    if (!loginForm.name || !loginForm.email) return;
    setUser(loginForm);
    setActiveTab("resume");
  }

  function handleSelectOrg(org) {
    setSelectedOrg(org);
    setMatches(matchEmployers(org, resumeData));
    setSelectedEmployer(null);
    setTranslation(null);
    setResumeBullets(null);
    setShowTestimonials(false);
    setActiveTab("matches");
  }

  async function handleSelectEmployer(emp) {
    setSelectedEmployer(emp);
    setTranslation(null);
    setResumeBullets(null);
    setShowTestimonials(false);
    setLoadingTranslation(true);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    const resumeContext = resumeData
      ? `\nStudent resume context: GPA ${resumeData.gpa || "N/A"}, prior experience: ${resumeData.experience?.join(", ") || "none listed"}, technical skills: ${resumeData.skills?.join(", ") || "none listed"}, coursework: ${resumeData.coursework?.join(", ") || "none listed"}.`
      : "";
    const raw = await callClaude(
      `You are a career counselor for Vanderbilt students. Be specific, inspiring, direct. Speak to "you/your". Return ONLY valid JSON.`,
      [{ role: "user", content: `Student org: ${selectedOrg.name} (${selectedOrg.acronym})\nMission: "${selectedOrg.mission}"\nOrg skills: ${selectedOrg.skills.join(", ")}\nTarget: ${emp.name} (${emp.industry})\nOverlapping skills: ${emp.matchedSkills.join(", ")}${resumeContext}\n\nReturn JSON: {"headline":"8-word max punchy headline","bullets":["2-sentence bullet 1","2-sentence bullet 2","2-sentence bullet 3"],"talkingPoint":"One interview talking point they can use verbatim","resumeTip":"${resumeData ? 'One specific tip referencing something from their actual resume' : ''}" }` }]
    );
    try { setTranslation(JSON.parse(raw.replace(/```json|```/g, "").trim())); }
    catch { setTranslation({ headline: "Your experience prepares you directly", bullets: [raw], talkingPoint: "" }); }
    setLoadingTranslation(false);
  }

  async function handleGenerateResume() {
    if (!selectedOrg || !selectedEmployer) return;
    setLoadingResume(true);
    setResumeBullets(null);
    const resumeContext = resumeData
      ? `\nActual resume details — experience: ${resumeData.experience?.join("; ") || "N/A"}, skills: ${resumeData.skills?.join(", ") || "N/A"}, GPA: ${resumeData.gpa || "N/A"}, coursework: ${resumeData.coursework?.join(", ") || "N/A"}. Incorporate specific details from their resume into the bullets.`
      : "";
    const raw = await callClaude(
      `You are an expert resume writer for top employers. Write ATS-optimized bullets. Return ONLY valid JSON.`,
      [{ role: "user", content: `Student leader in ${selectedOrg.name} at Vanderbilt.\nOrg mission: "${selectedOrg.mission}"\nOrg skills: ${selectedOrg.skills.join(", ")}\nTarget: ${selectedEmployer.name} (${selectedEmployer.industry})\nMatched skills: ${selectedEmployer.matchedSkills.join(", ")}${resumeContext}\n\nWrite 4 resume bullets tailored for ${selectedEmployer.name}. Each bullet must start with a strong action verb, include a metric or quantified result, be 1–2 lines, ATS-friendly. Return JSON: {"bullets":["b1","b2","b3","b4"],"section_header":"suggested header","tip":"one short pro tip"}` }]
    );
    try { setResumeBullets(JSON.parse(raw.replace(/```json|```/g, "").trim())); }
    catch { setResumeBullets({ bullets: [raw], section_header: "Leadership", tip: "" }); }
    setLoadingResume(false);
  }

  // ── Resume Upload & Parse ──────────────────────────────────────────────────
  async function processResumeFile(file) {
    if (!file) return;

    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith(".docx");
    const isTXT = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");

    if (!isPDF && !isDOCX && !isTXT) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setResumeFile({ name: file.name, type: file.type, size: (file.size / 1024).toFixed(0) + " KB" });
    setAnalyzingResume(true);
    setResumeData(null);

    const PARSE_PROMPT = `You are a resume parsing expert. Extract structured data accurately from the resume provided. Return ONLY a valid JSON object with no markdown fences, no preamble. Use this exact schema:
{"name":"","gpa":null,"major":"","gradYear":"","experience":["role at company (year)"],"skills":["skill"],"coursework":["course"],"orgs":["org (role)"],"summary":"2-sentence professional summary","strengths":["strength1","strength2","strength3"],"careerInterests":["interest1","interest2"]}`;

    try {
      let messages;

      if (isPDF) {
        // Try sending PDF natively to Claude
        try {
          const b64 = await fileToBase64(file);
          messages = [{
            role: "user",
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
              { type: "text", text: "Extract structured information from this resume and return ONLY the JSON." }
            ]
          }];
        } catch (pdfErr) {
          throw new Error("Could not read PDF. Try saving as TXT and uploading again.");
        }
      } else if (isDOCX) {
        // Use mammoth to extract text from DOCX
        try {
          const arrayBuffer = await fileToArrayBuffer(file);
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = (result.value || "").trim();
          if (!text) throw new Error("Empty DOCX");
          messages = [{
            role: "user",
            content: `${text.slice(0, 5000)}\n\n---\nExtract structured info from the resume text above and return ONLY the JSON.`
          }];
        } catch (docxErr) {
          console.warn("mammoth failed, falling back:", docxErr);
          // Fallback: try reading raw text (won't be perfect but better than nothing)
          const raw = await fileToText(file);
          messages = [{
            role: "user",
            content: `${raw.slice(0, 3000)}\n\n---\nExtract any readable resume info from above and return ONLY the JSON.`
          }];
        }
      } else {
        // Plain text
        const text = await fileToText(file);
        messages = [{
          role: "user",
          content: `${text.slice(0, 5000)}\n\n---\nExtract structured info from the resume text above and return ONLY the JSON.`
        }];
      }

      const raw = await callClaude(PARSE_PROMPT, messages);
      // Strip any accidental markdown fences
      const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      // Find first { to last } to extract JSON robustly
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON found in response");
      const parsed = JSON.parse(clean.slice(start, end + 1));
      setResumeData(parsed);
      if (selectedOrg) setMatches(matchEmployers(selectedOrg, parsed));
    } catch (err) {
      console.error("Resume parse error:", err);
      setResumeData({ error: err.message || "Could not parse resume. Please try a PDF or TXT file." });
    }
    setAnalyzingResume(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processResumeFile(file);
  }

  function toggleSave(org, emp) {
    const key = `${org.id}-${emp.id}`;
    setSavedMatches(prev => prev.find(m => `${m.orgId}-${m.employerId}` === key)
      ? prev.filter(m => `${m.orgId}-${m.employerId}` !== key)
      : [...prev, { orgId: org.id, employerId: emp.id, orgName: org.name, orgAcronym: org.acronym, employerName: emp.name, industry: emp.industry, logo: emp.logo, color: emp.color, matchedSkills: emp.matchedSkills, score: emp.score }]);
  }
  function isSaved(oId, eId) { return savedMatches.some(m => m.orgId === oId && m.employerId === eId); }
  const testimonials = selectedEmployer ? (ALUMNI_TESTIMONIALS[selectedEmployer.id] || []) : [];

  // ── Login Screen ───────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: "2rem" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} input:focus,select:focus{outline:none;border-color:${GOLD}!important;box-shadow:0 0 0 3px rgba(207,181,59,0.1)}`}</style>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp .5s ease both" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, background: `linear-gradient(135deg,${GOLD},#8a7520)`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#0a0a0a", margin: "0 auto 18px" }}>V</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, color: "#f0ede6", letterSpacing: "-0.03em", margin: "0 0 6px" }}>Vanderbilt Career Bridge</h1>
          <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Your student org experience is your competitive edge.</p>
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "28px 24px" }}>
          <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20 }}>Create Your Profile</div>
          {[{ k: "name", p: "Full Name", t: "text" }, { k: "email", p: "Vanderbilt Email", t: "email" }, { k: "major", p: "Major / Area of Study", t: "text" }].map(f => (
            <input key={f.k} type={f.t} placeholder={f.p} value={loginForm[f.k]} onChange={e => setLoginForm(p => ({ ...p, [f.k]: e.target.value }))} style={{ width: "100%", marginBottom: 10, padding: "11px 13px", background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: 8, color: "#f0ede6", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .2s" }} />
          ))}
          <select value={loginForm.gradYear} onChange={e => setLoginForm(p => ({ ...p, gradYear: e.target.value }))} style={{ width: "100%", marginBottom: 18, padding: "11px 13px", background: "#111", border: `1px solid ${BORDER}`, borderRadius: 8, color: loginForm.gradYear ? "#f0ede6" : "#555", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}>
            <option value="">Graduation Year</option>
            {["2025", "2026", "2027", "2028"].map(y => <option key={y}>{y}</option>)}
          </select>
          <button onClick={handleLogin} style={{ width: "100%", padding: "13px", background: loginForm.name && loginForm.email ? GOLD : "#1e1e1e", border: "none", borderRadius: 9, color: loginForm.name && loginForm.email ? "#0a0a0a" : "#444", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>Get Started →</button>
        </div>
        <p style={{ textAlign: "center", color: "#333", fontSize: 10, marginTop: 14 }}>No account required · Session only</p>
      </div>
    </div>
  );

  // ── Main App ───────────────────────────────────────────────────────────────
  const TABS = [
    { id: "resume", label: "📄 Resume", badge: resumeData && !resumeData.error ? "✓" : null },
    { id: "orgs", label: "Organizations" },
    { id: "matches", label: selectedOrg ? `Matches · ${selectedOrg.acronym}` : "Matches" },
    { id: "saved", label: `Saved${savedMatches.length ? ` (${savedMatches.length})` : ""}` },
    { id: "profile", label: user.name.split(" ")[0] },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Georgia, serif", color: "#f0ede6" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        .card-hover:hover{transform:translateY(-2px)!important;box-shadow:0 10px 36px rgba(0,0,0,.4)!important}
        .emp-hover:hover{transform:translateX(3px)!important}
        .copy-btn:hover{background:rgba(207,181,59,.18)!important}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
        input:focus,textarea:focus{outline:none;border-color:${GOLD}!important}
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 80% 50% at 15% 10%,rgba(207,181,59,.06) 0%,transparent 55%)` }} />

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,8,.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${GOLD},#8a7520)`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#0a0a0a", fontSize: 15 }}>V</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: GOLD, textTransform: "uppercase", lineHeight: 1 }}>Vanderbilt</div>
              <div style={{ fontSize: 8, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>Career Bridge</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 3 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "5px 12px", background: activeTab === t.id ? GOLD_DIM : "transparent", border: `1px solid ${activeTab === t.id ? GOLD_BORDER : "transparent"}`, borderRadius: 6, color: activeTab === t.id ? GOLD : "#666", cursor: "pointer", fontSize: 11, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, transition: "all .15s" }}>
                {t.label}
                {t.badge && <span style={{ fontSize: 9, color: GREEN, fontWeight: 700 }}>{t.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem", position: "relative", zIndex: 1 }}>

        {/* ══ RESUME TAB ══ */}
        {activeTab === "resume" && (
          <div style={{ animation: "fadeUp .4s ease both", maxWidth: 860, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ display: "inline-block", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, padding: "3px 11px", borderRadius: 20, marginBottom: 16 }}>Step 1 · Upload Your Resume</span>
              <h1 style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-.03em", margin: "0 0 .6rem", color: "#f0ede6" }}>Let your resume<br /><em style={{ color: GOLD }}>power smarter matches.</em></h1>
              <p style={{ fontSize: 14, color: "#777", maxWidth: 480, lineHeight: 1.7, margin: 0 }}>Upload your resume and our AI will extract your skills, experience, and background to boost your employer matches and personalize every career translation.</p>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{ border: `2px dashed ${dragOver ? GOLD : resumeData && !resumeData.error ? "rgba(74,222,128,.4)" : resumeData?.error ? "rgba(255,80,80,.4)" : BORDER}`, borderRadius: 18, padding: "3rem 2rem", textAlign: "center", marginBottom: 24, background: dragOver ? GOLD_DIM : resumeData && !resumeData.error ? GREEN_DIM : resumeData?.error ? "rgba(255,80,80,.06)" : SURFACE, transition: "all .2s", cursor: "pointer" }}
              onClick={() => document.getElementById("resume-file-input").click()}
            >
              <input id="resume-file-input" type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) processResumeFile(e.target.files[0]); e.target.value = ""; }} />
              {analyzingResume ? (
                <div>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${GOLD_DIM}`, borderTop: `2px solid ${GOLD}`, margin: "0 auto 14px", animation: "spin .9s linear infinite" }} />
                  <p style={{ color: "#888", fontSize: 14, margin: "0 0 4px" }}>Analyzing your resume with AI…</p>
                  <p style={{ color: "#444", fontSize: 11, margin: 0 }}>Extracting skills, experience, and more</p>
                </div>
              ) : resumeData?.error ? (
                <div>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
                  <p style={{ color: "#ff6060", fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>Could not parse resume</p>
                  <p style={{ color: "#777", fontSize: 12, margin: "0 0 12px", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>{resumeData.error}</p>
                  <span style={{ fontSize: 11, color: "#888", background: SURFACE, border: `1px solid ${BORDER}`, padding: "4px 14px", borderRadius: 20 }}>Click to try a different file</span>
                </div>
              ) : resumeData && !resumeData.error ? (
                <div>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <p style={{ color: GREEN, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>{resumeFile?.name}</p>
                  <p style={{ color: "#555", fontSize: 12, margin: "0 0 12px" }}>{resumeFile?.size} · Click or drop to replace</p>
                  <span style={{ fontSize: 11, color: GREEN, background: GREEN_DIM, border: "1px solid rgba(74,222,128,.2)", padding: "3px 12px", borderRadius: 20 }}>Resume parsed · Matching enhanced</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 40, marginBottom: 14, animation: dragOver ? "pulse .8s ease infinite" : "none" }}>📄</div>
                  <p style={{ color: "#ccc", fontSize: 15, margin: "0 0 6px", fontWeight: 500 }}>Drop your resume here</p>
                  <p style={{ color: "#555", fontSize: 12, margin: "0 0 16px" }}>or click to browse · PDF, DOCX, or TXT</p>
                  <span style={{ fontSize: 11, color: "#666", background: SURFACE, border: `1px solid ${BORDER}`, padding: "4px 14px", borderRadius: 20 }}>Optional but recommended</span>
                </div>
              )}
            </div>

            {/* Resume Insights */}
            {resumeData && !resumeData.error && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, animation: "fadeUp .4s ease both" }}>
                {/* Summary card */}
                <div style={{ gridColumn: "1/-1", background: SURFACE, border: `1px solid ${GOLD_BORDER}`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 6 }}>AI Resume Summary</div>
                      <h3 style={{ fontSize: 18, fontWeight: 400, margin: 0 }}>{resumeData.name || user.name}</h3>
                      <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0" }}>{resumeData.major || user.major} · {resumeData.gradYear || user.gradYear}{resumeData.gpa ? ` · GPA ${resumeData.gpa}` : ""}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {resumeData.careerInterests?.slice(0, 2).map((ci, i) => <Pill key={i} color="green">{ci}</Pill>)}
                    </div>
                  </div>
                  {resumeData.summary && <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, margin: "0 0 14px", borderLeft: `2px solid ${GOLD_BORDER}`, paddingLeft: 12, fontStyle: "italic" }}>{resumeData.summary}</p>}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {resumeData.strengths?.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, padding: "3px 10px", borderRadius: 20 }}>
                        <span>⚡</span>{s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>Extracted Skills ({resumeData.skills?.length || 0})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {resumeData.skills?.map((s, i) => <Pill key={i}>{s}</Pill>)}
                  </div>
                </div>

                {/* Experience */}
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>Work Experience</div>
                  {resumeData.experience?.length ? resumeData.experience.map((e, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ color: GOLD, fontSize: 10, marginTop: 2 }}>▸</span>
                      <span style={{ fontSize: 12, color: "#bbb", lineHeight: 1.5 }}>{e}</span>
                    </div>
                  )) : <p style={{ fontSize: 12, color: "#444", margin: 0 }}>None detected</p>}
                </div>

                {/* Coursework */}
                {resumeData.coursework?.length > 0 && (
                  <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>Relevant Coursework</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {resumeData.coursework.map((c, i) => <Pill key={i}>{c}</Pill>)}
                    </div>
                  </div>
                )}

                {/* Orgs from resume */}
                {resumeData.orgs?.length > 0 && (
                  <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>Organizations on Resume</div>
                    {resumeData.orgs.map((o, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#bbb", marginBottom: 6, display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: GOLD, fontSize: 10 }}>▸</span>{o}
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div style={{ gridColumn: "1/-1", background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Resume uploaded and ready</div>
                    <div style={{ fontSize: 12, color: "#888" }}>Your skills will now boost employer match scores and personalize all AI translations.</div>
                  </div>
                  <button onClick={() => setActiveTab("orgs")} style={{ padding: "10px 22px", background: GOLD, border: "none", borderRadius: 9, color: "#0a0a0a", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Browse Orgs →</button>
                </div>
              </div>
            )}

            {/* Skip option */}
            {!resumeData && !analyzingResume && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button onClick={() => setActiveTab("orgs")} style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Skip for now and browse organizations</button>
              </div>
            )}
          </div>
        )}

        {/* ══ ORGS TAB ══ */}
        {activeTab === "orgs" && (
          <div style={{ animation: "fadeUp .4s ease both" }}>
            <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-.03em", margin: "0 0 .5rem", color: "#f0ede6" }}>
                  Student Organizations<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Select yours to find matches.</em>
                </h1>
              </div>
              {resumeData && !resumeData.error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: GREEN_DIM, border: "1px solid rgba(74,222,128,.2)", borderRadius: 10, padding: "8px 14px" }}>
                  <span style={{ color: GREEN, fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 11, color: GREEN }}>Resume active · Matches are personalized</span>
                </div>
              )}
            </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "0 0 220px", minWidth: 180 }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: 13 }}>🔍</span>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search organizations…" style={{ width: "100%", padding: "9px 12px 9px 32px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, color: "#f0ede6", fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
                {categories.map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "6px 13px", background: activeCategory === cat ? GOLD : SURFACE, border: `1px solid ${activeCategory === cat ? GOLD : BORDER}`, borderRadius: 20, color: activeCategory === cat ? "#0a0a0a" : "#777", fontSize: 10, cursor: "pointer", fontWeight: activeCategory === cat ? 700 : 400, transition: "all .15s", fontFamily: "inherit", whiteSpace: "nowrap" }}>{cat}</button>)}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 13 }}>
              {filteredOrgs.map((org, i) => <OrgCard key={org.id} org={org} i={i} onSelect={handleSelectOrg} selected={selectedOrg?.id === org.id} />)}
            </div>
          </div>
        )}

        {/* ══ MATCHES TAB ══ */}
        {activeTab === "matches" && (
          <div style={{ animation: "fadeUp .4s ease both" }}>
            {!selectedOrg ? (
              <EmptyState icon="🎯" title="Select an organization first" sub="Go to Organizations and pick your student org." action={{ label: "Browse Organizations", onClick: () => setActiveTab("orgs") }} />
            ) : (
              <>
                {/* Org bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, borderRadius: 12, padding: "13px 18px", marginBottom: 20 }}>
                  <span style={{ fontSize: 24 }}>{selectedOrg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{selectedOrg.name}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{selectedOrg.category} · {selectedOrg.members} members · Est. {selectedOrg.founded}</div>
                  </div>
                  {resumeData && !resumeData.error && <span style={{ fontSize: 10, color: GREEN, background: GREEN_DIM, border: "1px solid rgba(74,222,128,.2)", padding: "3px 10px", borderRadius: 20 }}>+ Resume boost active</span>}
                  <button onClick={() => setActiveTab("orgs")} style={{ padding: "5px 13px", background: "transparent", border: `1px solid ${GOLD_BORDER}`, borderRadius: 6, color: GOLD, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Change</button>
                </div>

                <p style={{ color: "#555", fontSize: 12, marginBottom: 22 }}>{matches.length} employer matches · Click any to unlock AI translation + resume bullets</p>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,1fr) minmax(0,1.4fr)", gap: 24, alignItems: "start" }}>
                  {/* Employer list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {matches.map((emp, i) => <EmployerCard key={emp.id} employer={emp} i={i} selected={selectedEmployer?.id === emp.id} onSelect={handleSelectEmployer} saved={isSaved(selectedOrg.id, emp.id)} onToggleSave={() => toggleSave(selectedOrg, emp)} />)}
                  </div>

                  {/* Detail panel */}
                  <div ref={detailRef} style={{ position: "sticky", top: 70 }}>
                    {!selectedEmployer ? (
                      <div style={{ background: SURFACE, border: `1px dashed ${BORDER}`, borderRadius: 16, padding: "4rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 12, opacity: .25 }}>✦</div>
                        <p style={{ color: "#444", fontSize: 13, lineHeight: 1.7 }}>Select an employer to see how your<br />{selectedOrg.acronym} experience translates</p>
                      </div>
                    ) : (
                      <div style={{ background: SURFACE, border: `1px solid ${GOLD_BORDER}`, borderRadius: 16, overflow: "hidden" }}>
                        {/* Employer header */}
                        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: selectedEmployer.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{selectedEmployer.logo}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedEmployer.name}</div>
                            <div style={{ fontSize: 11, color: "#666" }}>{selectedEmployer.industry} · {selectedEmployer.size} employees</div>
                            <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>Roles: {selectedEmployer.roles?.join(", ")}</div>
                          </div>
                          <button onClick={() => toggleSave(selectedOrg, selectedEmployer)} title={isSaved(selectedOrg.id, selectedEmployer.id) ? "Unsave" : "Save"} style={{ width: 32, height: 32, borderRadius: "50%", background: isSaved(selectedOrg.id, selectedEmployer.id) ? GOLD_DIM : "transparent", border: `1px solid ${isSaved(selectedOrg.id, selectedEmployer.id) ? GOLD_BORDER : BORDER}`, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                            {isSaved(selectedOrg.id, selectedEmployer.id) ? "★" : "☆"}
                          </button>
                        </div>

                        {/* Match breakdown */}
                        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: "rgba(0,0,0,.2)" }}>
                          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 8 }}>Match Breakdown</div>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {selectedEmployer.matchedSkills?.map(s => <Pill key={s}>{s}</Pill>)}
                            </div>
                            {selectedEmployer.resumeBoostSkills?.length > 0 && (
                              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {selectedEmployer.resumeBoostSkills.map(s => <Pill key={s} color="green">{s} ↑</Pill>)}
                              </div>
                            )}
                          </div>
                          {selectedEmployer.resumeBonus > 0 && <div style={{ fontSize: 10, color: GREEN, marginTop: 6 }}>+{selectedEmployer.resumeBonus} bonus point{selectedEmployer.resumeBonus > 1 ? "s" : ""} from your resume</div>}
                        </div>

                        {/* AI Translation */}
                        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${BORDER}` }}>
                          <div style={{ fontSize: 9, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>AI Career Translation</div>
                          {loadingTranslation ? <Spinner label="Analyzing your experience…" /> : translation && (
                            <>
                              <blockquote style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 12, margin: "0 0 16px", fontStyle: "italic", color: GOLD, fontSize: 15, lineHeight: 1.4 }}>"{translation.headline}"</blockquote>
                              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 14 }}>
                                {translation.bullets?.map((b, i) => (
                                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: GOLD, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: "#ccc" }}>{b}</p>
                                  </div>
                                ))}
                              </div>
                              {translation.talkingPoint && (
                                <div style={{ background: "rgba(207,181,59,.05)", border: `1px solid ${GOLD_BORDER}`, borderRadius: 8, padding: "9px 13px", marginBottom: 10 }}>
                                  <div style={{ fontSize: 8, color: GOLD, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>Interview Talking Point</div>
                                  <p style={{ margin: 0, fontSize: 12, color: "#bbb", lineHeight: 1.6, fontStyle: "italic" }}>"{translation.talkingPoint}"</p>
                                </div>
                              )}
                              {translation.resumeTip && resumeData && (
                                <div style={{ background: GREEN_DIM, border: "1px solid rgba(74,222,128,.2)", borderRadius: 8, padding: "9px 13px" }}>
                                  <div style={{ fontSize: 8, color: GREEN, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>Resume Insight</div>
                                  <p style={{ margin: 0, fontSize: 12, color: "#8fa", lineHeight: 1.6 }}>{translation.resumeTip}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Resume Bullets */}
                        <div style={{ padding: "18px 20px", borderBottom: testimonials.length ? `1px solid ${BORDER}` : "none" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <div style={{ fontSize: 9, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em" }}>Resume Bullet Generator{resumeData && !resumeData.error ? " · Resume-Personalized" : ""}</div>
                            {translation && !loadingResume && (
                              <button onClick={handleGenerateResume} style={{ padding: "4px 13px", background: GOLD, border: "none", borderRadius: 6, color: "#0a0a0a", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                                {resumeBullets ? "↻ Regenerate" : "Generate"}
                              </button>
                            )}
                          </div>
                          {!translation && <p style={{ color: "#444", fontSize: 11, margin: 0 }}>Generate career translation first.</p>}
                          {loadingResume ? <Spinner label="Writing personalized bullets…" /> : resumeBullets && (
                            <div>
                              <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>Section: <span style={{ color: "#aaa", fontStyle: "italic" }}>{resumeBullets.section_header}</span></div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10 }}>
                                {resumeBullets.bullets?.map((b, i) => (
                                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", background: "rgba(255,255,255,.02)", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "9px 11px" }}>
                                    <span style={{ color: GOLD, fontSize: 9, marginTop: 2, flexShrink: 0 }}>▸</span>
                                    <p style={{ margin: 0, fontSize: 11, color: "#ccc", lineHeight: 1.6, flex: 1 }}>{b}</p>
                                    <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(b)} title="Copy" style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: 11, padding: "0 3px", borderRadius: 4, transition: "background .15s", flexShrink: 0 }}>⧉</button>
                                  </div>
                                ))}
                              </div>
                              {resumeBullets.tip && <div style={{ background: GREEN_DIM, border: "1px solid rgba(74,222,128,.15)", borderRadius: 7, padding: "7px 11px" }}><span style={{ fontSize: 8, color: GREEN, textTransform: "uppercase", letterSpacing: ".1em" }}>Pro Tip · </span><span style={{ fontSize: 11, color: "#8fa" }}>{resumeBullets.tip}</span></div>}
                            </div>
                          )}
                        </div>

                        {/* Testimonials */}
                        {testimonials.length > 0 && (
                          <div style={{ padding: "16px 20px" }}>
                            <button onClick={() => setShowTestimonials(p => !p)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: showTestimonials ? 12 : 0 }}>
                              <div style={{ fontSize: 9, color: GOLD, textTransform: "uppercase", letterSpacing: ".15em" }}>Alumni Testimonials ({testimonials.length})</div>
                              <span style={{ color: GOLD, fontSize: 10 }}>{showTestimonials ? "▲" : "▼"}</span>
                            </button>
                            {showTestimonials && testimonials.map((t, i) => (
                              <div key={i} style={{ background: "rgba(207,181,59,.03)", border: `1px solid rgba(207,181,59,.1)`, borderRadius: 9, padding: "12px 14px", marginBottom: 9, animation: "fadeUp .3s ease both" }}>
                                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#bbb", lineHeight: 1.6, fontStyle: "italic" }}>"{t.quote}"</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div><div style={{ fontSize: 11, fontWeight: 700, color: "#ddd" }}>{t.name}</div><div style={{ fontSize: 10, color: "#555" }}>{t.role}</div></div>
                                  <Pill>{t.org}</Pill>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ SAVED TAB ══ */}
        {activeTab === "interview" && <InterviewQuestionGenerator />}
        {activeTab === "saved" && (
          <div style={{ animation: "fadeUp .4s ease both" }}>
            <h2 style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-.02em", marginBottom: 6 }}>Saved Matches</h2>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 26 }}>{savedMatches.length} saved connection{savedMatches.length !== 1 ? "s" : ""}</p>
            {savedMatches.length === 0 ? <EmptyState icon="★" title="No saved matches yet" sub="Star any employer to save it here." action={{ label: "Explore Matches", onClick: () => setActiveTab("orgs") }} />
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 13 }}>
                {savedMatches.map((m, i) => (
                  <div key={i} className="card-hover" style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 13, padding: "18px 20px", transition: "all .2s", animation: `fadeUp .3s ease ${i * .05}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{m.logo}</div>
                      <div><div style={{ fontSize: 13, fontWeight: 700 }}>{m.employerName}</div><div style={{ fontSize: 11, color: "#555" }}>{m.industry}</div></div>
                    </div>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>via <span style={{ color: GOLD }}>{m.orgAcronym}</span> · {m.score} skills matched</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>{m.matchedSkills?.map(s => <Pill key={s}>{s}</Pill>)}</div>
                    <button onClick={() => { const org = VANDERBILT_ORGS.find(o => o.id === m.orgId); const emp = EMPLOYERS.find(e => e.id === m.employerId); if (org && emp) { handleSelectOrg(org); setTimeout(() => handleSelectEmployer({ ...emp, matchedSkills: m.matchedSkills, resumeBoostSkills: [], score: m.score, resumeBonus: 0 }), 200); setActiveTab("matches"); } }} style={{ width: "100%", padding: "7px", background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, borderRadius: 7, color: GOLD, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>View Translation →</button>
                  </div>
                ))}
              </div>}
          </div>
        )}

        {/* ══ PROFILE TAB ══ */}
        {activeTab === "profile" && (
          <div style={{ animation: "fadeUp .4s ease both", maxWidth: 640 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD},#6a5510)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#0a0a0a", fontWeight: 700 }}>{user.name[0]}</div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 3px", letterSpacing: "-.02em" }}>{user.name}</h1>
                <div style={{ fontSize: 12, color: "#666" }}>{user.email}</div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{user.major} · Class of {user.gradYear || "—"}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[{ label: "Resume Uploaded", value: resumeData && !resumeData.error ? "✓ Active" : "Not yet", icon: "📄", green: resumeData && !resumeData.error }, { label: "Saved Matches", value: savedMatches.length, icon: "★" }, { label: "Skills Extracted", value: resumeData?.skills?.length || 0, icon: "🧩" }, { label: "AI Analyses", value: translation ? "Run" : 0, icon: "⚡" }].map(stat => (
                <div key={stat.label} style={{ background: SURFACE, border: `1px solid ${stat.green ? "rgba(74,222,128,.2)" : BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{stat.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 400, color: stat.green ? GREEN : GOLD }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{stat.label}</div>
                </div>
              ))}
            </div>
            {!resumeData && <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginBottom: 3 }}>Upload your resume</div><div style={{ fontSize: 12, color: "#777" }}>Get personalized matches and tailored bullets.</div></div><button onClick={() => setActiveTab("resume")} style={{ padding: "8px 18px", background: GOLD, border: "none", borderRadius: 8, color: "#0a0a0a", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Upload →</button></div>} 
            <button onClick={() => setActiveTab("interview")} style={{ padding: "10px 22px", background: "none", border: "none", color: "#444", cursor: "pointer" }}>Interview Prep</button>
          </div>
        )}
      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "1.5rem", marginTop: "4rem", textAlign: "center", color: "#2a2a2a", fontSize: 10, letterSpacing: ".05em" }}>
        Vanderbilt Career Bridge · For Student Org Leaders · Powered by Claude AI
      </footer>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function OrgCard({ org, i, onSelect, selected }) {
  return (
    <div className="card-hover" onClick={() => onSelect(org)} style={{ background: selected ? GOLD_DIM : SURFACE, border: `1px solid ${selected ? GOLD_BORDER : BORDER}`, borderRadius: 13, padding: "17px 19px", cursor: "pointer", transition: "all .2s", animation: `fadeUp .4s ease ${i * .04}s both` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 20 }}>{org.icon}</span>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: "#f0ede6", lineHeight: 1.2 }}>{org.name}</div><div style={{ fontSize: 9, color: GOLD, letterSpacing: ".1em", textTransform: "uppercase" }}>{org.acronym}</div></div>
        </div>
        <span style={{ fontSize: 9, color: "#444", background: "rgba(255,255,255,.02)", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "2px 8px" }}>{org.members} members</span>
      </div>
      <p style={{ fontSize: 11, color: "#555", lineHeight: 1.6, margin: "0 0 10px" }}>{org.mission.slice(0, 95)}…</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {org.skills.slice(0, 3).map(s => <Pill key={s}>{s}</Pill>)}
        {org.skills.length > 3 && <span style={{ fontSize: 9, color: "#333", padding: "2px 4px" }}>+{org.skills.length - 3}</span>}
      </div>
      {selected && <div style={{ marginTop: 9, fontSize: 10, color: GOLD }}>✓ Selected · See matches →</div>}
    </div>
  );
}

function EmployerCard({ employer, i, selected, onSelect, saved, onToggleSave }) {
  const scoreColor = employer.score >= 5 ? GREEN : employer.score >= 3 ? GOLD : "#666";
  return (
    <div className="emp-hover" onClick={() => onSelect(employer)} style={{ background: selected ? GOLD_DIM : SURFACE, border: `1px solid ${selected ? GOLD_BORDER : BORDER}`, borderRadius: 11, padding: "12px 14px", cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center", gap: 11, animation: `fadeUp .35s ease ${i * .04}s both` }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: employer.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{employer.logo}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#f0ede6" }}>{employer.name}</div>
        <div style={{ fontSize: 10, color: "#444" }}>{employer.industry}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[1, 2, 3, 4, 5].map(b => <div key={b} style={{ width: 3, height: 11, borderRadius: 2, background: b <= employer.score ? scoreColor : "rgba(255,255,255,.07)" }} />)}
        </div>
        <div style={{ fontSize: 7, color: scoreColor }}>{employer.score} pts{employer.resumeBonus > 0 ? ` (+${employer.resumeBonus}📄)` : ""}</div>
      </div>
      <button onClick={e => { e.stopPropagation(); onToggleSave(); }} style={{ width: 26, height: 26, borderRadius: "50%", background: saved ? GOLD_DIM : "transparent", border: `1px solid ${saved ? GOLD_BORDER : BORDER}`, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>
        {saved ? "★" : "☆"}
      </button>
    </div>
  );
}

function Pill({ children, color }) {
  const isGreen = color === "green";
  return <span style={{ padding: "2px 7px", background: isGreen ? GREEN_DIM : GOLD_DIM, border: `1px solid ${isGreen ? "rgba(74,222,128,.2)" : "rgba(207,181,59,.18)"}`, borderRadius: 20, fontSize: 9, color: isGreen ? "#6fda9a" : "#9a8530" }}>{children}</span>;
}

function Spinner({ label }) {
  return <div style={{ textAlign: "center", padding: "1.5rem" }}><div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${GOLD_DIM}`, borderTop: `2px solid ${GOLD}`, margin: "0 auto 10px", animation: "spin .9s linear infinite" }} /><p style={{ color: "#444", fontSize: 11, margin: 0 }}>{label}</p></div>;
}

function EmptyState({ icon, title, sub, action }) {
  return <div style={{ textAlign: "center", padding: "5rem 2rem" }}><div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div><h2 style={{ fontSize: 18, fontWeight: 400, color: "#666", margin: "0 0 6px" }}>{title}</h2><p style={{ color: "#333", marginBottom: 20, fontSize: 13 }}>{sub}</p>{action && <button onClick={action.onClick} style={{ padding: "9px 24px", background: GOLD, border: "none", borderRadius: 8, color: "#0a0a0a", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif" }}>{action.label}</button>}</div>;
}
