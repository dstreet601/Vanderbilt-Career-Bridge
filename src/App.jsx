import { useState, useRef, useCallback } from "react";
import mammoth from "mammoth";

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
