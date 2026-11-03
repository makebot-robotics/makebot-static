const CURRICULUM_CARDS = [
  {
    title: "Robo Beginners",
    grade: "Grade 1 – 3",
    desc: "Fun, story-based introduction to robotics, shapes, and basic movement using block coding.",
    lessons: 40,
    duration: "45 min",
    projects: 10,
    price: "₹2,499",
    icon: "ti-robot",
    gradient: "g1",
    badge: "Bestseller"
  },
  {
    title: "Robo Explorer",
    grade: "Grade 4 – 6",
    desc: "Sensors, motors, and simple machines — students build and program their first real robots.",
    lessons: 60,
    duration: "45 min",
    projects: 15,
    price: "₹3,499",
    icon: "ti-circuit-board",
    gradient: "g2",
    badge: "Popular"
  },
  {
    title: "Robo Engineer",
    grade: "Grade 7 – 9",
    desc: "Arduino, line followers, obstacle detection — full STEM integration with coding challenges.",
    lessons: 80,
    duration: "60 min",
    projects: 20,
    price: "₹4,999",
    icon: "ti-cpu",
    gradient: "g3",
    highlight: true
  }
//   {
//     title: "Robo Pro",
//     grade: "Grade 10 – 12",
//     desc: "AI, Python, and IoT — prepares senior students for competitions and engineering careers.",
//     lessons: 100,
//     duration: "60 min",
//     projects: 25,
//     price: "₹6,499",
//     icon: "ti-brand-python",
//     gradient: "g4",
//     badge: "New"
//   },
//   {
//     title: "Demooooo",
//     grade: "Grade 10 – 12",
//     desc: "AI, Python, and IoT — prepares senior students for competitions and engineering careers.",
//     lessons: 100,
//     duration: "60 min",
//     projects: 25,
//     price: "₹6,499",
//     icon: "ti-brand-python",
//     gradient: "g4",
//     badge: "New"
//   },
//   {
//     title: "Demooooo2",
//     grade: "Grade 10 – 12",
//     desc: "AI, Python, and IoT — prepares senior students for competitions and engineering careers.",
//     lessons: 100,
//     duration: "60 min",
//     projects: 25,
//     price: "₹6,499",
//     icon: "ti-brand-python",
//     gradient: "g4",
//     badge: "New"
//   }
];


 
/* ── Renderer — no need to edit below this line ── */
(function renderCards() {
  const grid = document.getElementById('cur-grid');
  if (!grid) return;
 
  grid.innerHTML = CURRICULUM_CARDS.map(c => `
    <div class="cur-card"${c.highlight ? ' style="border:2px solid var(--brand-violet);position:relative"' : ''}>
      ${c.highlight
        ? `<div style="
              position:absolute;top:-13px;left:50%;
              transform:translateX(-50%);
              background:linear-gradient(135deg, var(--brand-violet) 0%, var(--brand-violet) 100%);
              color:#fff;font-size:11px;font-weight:600;
              padding:4px 16px;border-radius:20px;white-space:nowrap
            ">Most advanced</div>`
        : ''}
      <div class="cur-card-top ${c.gradient}">
        <i class="ti ${c.icon}" aria-hidden="true"></i>
        ${c.badge ? `<span class="cur-badge">${c.badge}</span>` : ''}
      </div>
      <div class="cur-body">
        <h3>${c.title}</h3>
        <span class="grade">${c.grade}</span>
        <p>${c.desc}</p>
        <div class="cur-meta">
          <span><i class="ti ti-book-2" aria-hidden="true"></i> ${c.lessons} lessons</span>
          <span><i class="ti ti-clock" aria-hidden="true"></i> ${c.duration} each</span>
          <span><i class="ti ti-puzzle" aria-hidden="true"></i> ${c.projects} projects</span>
        </div>
        <div class="cur-price">
          <div class="price-val">${c.price} <small>/ year</small></div>
          <button class="buy-btn">
            <i class="ti ti-shopping-cart" aria-hidden="true" style="margin-right:4px;vertical-align:-2px"></i>Buy
          </button>
        </div>
      </div>
    </div>
  `).join('');
})();