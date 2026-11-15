# Learning design, question design and lab design for a CCNA self-study platform

Research date: 2026-11-15. Target learner: complete beginner, Romanian speaker, no fixed exam date.

Network note: in this session only GitHub and web search were reachable. cisco.com, netacad/ptnetacad, expertium.github.io, techdows.com and computingforgeeks.com could not be fetched (DNS blocked). So Cisco facts below come from search-result snippets of Cisco pages plus secondary sources, and are flagged as such. Before publishing, re-check them directly on cisco.com and netacad.com.

## 1. What does learning research say about retrieval practice, spaced repetition, interleaving, worked examples and faded guidance? How should beginner lessons be layered?

### Takeaway
Two techniques have the strongest evidence: practice testing with feedback, and spacing study over time. Interleaving and self-explanation have moderate evidence. Rereading and highlighting have low evidence. For a total beginner, the best start is worked examples, with guidance faded out gradually, because worked examples stop helping (the "expertise reversal" effect) as the learner gains knowledge. That maps directly onto a guided-lab to solo-lab progression and onto layered lessons.

### Cited Findings
- Dunlosky et al. (2013), *Psychological Science in the Public Interest* 14(1):4–58, DOI 10.1177/1529100612453266, rated ten techniques:
  - **High utility:** practice testing and distributed practice. They work across ages, abilities and criterion tasks, including in real classrooms.
  - **Moderate utility:** elaborative interrogation, self-explanation and interleaved practice.
  - **Low utility:** summarization, highlighting, the keyword mnemonic, imagery for text, and rereading. Most students nonetheless report rereading and highlighting.
  - Sources: [APS press release](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html); [ScienceDaily](https://www.sciencedaily.com/releases/2013/01/130110111734.htm); [Reading Rockets summary](https://www.readingrockets.org/resources/resource-library/improving-students-learning-effective-learning-techniques-promising)
- Practice testing produces the most learning when it comes with corrective feedback. — [Reading Rockets summary of Dunlosky et al.](https://www.readingrockets.org/resources/resource-library/improving-students-learning-effective-learning-techniques-promising)
- Roediger & Karpicke (2006), "Test-enhanced learning": taking a memory test does more than measure what one knows; it also improves later retention. Students did not predict this effect. — [Roediger & Karpicke 2006 PDF (ECU)](https://psychology.ecu.edu/wp-content/pv-uploads/sites/216/2019/03/Roediger-Karpicke-2006.pdf); [WUSTL profile](https://profiles.wustl.edu/en/publications/test-enhanced-learning-taking-memory-tests-improves-long-term-ret/)
- Interleaving meta-analysis by Brunmair & Richter (2019), *Psychological Bulletin* 145(11):1029–1052, doi:10.1037/bul0000209 — [PubMed](https://pubmed.ncbi.nlm.nih.gov/31556629/); [Scinapse](https://scinapse.io/papers/2974119506):
  - Overall effect Hedges' g = 0.42 (moderate); g = 0.34 for math tasks.
  - Weaker or non-significant effects for expository texts and words.
  - Based on 59 studies and 238 effect sizes.
  - The effect is larger when categories are similar to each other, when items within a category are less similar, and when material is more complex.
- Worked examples and fading:
  - Fading means starting with a fully worked example and then giving progressively less of the solution (Atkinson, Renkl and colleagues, 2000–2004). — [ASU PDF on expertise reversal and fading](https://faculty.engineering.asu.edu/mre/wp-content/uploads/sites/31/2020/02/Exp_Rev_LI06.pdf)
  - Expertise reversal (Kalyuga et al. 2003): which instructional method works best reverses as learner knowledge grows. Worked examples help novices but can stop helping, or even hurt, more expert learners. — [Wikipedia: Worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect)
  - Salden, Aleven, Schwonke & Renkl (2010): adaptive fading beat fixed fading, and fixed fading beat pure problem solving, on posttest and delayed posttest. In the classroom study, adaptive fading won on the delayed test. — [Springer, Instructional Science](https://link.springer.com/doi/10.1007/s11251-009-9107-8)
  - Caveat: the worked-example and reversal effects come mostly from well-structured tasks. Nievelstein et al. 2013 tested less-structured domains. — [Wikipedia: Worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect)

### Inferences
These design proposals follow from the findings above.

**Lesson layering (one lesson, four layers):**
1. "Pe scurt" summary of 3–5 sentences, with a single diagram.
2. Detailed explanation, built around a **worked example**, for instance a fully worked subnetting problem or a `show ip route` output read line by line.
3. Optional "Aprofundare" deep dive, collapsed by default. This protects beginners from cognitive overload and still serves advanced learners, in line with expertise reversal.
4. "Capcane la examen" exam traps.

End every lesson with 3–5 retrieval questions with immediate feedback. Avoid "reread" or "highlight" as study actions.

**Faded guidance for labs:** follow the Renkl/Atkinson fading model.
1. Lab 1 is fully guided: every command is given and explained.
2. Lab 2 is partially guided: the objectives are given and some commands are blanked.
3. Lab 3 is solo: only the topology and requirements are given, with the solution hidden.
4. Troubleshooting labs: a broken config to fix.

Adaptive fading is better than fixed fading. So unlock the solo version, or skip the guided one, based on the learner's performance.

**Interleaving:** interleave confusable CCNA topics in review sessions, where the benefit is greatest for similar categories. Good pairs:
- OSPF vs EIGRP-style distance concepts
- Standard vs extended ACLs
- Access vs trunk ports
- /26 vs /27 subnetting

Keep the first learning of a topic blocked. Interleave only in reviews and mixed quizzes.

**No fixed exam date:** spacing has no deadline to fit, so let the scheduler run with a desired retention of about 0.85–0.9 (see section 2).

**Romanian speaker:** keep Cisco CLI and exam terms in English, with a Romanian gloss, because the real exam is not offered in Romanian. That language claim was not verified this session; see the exam section.

### Gaps
- No primary full text was fetched for Kalyuga 2003 or Renkl & Atkinson. The claims rely on abstracts and secondary summaries.
- No research was found specific to networking or CLI education, beyond vendor claims.
- I did not verify a Rohrer-specific effect size for math interleaving.

## 2. Which spaced repetition algorithm to implement today (SM-2 vs Leitner vs FSRS v4/v5/v6/v7)? Open-source implementations and licenses?

### Takeaway
Use FSRS, specifically FSRS-6, which is the current stable model with 21 parameters, through **ts-fsrs** (TypeScript) or **py-fsrs** (Python). Both are MIT-licensed. FSRS-6 beats FSRS-5 and FSRS-4.5 on large open benchmarks, and FSRS beats SM-2 in about 97–99% of collections. SM-2 and Leitner remain options only for a trivial MVP.

### Cited Findings
- **The FSRS model:**
  - It is based on MaiMemo's DHP model, a variant of Wozniak's DSR model. It tracks difficulty, stability (storage strength) and retrievability (retrieval strength).
  - It supports early and late reviews, adapts to the user, and runs locally.
  - The ecosystem is MIT-licensed.
  - Scheduler implementations exist in TypeScript (ts-fsrs), Go, Python (py-fsrs), Rust, Clojure, Dart, Ruby, Swift, Android and Elixir.
  - Optimizers: fsrs-optimizer (Python), fsrs-rs (Rust) and fsrs-browser (WASM).
  - Source: [open-spaced-repetition/free-spaced-repetition-scheduler](https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler)
- **ts-fsrs** — [ts-fsrs GitHub](https://github.com/open-spaced-repetition/ts-fsrs):
  - MIT license.
  - Current major version is "v6". The README badge lists support for FSRS-3, 4, 4.5, 5, 6 and 7, and `DefaultScheduler()` defaults to FSRS-7.
  - It ships ESM, CJS and UMD builds. v6 requires Node ≥ 24.
  - Parameters are trained from review logs by a separate package, `@open-spaced-repetition/binding`.
  - Caveat: I read this from the README via a summarizer. Check the default version and the Node requirement before adopting.
- **py-fsrs** — [py-fsrs GitHub](https://github.com/open-spaced-repetition/py-fsrs):
  - MIT license, installed with `pip install fsrs`.
  - Lists 21 default parameters, which matches FSRS-6.
  - Optional optimizer via `pip install "fsrs[optimizer]"`, which provides `compute_optimal_parameters` and `compute_optimal_retention`. Results may differ slightly from Anki's.
- **Benchmark** (srs-benchmark, anki-revlogs-10k dataset, about 727M reviews from 10k users) — [srs-benchmark GitHub](https://github.com/open-spaced-repetition/srs-benchmark):

  Without same-day reviews (9,999 collections, about 350M evaluated reviews):

  | Model | Log loss | RMSE (bins) | AUC |
  |---|---|---|---|
  | FSRS-6 | 0.3460 | 0.0653 | 0.7034 |
  | FSRS-5 | 0.3561 | 0.0742 | 0.7010 |
  | FSRS-4.5 | 0.3625 | 0.0764 | 0.6891 |
  | HLR | 0.4694 | 0.1275 | — |
  | ACT-R | 0.4033 | 0.1074 | — |

  - The experimental "FSRS-7 recency" variant scores log loss 0.3370 and RMSE 0.0593.
  - Neural models such as RWKV score better still, but are heavier.
- **FSRS vs SM-2:**
  - FSRS-6 has lower log loss than SM-2 in 99.6% of collections. — [mindomax summary](https://www.mindomax.com/fsrs-vs-sm2-spaced-repetition-algorithm) (secondary)
  - FSRS-5 beats a trainable SM-2 in 97.4% of cases. — [Anki forum](https://forums.ankiweb.net/t/video-fsrs-vs-anki-s-default-algorithm-sm-2/37925)
  - SM-2 was not designed to output probabilities, so the benchmark adds formulas to make the comparison possible. — [Expertium benchmark page](https://expertium.github.io/Benchmark.html) (seen via search snippet only)
- Blog claims of "25–50% fewer reviews" with FSRS are inconsistent with each other and were not verified. — [DEV Community](https://dev.to/palachdigital_20fd679f5fe/why-fsrs-is-better-than-sm-2-2m17)

### Inferences
- Implement FSRS through ts-fsrs for a web frontend, or py-fsrs for a Python backend. Store a full review log (card_id, timestamp, rating 1–4, state) from day 1 so you can run the optimizer once the learner has about 1,000+ reviews. Until then, use the default parameters.
- Pin the FSRS version explicitly, either FSRS-6 or the library default. Don't silently upgrade, because stored memory states can depend on the model version.
- Use an SRS "card" for atomic facts: port numbers, AD values, command syntax, OSI layers. Do not use SRS cards for labs. Handle labs with a coarser "revisit in N days" queue.
- A desired retention of 0.9 is the FSRS default convention. With no exam deadline, 0.85–0.9 balances workload. (This value comes from general FSRS knowledge and was not sourced this session; verify it in the ts-fsrs docs.)

### Gaps
- I could not fetch exact release numbers for ts-fsrs and py-fsrs (the GitHub Releases sections appeared empty in the fetch). It is also unclear whether FSRS-7 is the "stable" default or experimental. Verify on npm and PyPI.
- No Leitner numbers appear in the srs-benchmark README.

## 3. Best practices for MCQ item writing, explanations per option, drag-and-drop/matching, CLI fill-in and subnetting drill generation

### Takeaway
Follow the Haladyna–Downing–Rodriguez (2002) guidelines. Three good options is enough, and distractor quality matters more than distractor count. Make options homogeneous and similar in length. Avoid negative stems and "always/never" cues. For learning, the feedback matters more than the item itself: explain every option.

### Cited Findings
- Haladyna, Downing & Rodriguez (2002), "A review of multiple-choice item-writing guidelines for classroom assessment", *Applied Measurement in Education* 15(3):309–333 — [UNM summary](https://cpl.health.unm.edu/AssetListing/Writing-Questions-for-Learning-and-Assessment-2573/Rules-for-Multiple-Choice-Items-Haladyna-et-al-2002-5943); [bookdown summary](https://bookdown.org/stefanmosjos/manualesitems/_book/haladyna-2002.html); [KU Special Connections](https://specialconnections.ku.edu/assessment/quality_test_construction/teacher_tools/multiple_choice_questions):
  - Write as many effective options as you can, but three is adequate.
  - Keep options homogeneous in content and grammar, and similar in length.
  - Avoid negatively phrased stems and clue words such as "always" or "never".
- Rodriguez (2005) meta-analysis: three options are optimal in most settings. Going from 4–5 options to 3 had little effect on difficulty, discrimination or reliability. Distractor quality matters more than count. — [Rodriguez 2014 distractor functioning PDF (ACU)](https://acuresearchbank.acu.edu.au/download/b80d8639c49c02148efe594c4d30e08479fb6dfdbdc552674e7071d20ca03429/116532/Rodriguez_2014_Distractor_functioning_in_modofied_items_for_test.pdf); [UF COLT MCQ workshop](https://colt.ifas.ufl.edu/accordent/COLT/OnlineAssessmentWorkshopPart2/MultipleChoiceTests.pdf)
- Feedback after testing yields the highest learning. — [Reading Rockets / Dunlosky](https://www.readingrockets.org/resources/resource-library/improving-students-learning-effective-learning-techniques-promising)
- The real exam's formats are MCQ (single and multiple answer), drag-and-drop (match to category, or order steps) and simulations (configure devices over the CLI). — [examcert.app](https://www.examcert.app/blog/ccna-exam-questions-what-to-expect-2026/); [9tut FAQ](https://www.9tut.com/?p=51) (community sources)

### Inferences
Recommended item schema. This is a design proposal, not sourced:

```
{ id, topic (exam-topics code e.g. 3.4), difficulty, type: mcq_single|mcq_multi|dnd_match|dnd_order|cli_fill|subnet_gen|sim,
  stem_en, stem_ro, options[ {text, correct, explanation_ro, explanation_en, misconception_tag} ],
  reference_lesson_id, exam_trap_note }
```

**MCQ rules:**
- Each option gets its own explanation of why it is right or wrong. Tag each distractor with the misconception it targets, so the platform can route the learner to remediation.
- Use 4 options to match Cisco's exam look and feel, but every distractor must be plausible. Base distractors on real beginner errors:
  - Wrong wildcard mask
  - Confusing the network address with the first usable host
  - Mistaking a `show` command for a config command
  - Mixing up AD with metric
- For multi-answer items, state "Choose two", as Cisco does.

**Drag-and-drop:**
- Use match-to-category (for example, protocol to OSI layer, or command to mode) and order-the-steps (for example, the DHCP DORA sequence, or the STP election process).
- Score per pair internally, but show all-or-nothing in exam mode. Cisco's exact partial-credit rules are unknown; see the gaps.

**CLI fill-in:**
- Normalize input: case-insensitive, collapse whitespace, and accept unambiguous IOS abbreviations (for example `sh ip int br`, `conf t`).
- Keep a list of accepted variants per item, and say which prompt and mode the command is entered in (for example `R1(config-if)#`).
- Give a mode-awareness hint as feedback.

**Subnetting generator:**
- Generate the problems procedurally: random prefix /8–/30 (plus /31 and /32 edge cases), random host address, and question type:
  - network, broadcast, first/last host
  - number of hosts
  - VLSM allocation
  - wildcard mask
  - "which subnet does X belong to"
- Compute the answer key with a vetted library (for example Python's `ipaddress`) and show the full worked solution: block size, magic number, binary view.
- Feed per-skill accuracy into FSRS as a "skill card" rather than per-item cards, since generated items are never repeated.

### Gaps
- Cisco does not publicly document partial credit for multi-select or drag-and-drop items. Community sources only report that sims give credit per task.
- I found no published evidence on item formats specific to CLI learning.

## 4. What does the real CCNA exam feel like, so a configurable simulation mode can mimic it?

### Takeaway
The CCNA 200-301 is a 120-minute exam at about USD 300, with no prerequisites, delivered linearly: no review screen, and no going back after "Next". Questions mix MCQ, drag-and-drop and CLI simulations or simlets. Topics are v1.1. A v2.0 blueprint has been reported for early 2027, which is unconfirmed and must be checked.

### Cited Findings
- **Duration, price, prerequisites, version:** 120 minutes; $300 USD plus tax, or Cisco Learning Credits; no prerequisites. The CCNA v1.1 exam topics are the current ones. — [Cisco exam page (search snippet)](https://www.cisco.com/c/en/us/training-events/training-certifications/exams/current-list/ccna-200-301.html); [Global Knowledge](https://www.globalknowledge.com/en-us/products/cisco/200-301)
- **Price variation:** third-party sources say the price has historically ranged from $300 to $355, and one cites $330. — [examcert.app guide](https://www.examcert.app/blog/cisco-ccna-certification-guide/)
- **Possible v2.0:** one study guide says a v2.0 blueprint has its first test date on 3 February 2027. This is unconfirmed against Cisco. — [hakia.com](https://hakia.com/skills/certifications/ccna/) (secondary; listed as updated July 2026)
- **Network Fundamentals weight:** 20% (v1.1, secondary tables). — [simeononsecurity](https://simeononsecurity.com/ccna-start/)
- **No going back:** you cannot return to a previous question after clicking "Next", and you cannot mark questions for review. Inside a sim or testlet you can move among its sub-questions, but once you leave the item you cannot return. Unanswered questions score zero, so the standard advice is to guess and move on. — [9tut FAQ & tips](https://www.9tut.com/?p=51); [prepforcerts](https://prepforcerts.org/how-many-questions-on-cisco-ccna-exam); [r/ccna thread](https://redlib.hackliberty.org/r/ccna/comments/1l2apak/can_you_skip_labs_and_come_back_later_in_exam) (community sources)
- **Sims:** you configure one or more simulated devices over the CLI to meet requirements (VLANs, trunking, OSPF, ACLs). Partial credit per task is reported. The number of sims varies, and older FAQs say about 4. — [9tut](https://www.9tut.com/?p=51); [computingforgeeks (snippet)](https://computingforgeeks.com/ccna-exam-question-types-sim-strategy/)
- **New v1.1 topics:** a vendor reports generative AI, cloud network management and machine learning as additions. — [how2pass](https://www.how2pass.com/200-301-practice-test-questions.php) (vendor claim)

### Inferences
Simulation-mode configuration: these defaults are a design proposal.
- **Timer:** 120 minutes.
- **Length:** about 100 questions. Community estimates usually say 90–110, but Cisco does not publish a count; see the gaps.
- **Navigation:** `linear_no_back=true`, with no flagging.
- **Testlet groups:** free navigation inside a sim or testlet, locked after exit.
- **Item mix:** roughly 75–85% MCQ, 10–15% drag-and-drop, and 2–4 sims.
- **Topic weights:** sample per the exam-topics weights.
- **Feedback:** none until the end, then a per-domain score report similar to Cisco's.

Also offer a "practice" mode with immediate feedback and back-navigation, toggled separately.

Use a scaled score display, but say clearly that Cisco's passing score is not published. Community figures of about 825/1000 are unofficial and must not be presented as fact.

Language: offer the exam simulation in English only, with an optional Romanian helper toggle in practice mode. (I did not verify the official exam languages this session; check cisco.com.)

### Gaps
- I could not reach cisco.com to confirm the number of questions, the official languages, the v2.0 date or the v1.1 weights. Access to the Cisco exam page has to be allowed in this session's network settings, or the facts checked by hand.
- Cisco does not publish the passing score or the scoring rules. Treat community figures as unofficial.

## 5. Packet Tracer (version, free availability, file formats, Activity Wizard/grading, limits vs real IOS); GNS3/EVE-NG/CML; how to write lab guides

### Takeaway
Packet Tracer 9.0.x is free with a NetAcad / Skills for All account, gated behind a free "Getting Started with Cisco Packet Tracer" course, and runs on Windows, macOS and Ubuntu. Its Activity Wizard (`.pka` files) lets you build an answer network with scored assessment items and connectivity tests. This makes it the ideal guided-lab engine for a beginner. Packet Tracer simulates only a subset of IOS, so add CML-Free (5 nodes), GNS3 or EVE-NG Community for real IOS behaviour once the learner is past the basics.

### Cited Findings
- **Distribution:** Packet Tracer is distributed through Cisco Networking Academy and downloads after a free sign-in. Windows, Linux and macOS are supported. One guide says the download is tied to the free Getting Started course. Packet Tracer authenticates through Skills for All / NetAcad at launch. — [computernetworkingnotes](https://www.computernetworkingnotes.com/ccna-study-guide/download-packet-tracer-for-windows-and-linux.html); [netpilot download guide](https://www.netpilot.io/blog/cisco-packet-tracer-download-guide); [Arch Wiki](https://wiki.archlinux.org/title/Packet_Tracer)
- **Current version:** sources conflict.
  - Most sources name 9.0.0 (released around October 2025) as the latest. — [computernetworkingnotes](https://www.computernetworkingnotes.com/ccna-study-guide/download-packet-tracer-for-windows-and-linux.html)
  - techdows reports 9.0.1, announced 25 July 2026. This is unconfirmed by a second source. — [techdows (snippet)](https://techdows.com/download-cisco-packet-tracer-for-pc-windows-11-10-mac.html)
  - An older page calls 9.0 an "open beta" and 8.2.2 build 0400 the stable release. This is likely outdated. — [packettracernetwork.com](https://www.packettracernetwork.com/download/download-packet-tracer.html)
  - Older 7.x releases are unsupported.
  - Other references: [Debian 13 install guide (PT 9.0)](https://www.sysnettechsolutions.com/en/install-packet-tracer-debian/); Cisco "What's New" help: [tutorials.ptnetacad.net](https://tutorials.ptnetacad.net/help/default/whatsNew.htm) (not reachable this session)
- **Activity Wizard:**
  - Workflow: build the answer network, then set the assessment items (each with a point value and component), connectivity tests and overall feedback. Distributed activity files can be password-protected, so learners cannot open the wizard.
  - The official help covers running activities and scoring models and scripting.
  - Sources: [Activity Wizard help](https://tutorials.ptnetacad.net/help/default/activityWizard.htm); [Running Activity Files](https://tutorials.ptnetacad.net/help/default/activityWizard_run.htm); [Scoring Model/Scripting](https://tutorials.ptnetacad.net/help/default/activityWizard_scoringModelAndScripting.htm); [Packt book ch. 11 "Creating Packet Tracer Assessments"](https://oreilly.com/library/view/packet-tracer-network/9781782170426/ch11.html)
  - Community-reported issues: point-value weighting not taking effect, and the "Activity Grader" mislabelling its score as a percentage. — [Cisco Community](https://community.cisco.com/t5/cisco-software-discussions/where-is-the-activity-grader/m-p/4580426/highlight/true); [static-route recognition bug](https://community.cisco.com/t5/cisco-bug-discussions/cisco-packet-tracer-7-2-activity-wizard-not-recognizing-static/td-p/3712416)
  - File formats: `.pkt` is a network or topology file and `.pka` is an activity file, by standard convention in the PT docs above. Newer PT versions also use `.pksz` for packaged files with media. That last point comes from general knowledge and was not verified this session.
- **Limits vs real IOS:**
  - Packet Tracer implements a subset of IOS and predicts CLI output rather than running real IOS code.
  - Known gaps include iBGP, OSPF neighbour troubleshooting, ACL edge cases and STP behaviour.
  - Sources: mostly NetPilot, which sells a competing product, so treat them as biased: [netpilot PT limitations](https://www.netpilot.io/blog/packet-tracer-limitations); [netpilot PT vs real IOS](https://netpilot.io/packet-tracer-vs-real-ios); [CloudMyLab GNS3 vs PT](https://blog.cloudmylab.com/gns3-vs-packet-tracer)
- **CML-Free:**
  - Introduced in CML 2.8. It runs up to 5 nodes at once with no license; unmanaged switches and external connectors don't count toward the limit.
  - Cisco VM images supplied with CML are licensed only for use within CML.
  - Sources: [CML-Free docs](https://developer.cisco.com/docs/modeling-labs/cml-free/); [CML 2.8 release notes](https://developer.cisco.com/docs/modeling-labs/2-8/cml-release-notes/); [CML 2.9 CML-Free](https://developer.cisco.com/docs/modeling-labs/2-9/cml-free/); [NetworkLessons note](https://notes.networklessons.com/cisco-cml-28-for-free-with-5-node-limit)
  - The paid Personal tier is reported at about $199/year for 20 nodes, per a competitor blog; unverified. — [netpilot CML cost](https://www.netpilot.io/blog/cisco-cml-cost)
- **GNS3 and EVE-NG:**
  - Both run real images, but you must supply legally obtained IOS images, for example via CML or employer licensing. Plan on roughly 16 GB RAM.
  - EVE-NG Community Edition is free, with a reported cap of about 63 nodes.
  - Source: [netpilot CCNP labs](https://www.netpilot.io/blog/ccnp-labs-practice-environments) (vendor, unverified)

### Inferences
**Tool progression for a beginner:**
1. Packet Tracer `.pka` guided labs, auto-graded.
2. Packet Tracer `.pkt` solo labs, with self-verification.
3. CML-Free, at most 5 nodes, for real-IOS topics such as OSPF neighbours, ACL edge cases and STP. This is the only fully legal, free source of real Cisco images.

GNS3 and EVE-NG are optional for advanced learners. The platform should never distribute IOS or IOL images.

**Lab guide template:**
1. Title, exam-topic codes, estimated time, and difficulty (guided, semi-guided or solo).
2. Objectives: 3–5 measurable "you will be able to..." statements.
3. Topology diagram (PNG or SVG) plus the downloadable `.pkt`/`.pka`.
4. Addressing table: device, interface, IP/prefix, default gateway, VLAN.
5. Initial state, for example "cabled, unconfigured" or "preconfigured with faults".
6. Step-by-step tasks.
   - Guided level: exact commands, each explained, plus the expected output.
   - Semi-guided level: the requirement only, with hints collapsed.
   - Solo level: requirements only.
7. Verification section. Name the `show` commands and expected key lines (for example `show ip interface brief`, `show vlan brief`, `show ip ospf neighbor`, ping/traceroute results), plus the PT Activity Wizard check list for `.pka`.
8. Common errors and troubleshooting tips.
9. Full solution configs per device (`show running-config` excerpts), hidden behind a reveal button.
10. Reflection and retrieval questions that feed the SRS.
11. A "Packet Tracer vs real IOS" note wherever behaviour differs.

**Grading of solo labs outside PT:** use a "paste your `show run`" checker that parses the config, or self-checks against verification output. The Activity Wizard is the simplest auto-grader, but it has known quirks, so test every `.pka` against the solution.

### Gaps
- I could not confirm the exact PT build as of November 2026 (9.0.0 vs 9.0.1) or the `.pksz` details, because netacad/ptnetacad were unreachable.
- Licensing terms for redistributing self-authored `.pka` files were not researched. Learners need PT installed, which requires a NetAcad account. Whether Cisco's PT EULA constrains publishing activity files is a gap, though it is common practice in the community.
- The EVE-NG node cap and the CML Personal pricing come only from a vendor blog.

## 6. Legal and licensing: Cisco topology icons, and Wikimedia Commons equipment photos

### Takeaway
Cisco's Network Topology Icons page lets anyone use the icons, provided they are not altered. Cisco's copyright guidelines also apply, and questions go to ciscologos@cisco.com. Don't use Cisco *logos* or trademarks in a way that implies endorsement. Wikimedia Commons photos can be reused under each file's own license, usually CC BY or CC BY-SA. Attribute with TASL (Title, Author, Source, License), host local copies rather than hotlinking, and respect ShareAlike for modified images.

### Cited Findings
- **Cisco icons:** the official Network Topology Icons page says they may be used freely, but cannot be altered. Downloads are available for print, Visio stencils (.vss), video and multimedia. — [Cisco Network Topology Icons](https://cisco.com/c/en/us/about/brand-center/network-topology-icons.html) (via search snippet)
- **Cisco copyright:** all use of Cisco copyrighted materials is subject to Cisco's "Guidelines for Use of Cisco Copyrighted Materials". Permission requests go to ciscologos@cisco.com. — [Cisco Copyright Use and Policies](https://www.cisco.com/c/en/us/about/brand-center/copyright-use.html); [Cisco Brand Center](https://www.cisco.com/c/en/us/about/brand-center.html); [Logo usage guidelines](https://www.cisco.com/c/en/us/about/brand-center/logo-usage-guidelines.html)
- **Open question:** a Cisco Community post asking whether the icons may be used in third-party training materials that are sold has no answer. — [Cisco Community: Licensing for Cisco network topology icons](https://community.cisco.com/t5/online-tools-and-resources/licensing-for-cisco-network-topology-icons/ta-p/2498609)
- **Wikimedia Commons reuse rules:**
  - Almost all Commons content may be reused under conditions that depend on each file's license. Attribution is recommended even for public-domain files.
  - The uploader may not be the author, so check the file page.
  - Copying the author and license information from the description page is usually sufficient.
  - Hotlinking is possible but not recommended.
  - Source: [Commons:Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia); [licenses subpage](https://c.enwp.org/wiki/Commons:Reusing_content_outside_Wikimedia/licenses)
- **TASL attribution:** Creative Commons recommends Title, Author, Source and License, including as much as is available. — [CC Recommended practices for attribution](https://wiki.creativecommons.org/Best_practices_for_attribution); [CC reusing licensed content](https://creativecommons.org/reusing-cc-licensed-content/)
- **ShareAlike:** CC BY-SA permits commercial use and derivatives, but adaptations must carry the same or a compatible license. — [Meta: CC licenses re-use](https://meta.wikimedia.org/wiki/Open_Science_for_Arts,_Design_and_Music/Guidelines/Creative_Commons_Licenses/Re-use)

### Inferences
**Icons:**
- Use the official Cisco topology icons unmodified. That means no recolouring and no cropping, and probably no dark-mode inversion; ask Cisco if a dark-mode version is needed.
- Add a footer: "Cisco, Cisco IOS, CCNA and Packet Tracer are trademarks of Cisco Systems, Inc. This site is not affiliated with or endorsed by Cisco."
- Never use the Cisco logo or the CCNA certification badge as site branding.
- Alternative: draw.io/diagrams.net's built-in Cisco-style shapes or generic icons. Verify the licence of whichever shape library is used.

**Photos:**
- Download each Commons image, store it locally, and keep a metadata record per image: title, author, source URL, licence and licence URL, and "modified: yes/no".
- Render a caption like "Foto: «Cisco Catalyst 2960» de [Autor], via Wikimedia Commons, CC BY-SA 4.0 (link)". Romanian UI wording is fine, as long as the licence name and link stay intact.
- If you crop or annotate a CC BY-SA photo, release the derivative under CC BY-SA and say it was modified.
- Avoid files marked "non-free" or "fair use". Those come from Wikipedia, not Commons, and are not reusable.
- Beware product photos where the Cisco logo is visible. Trademark rights are separate from copyright; Commons often tags these with a "trademarked" template. Incidental appearance in an educational context is generally low-risk, but this is not legal advice.

### Gaps
- I could not read the full text of Cisco's Guidelines for Use of Copyrighted Materials or the icon page, because cisco.com was blocked. So the precise conditions remain unknown: attribution wording, and whether commercial or paid platforms are covered. Recommendation: email ciscologos@cisco.com if the platform will ever be monetized.
- I found no source on whether a Packet Tracer UI screenshot may be republished. Cisco's copyright guidelines would govern it.
