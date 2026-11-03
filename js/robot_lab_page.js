/* ============================================================
   robot_lab_page.js
   Edit the data arrays below to update page content.
   Renderers at the bottom handle the HTML automatically.
   ============================================================ */


/* ── 1. LAB PACKAGES ──────────────────────────────────────────
   Fields:
     name        : string   — package name
     schoolSize  : string   — ideal school size label
     desc        : string   — short description
     includes    : string[] — list of inclusions (max 5)
     price       : string   — price (e.g. "₹3,50,000")
     priceNote   : string   — note below price (e.g. "one-time setup")
     icon        : string   — Tabler icon class (ti-xxx)
     gradient    : string   — "g1" | "g2" | "g3" | "g4"
     badge       : string   — ribbon text, or "" for none
     featured    : boolean  — true = purple border highlight
   ──────────────────────────────────────────────────────────── */
const LAB_PACKAGES = [
  {
    name: "Starter Lab",
    schoolSize: "Up to 200 students",
    desc: "A compact, fully equipped lab for small schools taking their first step into robotics.",
    includes: [
      "10 robotics kits",
      "Basic curriculum (Grade 1–5)",
      "Teacher training (1 day)",
      "Lab furniture & layout design",
      "6-month support"
    ],
    price: "₹3,50,000",
    priceNote: "one-time setup",
    icon: "ti-rocket",
    gradient: "g1",
    badge: "",
    featured: false
  },
  {
    name: "Explorer Lab",
    schoolSize: "200–500 students",
    desc: "A mid-size lab with advanced kits and curriculum covering primary and middle school.",
    includes: [
      "20 robotics kits",
      "Curriculum for Grade 1–8",
      "Teacher training (2 days)",
      "Lab branding & signage",
      "1-year support"
    ],
    price: "₹6,00,000",
    priceNote: "one-time setup",
    icon: "ti-cpu",
    gradient: "g2",
    badge: "Most Popular",
    featured: true
  },
  {
    name: "Pro Lab",
    schoolSize: "500–1000 students",
    desc: "A full-scale lab for large schools with Arduino, IoT, and AI-ready infrastructure.",
    includes: [
      "35 robotics & IoT kits",
      "Curriculum for Grade 1–12",
      "Teacher training (3 days)",
      "Dedicated lab manager (1 month)",
      "2-year AMC included"
    ],
    price: "₹10,50,000",
    priceNote: "one-time setup",
    icon: "ti-brand-python",
    gradient: "g3",
    badge: "",
    featured: false
  },
  {
    name: "Elite Lab",
    schoolSize: "1000+ students",
    desc: "A premium, competition-ready lab with cutting-edge equipment and ongoing mentorship.",
    includes: [
      "50+ kits incl. drone & AI kits",
      "Full K-12 curriculum + competitions",
      "Teacher training (5 days + online)",
      "Quarterly lab audits",
      "3-year full AMC"
    ],
    price: "₹18,00,000",
    priceNote: "one-time setup",
    icon: "ti-trophy",
    gradient: "g4",
    badge: "Premium",
    featured: false
  }
];


/* ── 2. FEATURES ──────────────────────────────────────────────
   Fields:
     title : string — feature name
     desc  : string — short description
     icon  : string — Tabler icon class (ti-xxx)
   ──────────────────────────────────────────────────────────── */
const FEATURES = [
  { title: "Lab Design & Layout",    desc: "Custom floor plan and furniture arrangement optimised for collaborative robotics sessions.", icon: "ti-layout-dashboard" },
  { title: "Equipment & Kits",       desc: "Age-appropriate robotics hardware — from basic block-coding bots to Arduino and AI kits.",  icon: "ti-tools"            },
  { title: "Curriculum Integration", desc: "STEM-aligned lesson plans, slide decks, and worksheets for every grade covered in your lab.", icon: "ti-book-2"          },
  { title: "Teacher Training",       desc: "On-site and online training sessions to make your teachers confident on day one.",           icon: "ti-school"           },
  { title: "Lab Branding",           desc: "Wall graphics, banners, and signage that give your lab a world-class identity.",            icon: "ti-brush"            }
//   { title: "Annual Maintenance",     desc: "Scheduled AMC visits, spare parts replacement, and kit servicing throughout the year.",     icon: "ti-settings"         },
//   { title: "Competition Prep",       desc: "Guidance and practice resources to help students participate in national robotics olympiads.", icon: "ti-trophy"         },
//   { title: "Dedicated Support",      desc: "A named support contact via WhatsApp and email for quick resolution of any lab issue.",     icon: "ti-headset"          }
];


/* ── 3. PROCESS STEPS ─────────────────────────────────────────
   Fields:
     title : string — step heading
     desc  : string — short description
   ──────────────────────────────────────────────────────────── */
const PROCESS_STEPS = [
  { title: "Free Consultation", desc: "Tell us about your school — we assess your space, budget, and goals."          },
  { title: "Custom Proposal",   desc: "Receive a detailed lab design and package proposal within 48 hours."           },
  { title: "Site Visit",        desc: "Our team visits to finalise layout, measurements, and civil requirements."     },
  { title: "Lab Build",         desc: "We install furniture, equipment, and branding — usually in 2–3 days."          },
  { title: "Teacher Training",  desc: "On-site training for your staff so they're ready to teach from day one."       },
  { title: "Launch Day",        desc: "Inauguration support and a demo class to kick off your robotics programme."    }
];


/* ── 4. TESTIMONIALS ──────────────────────────────────────────
   Fields:
     quote    : string — testimonial text
     name     : string — person name
     role     : string — designation and school
     initials : string — 1–2 chars for avatar
     stars    : number — rating out of 5
   ──────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:    "Robotica Labs transformed an unused room into a stunning robotics lab in just 4 days. Our students are obsessed — we've had zero complaints since launch.",
    name:     "Priya Menon",
    role:     "Principal, DPS Kochi",
    initials: "PM",
    stars:    5
  },
  {
    quote:    "The teacher training was excellent. Even our non-tech staff feel confident running robotics classes. The curriculum made it so easy to get started.",
    name:     "Rakesh Sharma",
    role:     "STEM Coordinator, Ryan International, Pune",
    initials: "RS",
    stars:    5
  },
  {
    quote:    "We compared three vendors. Robotica Labs stood out for transparency, quality of kits, and post-setup support. Worth every rupee.",
    name:     "Sunita Iyer",
    role:     "Director, The Orchid School, Bangalore",
    initials: "SI",
    stars:    5
  }
];


/* ── 5. FAQ ───────────────────────────────────────────────────
   Fields:
     q : string — question
     a : string — answer
   ──────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How long does the complete lab setup take?",
    a: "Typically 4–6 weeks from signing the agreement — this includes design finalisation, procurement, civil work (if needed), installation, branding, and teacher training. Compact starter labs can be ready in as little as 2 weeks."
  },
  {
    q: "Do you provide the robotics curriculum along with the lab?",
    a: "Yes. Every package includes a grade-appropriate STEM curriculum with lesson plans, slide decks, worksheets, and project guides. We also provide tutorial videos for each project."
  },
  {
    q: "What after-sales support do you offer?",
    a: "All packages include at least 6 months of dedicated support via WhatsApp and email. Pro and Elite packages include Annual Maintenance Contracts (AMC) covering scheduled visits, kit servicing, and spare part replacements."
  },
  {
    q: "Can the lab setup be customised to our school's budget?",
    a: "Absolutely. Our listed packages are starting points. We regularly create custom proposals based on available space, student count, existing infrastructure, and budget constraints. Contact us for a free consultation."
  },
  {
    q: "Do you provide training for teachers who have no robotics background?",
    a: "Yes — our training is designed specifically for teachers with no prior robotics experience. We use hands-on, activity-based sessions and provide reference guides so teachers feel confident from day one."
  },
  {
    q: "Which brands of robotics kits do you supply?",
    a: "We supply a curated mix of kits including Lego Education, Arduino, Makebot, and our own branded kits developed for the Indian school curriculum. Kits vary by package and grade level."
  }
];


/* ================================================================
   RENDERERS — no need to edit below this line
   ================================================================ */

function renderPackages() {
  const grid = document.getElementById('pkg-grid');
  if (!grid) return;
  grid.innerHTML = LAB_PACKAGES.map(p => `
    <div class="pkg-card${p.featured ? ' featured' : ''}">
      ${p.badge ? `<div class="pkg-ribbon">${p.badge}</div>` : ''}
      <div class="pkg-top ${p.gradient}">
        <i class="ti ${p.icon}" aria-hidden="true"></i>
      </div>
      <div class="pkg-body">
        <h3>${p.name}</h3>
        <span class="pkg-school-size">${p.schoolSize}</span>
        <p>${p.desc}</p>
        <ul class="pkg-includes">
          ${p.includes.map(item => `
            <li><i class="ti ti-circle-check" aria-hidden="true"></i>${item}</li>
          `).join('')}
        </ul>
        <div class="pkg-price-row">
          <div class="pkg-price">${p.price} <small>/ ${p.priceNote}</small></div>
          <button class="pkg-btn">Enquire</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFeatures() {
  const grid = document.getElementById('feat-grid');
  if (!grid) return;
  grid.innerHTML = FEATURES.map(f => `
    <div class="feat-card">
      <div class="feat-icon"><i class="ti ${f.icon}" aria-hidden="true"></i></div>
      <h4>${f.title}</h4>
      <p>${f.desc}</p>
    </div>
  `).join('');
}

function renderProcess() {
  const track = document.getElementById('proc-track');
  if (!track) return;
  track.innerHTML = PROCESS_STEPS.map((s, i) => `
    <div class="proc-step">
      <div class="proc-num">${i + 1}</div>
      <h4>${s.title}</h4>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function renderTestimonials() {
  const grid = document.getElementById('testi-grid');
  if (!grid) return;
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <div class="testi-stars">${'★'.repeat(t.stars)}</div>
      <blockquote>"${t.quote}"</blockquote>
      <div class="testi-person">
        <div class="testi-avatar">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFAQ() {
  const list = document.getElementById('faq-list');
  if (!list) return;
  list.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" onclick="toggleFAQ(${i})">
        <span>${f.q}</span>
        <i class="ti ti-plus" aria-hidden="true"></i>
      </button>
      <div class="faq-a">${f.a}</div>
    </div>
  `).join('');
}

function toggleFAQ(index) {
  const item = document.getElementById('faq-' + index);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

document.addEventListener('componentsReady', () => {
  renderPackages();
  renderFeatures();
  renderProcess();
  renderTestimonials();
  renderFAQ();
});