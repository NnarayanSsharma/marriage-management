import Link from "next/link";
import type { ReactNode } from "react";
import { HomeHeader } from "./home-header";
import styles from "./home.module.css";

type IconName = "calendar" | "tasks" | "guests" | "money" | "vendor" | "website" | "camera" | "family" | "check" | "arrow" | "heart" | "diamond";
const paths: Record<IconName, ReactNode> = {
  calendar: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16"/><circle cx="12" cy="16" r="2"/></>,
  tasks: <path d="m3 6 2 2 4-4m-6 10 2 2 4-4M13 6h8m-8 8h8M4 21h17"/>,
  guests: <><circle cx="10" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2H3Zm13-15a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5v1h-4"/></>,
  money: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8m-8 4h8m-6-4c5 0 5 6 0 6H8l6 5"/></>,
  vendor: <><rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 4V2m8 2V2M8 17h8"/><circle cx="12" cy="10" r="2"/></>,
  website: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18m-7 0v11M6 13h5m-5 3h5"/></>,
  camera: <><path d="M8 5 9 3h6l1 2h4v15H4V5h4Z"/><circle cx="12" cy="12" r="4"/></>,
  family: <><circle cx="12" cy="6" r="3"/><circle cx="4" cy="10" r="2"/><circle cx="20" cy="10" r="2"/><path d="M7 21v-5a5 5 0 0 1 10 0v5M1 21v-5a3 3 0 0 1 4-3m18 8v-5a3 3 0 0 0-4-3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  heart: <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 4 11 8 15 4-4 13-10 8-15Z"/>,
  diamond: <path d="m3 8 4-5h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18"/>,
};

function Icon({ name }: { name: IconName }) {
  return <svg className={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function StartLink({ light = false }: { light?: boolean }) {
  return <Link href="/signup" className={light ? styles.lightButton : styles.primaryButton}>Start Planning Your Wedding <Icon name="arrow"/></Link>;
}
function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className={styles.sectionHeading}><span className={styles.eyebrow}>{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

const events = [["Mehendi Celebration", "Feb 12 • 4:00 PM • Poolside Lawn", "45 invitations"], ["Musical Sangeet", "Feb 13 • 7:30 PM • Royal Ballroom", "180 invitations"], ["Wedding Ceremony", "Feb 14 • 10:15 AM • Mandap Pavilion", "Wedding day"], ["Royal Reception", "Feb 15 • 8:00 PM • Palace Courtyard", "160 invitations"]];
const tasks = [["Finalize Mehendi artist", "Priya (Sister)", true], ["Verify Mandap floral layout", "Aarav (Groom)", false], ["Confirm reception playlist", "Uncle Rajesh", false]] as const;

function DashboardPreview() {
  const metrics = [["Countdown", "42", "Days to go"], ["Ceremonies", "6", "Haldi to Reception"], ["Guest groups", "186", "Invitations planned"], ["Tasks status", "32 / 48", "Tasks completed"], ["RSVP responses", "150", "132 attending groups"], ["Total expenses", "₹12,45,000", "Recorded to date"]];
  return <figure className={styles.dashboard} aria-label="Example wedding dashboard with fictional planning information">
    <div className={styles.browserBar}><div className={styles.browserDots} aria-hidden="true"><i/><i/><i/></div><span className={styles.address}>Marriage Management / Wedding Overview</span><span className={styles.previewBadge}>Illustrative preview</span></div>
    <div className={styles.dashboardHeader}><div className={styles.coupleIdentity}><span className={styles.coupleAvatar}>A&amp;A</span><div><div className={styles.coupleTitle}><h3>Ananya &amp; Aarav’s Wedding</h3><span className={styles.goldTag}>Jaipur, Rajasthan</span></div><p>14 February 2027 • Rambagh Palace &amp; Leela Lawns</p></div></div><div className={styles.profile}><span>Aarav Singhania<small>Groom • Admin</small></span><span className={styles.avatar}>AS</span></div></div>
    <div className={styles.dashboardBody}><div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className={styles.dashboardColumns}><div className={styles.previewPanel}><div className={styles.panelHeading}><h4><Icon name="calendar"/> Event Itinerary</h4><span>4 of 6 events</span></div><div className={styles.eventList}>{events.map(([name, date, tag], index) => <div className={styles.event} key={name}><span className={`${styles.eventStripe} ${styles[`stripe${index}`]}`}/><div><strong>{name}</strong><small>{date}</small></div><span className={index === 2 ? styles.burgundyTag : styles.pinkTag}>{tag}</span></div>)}</div></div>
        <div className={styles.checklistColumn}><div className={styles.previewPanel}><div className={styles.panelHeading}><h4><Icon name="tasks"/> Action Checklist</h4><span>16 pending</span></div><div className={styles.taskList}>{tasks.map(([title, assignee, done]) => <div className={styles.task} key={title}><span className={done ? styles.checked : styles.unchecked} aria-hidden="true">{done && "✓"}</span><span className={done ? styles.completed : ""}>{title}</span><small>{assignee}</small></div>)}</div></div><div className={styles.previewPanel}><div className={styles.progressHeading}><strong>Guest RSVP Response Progress</strong><span>186 invitations</span></div><div className={styles.progressTrack}><span/><span/><span/></div><div className={styles.progressLegend}><span>132 attending</span><span>18 declined</span><span>36 awaiting</span></div></div></div>
      </div>
    </div>
  </figure>;
}

const comparisons = [
  ["Scattered Spreadsheets", "Different versions, outdated guest counts, and details spread across devices.", "One Centralized Workspace", "A shared home for events, tasks, guests, expenses, and vendor information."],
  ["Endless Family Message Groups", "Important decisions buried beneath chat threads and voice messages.", "Clear Accountability & Deadlines", "Assign tasks to family members so everyone knows who is handling what."],
];
const features: { icon: IconName; title: string; text: string; kind: string }[] = [
  { icon: "calendar", title: "Multi-Day Event Planning", text: "Organize every celebration, from Haldi to Reception, with dates, venues, and dress codes.", kind: "events" },
  { icon: "tasks", title: "Task Coordination", text: "Assign responsibilities to family members and track preparations in one shared checklist.", kind: "tasks" },
  { icon: "guests", title: "Guest & RSVP Tracking", text: "Manage guest groups, invited events, and attendance responses without scattered lists.", kind: "guests" },
  { icon: "money", title: "Expense Visibility", text: "Record wedding expenses and keep total spending clear, right down to the last rupee.", kind: "expenses" },
  { icon: "vendor", title: "Your Wedding Vendors", text: "Keep vendor contacts together and discover nearby photographers, caterers, and more.", kind: "vendors" },
  { icon: "website", title: "A Wedding Website", text: "Share your celebration through a predefined theme, event details, and a YouTube livestream.", kind: "website" },
  { icon: "camera", title: "Private Photo Sharing", text: "Let guests view and contribute wedding photos through a shared gallery link or QR code.", kind: "photos" },
];
function FeatureExample({ kind }: { kind: string }) {
  if (kind === "events") return <div className={styles.miniItinerary}><div><span>A celebration to remember</span><strong>Day 2 of 3</strong></div><div className={styles.miniEvents}><span>Mehendi<small>4:00 PM • Green Lawn</small></span><span>Family Gathering<small>6:00 PM • Verandah</small></span><span>Sangeet<small>8:00 PM • Main Hall</small></span></div></div>;
  if (kind === "tasks") return <div className={styles.miniRows}><span>Order Mithai Boxes <b className={styles.greenTag}>Completed</b></span><span>Finalize Outfits <b className={styles.goldTag}>In Progress</b></span></div>;
  if (kind === "guests") return <div className={styles.miniRows}><span><strong>132 attending groups</strong><Icon name="guests"/></span><small>Responses in one place</small></div>;
  if (kind === "expenses") return <div className={styles.miniRows}><span>Total recorded <strong>₹12,45,000</strong></span><small>Across all wedding events</small></div>;
  if (kind === "vendors") return <div className={styles.miniRows}><span>Shaadi Decor Studio <b>Decorator</b></span><span>Royal Sweets <b>Caterer</b></span></div>;
  if (kind === "website") return <div className={styles.miniRows}><span><Icon name="website"/> /w/ananya-aarav-14022027</span></div>;
  if (kind === "photos") return <div className={styles.miniRows}><span><strong>342 photos gathered</strong><Icon name="camera"/></span></div>;
  return <div className={styles.avatarStack}><span>AS</span><span>AG</span><span>SS</span><span>+4</span></div>;
}
const members = [["AG", "Ananya Gupta", "Bride • Admin", "Admin"], ["AS", "Aarav Singhania", "Groom • Admin", "Admin"], ["SS", "Sunita Sharma", "Mother • Manager", "Manager"], ["RP", "Rajesh Patel", "Uncle • Manager", "Manager"]];
const steps = [["Create Your Wedding", "Add your couple names, wedding date, and location to make the workspace yours."], ["Invite Your Family", "Bring trusted parents, siblings, and friends into your wedding workspace."], ["Plan Everything", "Organize events, assign tasks, manage guests, and record expenses together."], ["Celebrate Together", "Share invitations, collect RSVPs, and gather the memories of your celebrations."]];
const faqs = [
  ["Who is Marriage Management designed for?", "Couples and their families planning an Indian wedding. One wedding workspace brings your events, tasks, guests, expenses, vendors, and memories together."],
  ["Do our guests need to create an account?", "No. Guests can view their invitation and submit or update their RSVP using a unique link. A separate shared gallery link lets them view and upload photos when guest uploads are enabled."],
  ["Can our family help manage the wedding?", "Yes. Admins can invite family members as Admins or Managers. Both roles work with the same wedding data; only Admins can invite or remove members and change member roles."],
  ["Can we invite guests to selected events?", "Yes. Each invitation can include selected wedding events. A guest group submits one overall RSVP and an attending count within the limit you set."],
  ["Does it include budgeting or vendor payments?", "V1 tracks recorded expenses and vendor information. Budget planning, payment installments, vendor bookings, and payment processing are outside its scope."],
  ["Is the application available to use yet?", "This page previews the planned V1 experience. Account pages and wedding-management features are still under development; the examples shown here use fictional data."],
];
function GuestPreview() {
  return <figure className={styles.phone} aria-label="Illustrative guest invitation with fictional event details"><div className={styles.phoneScreen}><div className={styles.phoneStatus}><span>9:41</span><span className={styles.phoneNotch}/><span aria-hidden="true">▥</span></div><div className={styles.invitation}><span className={styles.coupleAvatar}>A&amp;A</span><span className={styles.eyebrow}>You’re invited</span><h3>Ananya &amp; Aarav</h3><p>14 February 2027 • Rambagh Palace, Jaipur</p><div className={styles.phoneEvents}>{[["Sangeet & Cocktails", "13 Feb • 7:00 PM • Royal Ballroom"], ["Pheras & Wedding", "14 Feb • 10:00 AM • Mandap Pavilion"], ["Grand Reception", "15 Feb • 8:00 PM • Courtyard"]].map(([name, detail], i) => <div key={name}><span><strong>{name}</strong><small>{detail}</small></span><Icon name={i === 1 ? "heart" : "calendar"}/></div>)}</div><div className={styles.phoneRsvp}><strong>Will you celebrate with us?</strong><div><span>Accept with Joy</span><span>Regretfully Decline</span></div><p><span>Total attending</span><b>2 people</b></p></div><div className={styles.phoneFooter}><span>Private wedding gallery</span><strong>View &amp; share <Icon name="arrow"/></strong></div><span className={styles.sampleLabel}>Invitation preview • sample data</span></div></div></figure>;
}

export function HomePage() {
  return <div className={styles.home}>
    <a href="#main-content" className={styles.skipLink}>Skip to content</a><HomeHeader/>
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero}><div className={styles.heroContent}><span className={styles.heroPill}><span aria-hidden="true">✦</span> Wedding Planning, Beautifully Simplified</span><h1>Your Indian Wedding. <span>One Shared Plan.</span></h1><p>Bring your family, events, guests, and wedding preparations together in one shared workspace.</p><div className={styles.heroActions}><StartLink/><a href="#features" className={styles.secondaryButton}>Explore Features</a></div><p className={styles.availability}>V1 preview — account features coming next.</p><p className={styles.reassurance}><span/> Made for Indian weddings. Designed for the whole family.</p></div><div className={styles.wideContainer}><DashboardPreview/></div></section>
      <section className={`${styles.section} ${styles.tinted}`}><div className={`${styles.contentContainer} ${styles.familyGrid}`}><div className={styles.familyCopy}><span className={styles.eyebrow}>Harmonious coordination</span><h2>Plan It Together. Celebrate Together.</h2><p>Indian weddings are family affairs. Share responsibilities with clarity, so parents, siblings, and friends know exactly what to handle.</p><ol className={styles.familyPoints}><li><span>1</span><div><h3>Admins</h3><p>Manage the wedding and invite your trusted people into the workspace.</p></div></li><li><span>2</span><div><h3>Managers</h3><p>Plan alongside the Admins, with access to the same events, guests, tasks, and expenses.</p></div></li><li><span>3</span><div><h3>Clear Task Assignment</h3><p>Give every task an owner, a due date, and a clear next step.</p></div></li></ol></div><div className={styles.teamCard}><div className={styles.teamHeading}><div><h3>Your Family Team</h3><p>4 members • 2 member roles</p></div><span className={styles.sampleLabel}>Sample team</span></div><div className={styles.memberList}>{members.map(([initials, name, note, role], index) => <div className={styles.member} key={name}><span className={`${styles.memberAvatar} ${styles[`memberColor${index}`]}`}>{initials}</span><div><strong>{name}</strong><small>{note}</small></div><span className={role === "Admin" ? styles.pinkTag : styles.goldTag}>{role}</span></div>)}</div></div></div></section>
      <section id="why-marriage-management" className={`${styles.section} ${styles.tinted}`}><div className={styles.contentContainer}><SectionHeading eyebrow="Contrast & clarity" title="Less Chaos. More Celebration.">Wedding planning shouldn’t mean juggling ten spreadsheets, endless WhatsApp voice notes, and scattered guest lists.</SectionHeading><div className={styles.comparisonGrid}><div className={styles.beforeCard}><h3><span aria-hidden="true">×</span> Traditional Wedding Scramble</h3>{comparisons.map(([title, text]) => <div className={styles.comparisonItem} key={title}><span className={styles.cross} aria-hidden="true">×</span><div><h4>{title}</h4><p>{text}</p></div></div>)}</div><div className={styles.afterCard}><h3><span aria-hidden="true">✓</span> With Marriage Management</h3>{comparisons.map(([, , title, text]) => <div className={styles.comparisonItem} key={title}><Icon name="check"/><div><h4>{title}</h4><p>{text}</p></div></div>)}</div></div></div></section>
      <section id="features" className={styles.section}>
        <div className={styles.wideContainer}>
          <SectionHeading eyebrow="From planning to memories" title="Every Part of Your Wedding, Connected.">Follow your wedding journey in one place.</SectionHeading>
          <div className={styles.featureGroups}>
            {[
              { title: "Plan Together", description: "Give every celebration a plan and every preparation an owner.", kinds: ["events", "tasks", "expenses", "vendors"] },
              { title: "Invite & Celebrate", description: "Share the details that matter, with the people who matter.", kinds: ["guests", "website"] },
              { title: "Keep the Memories", description: "Bring everyone’s wedding photos into one private gallery.", kinds: ["photos"] },
            ].map((group, index) => (
              <div className={styles.featureGroup} key={group.title}>
                <div className={styles.groupHeading}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div><h3>{group.title}</h3><p>{group.description}</p></div>
                </div>
                <div className={styles.featureGrid}>
                  {features.filter(feature => group.kinds.includes(feature.kind)).map(feature => (
                    <article key={feature.title} className={styles.featureCard}>
                      <span className={styles.featureIcon}><Icon name={feature.icon}/></span>
                      <h4>{feature.title}</h4><p>{feature.text}</p>
                      <div className={styles.featureExample}><FeatureExample kind={feature.kind}/></div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className={styles.sampleLabel}>Planned V1 features • previews use fictional information.</p>
        </div>
      </section>
      <section id="how-it-works" className={styles.section}><div className={styles.contentContainer}><SectionHeading eyebrow="Straightforward process" title="From Your First Plan to Your Big Day">Start with the essentials. Build your plan together, one celebration at a time.</SectionHeading><ol className={styles.steps}>{steps.map(([title, text], i) => <li key={title}><span>{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>
      <section className={`${styles.section} ${styles.tinted}`}><div className={styles.contentContainer}><SectionHeading eyebrow="Effortless attendance" title="An Invitation. A Link. A Warm Welcome.">Guests can view invitations, respond to RSVPs, and see the events they’re invited to through secure links — without downloading an app or creating an account.</SectionHeading><GuestPreview/></div></section>
      <section id="privacy" className={`${styles.section} ${styles.tinted}`}>
        <div className={styles.contentContainer}>
          <SectionHeading eyebrow="Share with confidence" title="Your Planning Stays Private.">A private workspace for your family. Thoughtful sharing for your guests.</SectionHeading>
          <div className={styles.privacyGrid}>
            <article><Icon name="family"/><h3>Private Family Workspace</h3><p>Wedding planning data is accessible only to your wedding’s Admins and Managers.</p></article>
            <article><Icon name="guests"/><h3>Guest-Specific Invitations</h3><p>Guests see only their invited events. Your separate gallery link can be shared with anyone you want to view or contribute photos.</p></article>
            <article><Icon name="website"/><h3>You Choose When to Publish</h3><p>Publish your wedding website when you’re ready. Publishing it does not open your private planning workspace.</p></article>
          </div>
        </div>
      </section>
      <section id="faqs" className={styles.section}><div className={styles.faqContainer}><SectionHeading eyebrow="A little more clarity" title="Your Questions, Answered">Simple answers for your family’s next big celebration.</SectionHeading><div className={styles.faqs}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className={styles.finalCta}><span className={styles.diamond}><Icon name="diamond"/></span><h2>Your Big Day Deserves a Better Plan.</h2><p>Bring every celebration, every guest, and every beautiful moment together in one shared wedding workspace.</p><StartLink light/><small>V1 preview — account features coming next.</small></section>
    </main>
    <footer className={styles.footer}><div className={styles.wideContainer}><div className={styles.footerTop}><div className={styles.footerBrand}><Link href="/" className={styles.brand}><span className={styles.brandMark} aria-hidden="true">m<span>♥</span></span><span>Marriage Management</span></Link><p>The operating system for managing an Indian wedding.</p></div><div><h3>Product</h3><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#faqs">FAQs</a></div><div><h3>Account</h3><Link href="/login">Log In</Link><Link href="/signup">Get Started</Link></div><div className={styles.footerNote}><h3>Made for your family</h3><p>One wedding.<br/>Every celebration.<br/>All your people.</p></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} Marriage Management.</span><span>With love, for Indian weddings.</span></div></div></footer>
  </div>;
}
