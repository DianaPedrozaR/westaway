import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.legalMatter.deleteMany();
  await prisma.onboardingCase.deleteMany();
  await prisma.deal.deleteMany();

  const deals = [
    {
      company: "Zenith Autonomous",
      contact: "Liam Vance",
      stage: "CALL_SCHEDULED" as const,
      lead: "Stephanie",
      source: "AngelList",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "PENDING" as const,
      offerSent: "NA" as const,
      productMatch: "Corporation Startup Package",
      productPrice: "$4,000",
      roundStage: "Pre-incorporation seed stage",
      employees: 0,
      hq: "Austin, TX",
      founder: "Liam Vance",
      founderYear: 2026,
      dealBriefSummary:
        "High-growth drone logistics startup looking to set up clean corporate hygiene before approaching institutional seed VCs.",
      keyRisks: "Unclear IP assignment from prior hobbyist open-source contributions.",
      suggestedQuestions:
        "Ask if prior code was built using university resources or corporate equipment.",
      transcriptExcerpt:
        "Stephanie: Hi Liam, thanks for connecting today. I reviewed the details you submitted through our intake chatbot regarding Zenith Autonomous. It looks like you're looking to formally incorporate and sort out your initial founder share allocation.\nLiam Vance: Exactly. My co-founder and I have been writing code for about six months. We're getting interest from an angel group, but they told us we need to be a Delaware C-Corp before they will wire any money. We also aren't entirely sure how to handle the vesting schedule for our shares so that we protect the company if one of us leaves early.\nStephanie: That's a very common spot to be in. We handle this frequently through our flat-fee Startup Corporation Package, which covers the Delaware filing, corporate bylaws, and founder stock purchase agreements with standard four-year vesting schedules. Before we dive into execution, did you utilize any outside university or former employer equipment when creating the initial drone code?\nLiam Vance: No, we bought our own laptops, but I did commit some early libraries to a public GitHub repo under an open-source license. I want to make sure the company cleanly owns that moving forward.\nStephanie: Got it. I'll make sure our legal brief captures that so we can include a specific intellectual property assignment agreement to roll that repository into the company seamlessly. Let me map out our flat-fee structure for you.",
    },
    {
      company: "BioVigilance AI",
      contact: "Sophia Chen",
      stage: "OPEN_QUESTIONS" as const,
      lead: "Kyle",
      source: "Web",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "PENDING" as const,
      offerSent: "NA" as const,
      productMatch: "Executive Employment Agreement & PIIA",
      productPrice: "$1,200 + $640",
      roundStage: "Series A",
      employees: 14,
      hq: "Boston, MA",
      founder: "Sophia Chen",
      founderYear: 2024,
      dealBriefSummary:
        "Clinical trial monitoring platform upgrading their employee onboarding documents to satisfy stringent healthcare enterprise compliance standards.",
      keyRisks:
        "Potential regulatory exposure with AI-driven diagnostic suggestions; worker classification issues for overseas remote clinicians.",
      suggestedQuestions:
        "Clarify if the target hires are W2 employees or 1099 independent contractors.",
      transcriptExcerpt:
        "Kyle: Sophia, excellent to speak with you. I've gone over the material you dropped into our dynamic form. You mentioned needing robust employment agreements as you expand the BioVigilance AI clinical team.\nSophia Chen: Thanks for taking the time, Kyle. Yes, we just closed our Series A and are scaling up from 14 to 30 people quickly. Our main issue is that we are hiring both domestic software engineers and international medical consultants. Our previous standard employment templates feel way too generic for the level of patient data liability we deal with.\nKyle: Understood. Healthcare AI requires incredibly tight data handling and IP assignment clauses within the PIIA. Are these incoming medical consultants going to be structured as full-time W2 employees or independent contractors?\nSophia Chen: That's actually my main open question. The medical consultants will work roughly 15 hours a week, setting their own schedules, but they will be interacting directly with our core proprietary models. Can we classify them as contractors while still completely locking down the IP they generate?\nKyle: Yes, you can, but the agreement must be highly customized to balance independent worker classification with bulletproof invention assignment. If the workflow triggers employee-like management, state regulators might flag it. Let me put together a structured approach for both paths so your compliance team can review.",
    },
    {
      company: "Obsidian Ledger",
      contact: "Marcus Thorne",
      stage: "FOLLOW_UP" as const,
      lead: "Stephanie",
      source: "Other (Venture Referral)",
      engagementType: "PER_PROJECT" as const,
      // Seeded as not-yet-drafted so the "Request AI Draft" button triggers a
      // genuine, freshly generated draft rather than replaying a canned one.
      offerDrafted: "PENDING" as const,
      offerSent: "NA" as const,
      productMatch: "Master Service Agreement",
      productPrice: "$1,600",
      roundStage: "Seed Stage",
      employees: 6,
      hq: "New York, NY",
      founder: "Marcus Thorne",
      founderYear: 2025,
      dealBriefSummary:
        "Fintech infrastructure startup requiring a standardized Master Services Agreement and Statement of Work template to accelerate enterprise sales cycles.",
      keyRisks:
        "High indemnification caps demanded by financial institution clients; strict SLA commitments.",
      suggestedQuestions:
        "Review the standard liability caps the founders are comfortable accepting.",
      transcriptExcerpt:
        "Stephanie: Hi Marcus, following up on our session last Tuesday. Our automated system has pulled together a draft template framework for your new enterprise MSA based on your requirements. I wanted to review the draft parameters before Kyle signs off on the final proposal.\nMarcus Thorne: Perfect timing. We are in late-stage talks with two regional banks. Their procurement teams are sending over massive legal packets, but we want to push our own MSA first to keep control of the negotiation baseline.\nStephanie: That's exactly the right strategy. Our draft limits your aggregate liability to the fees paid over the previous 12 months, which protects your balance sheet. Have the banks already hinted at demanding uncapped indemnification for data breaches?\nMarcus Thorne: They haven't stated it directly yet, but their initial security questionnaire implies heavy exposure requirements. If they push back on our 12-month liability cap, what's our standard fallback position?\nStephanie: We typically advise a super-cap specifically for data security incidents, usually matching your cybersecurity insurance policy limits. I'll make sure that option is clearly detailed in the email proposal I'm prepping for you right now.",
    },
    {
      company: "NovaGrid Energy",
      contact: "Elena Rostova",
      stage: "WON" as const,
      lead: "Kyle",
      source: "Web",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "Independent Contractor Agreement",
      productPrice: "$1,200",
      roundStage: "Pre-seed",
      employees: 3,
      hq: "Denver, CO",
      founder: "Elena Rostova",
      founderYear: 2026,
      dealBriefSummary:
        "Clean-tech startup requiring localized independent contractor agreements for grid-modeling specialists based out of multiple states.",
      keyRisks:
        "Multi-jurisdictional non-compete enforceability rules shifting across different state lines.",
      suggestedQuestions:
        "Check which specific states the contractors reside in to ensure local compliance.",
      transcriptExcerpt:
        "Kyle: Elena, great to have you onboard. The deal has officially moved to our won stage, and I see your payment came through seamlessly via the Stripe link.\nElena Rostova: Wonderful! I am looking forward to getting these contractor agreements finalized. We have three grid engineers starting next month, and they are located across Colorado, California, and New York.\nKyle: Perfect. Because California and New York have highly specific and restrictive laws regarding independent contractor classification and non-compete clauses, we will utilize our modular templates to customize the agreements for those specific locations.\nElena Rostova: That's a relief. I was worried we'd have to pay for three completely separate projects, but your flat-fee structure made it very straightforward.\nKyle: Absolutely. Our onboarding link is heading to your inbox right now. It will connect you to our interactive onboarding chatbot where you can drop in the names, addresses, and specific scopes of work for each contractor so we can pre-fill the final files.",
    },
    {
      company: "Apex Hyperware",
      contact: "Devendra Naidu",
      stage: "INVOICE_LOE_SENT" as const,
      lead: "Kyle",
      source: "AngelList",
      engagementType: "GENERAL_COUNSEL" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "General Counsel Ongoing Monthly Retainer (SCALE tier)",
      productPrice: "$9,500/mo",
      roundStage: "Growth Stage",
      employees: 45,
      hq: "San Francisco, CA",
      founder: "Devendra Naidu",
      founderYear: 2022,
      dealBriefSummary:
        "Scaled software firm looking to transition away from variable hourly legal billing into a predictable monthly General Counsel flat-fee model.",
      keyRisks: "Scope creep regarding high-volume customized commercial sales contracts.",
      suggestedQuestions: "Define exact parameters of ongoing monthly document review limits.",
      transcriptExcerpt:
        "Kyle: Devendra, good to touch base. I just sent over the Letter of Engagement and the Stripe setup link for our recurring General Counsel package. I want to make sure the transition from your previous firm goes smoothly.\nDevendra Naidu: Thanks, Kyle. The pricing clarity is exactly why we're switching. Our last firm charged us $650 an hour just to review basic marketing agreements, which made it impossible to budget accurately. Your flat monthly fee is much more aligned with our operations.\nKyle: We hear that all the time. Our business model relies on total efficiency through automation, so your volume fits right into our infrastructure. The LOE outlines the 12-month commitment covering all your day-to-day employment, commercial, and board governance matters.\nDevendra Naidu: I see the link in my inbox now. Once I execute this and swipe our corporate card, what are the immediate next steps to upload our legacy documents?\nKyle: As soon as Stripe registers the transaction, our portal will deploy an onboarding link. You'll be able to link your existing corporate Dropbox folder directly to our vault, allowing our internal system to index your legal history for immediate use.",
    },
    {
      company: "Mirror Mirage Cosmetics",
      contact: "Chloe Jenkins",
      stage: "PAID" as const,
      lead: "Stephanie",
      source: "Web",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "Federal Trademark Application Package",
      productPrice: null,
      roundStage: "Bootstrapped",
      employees: 2,
      hq: "Los Angeles, CA",
      founder: "Chloe Jenkins",
      founderYear: 2025,
      dealBriefSummary:
        "Direct-to-consumer beauty brand seeking federal trademark protection for their primary brand name and flagship product line.",
      keyRisks:
        "Potential likelihood of confusion clearance conflicts with existing established cosmetic marks.",
      suggestedQuestions: "Perform a preliminary USPTO TESS database scan before compiling the final client filing.",
      transcriptExcerpt:
        "Stephanie: Hi Chloe, I'm confirming that your payment has been received and processed. Your deal status has been moved to our paid tier, and your dedicated project space is live.\nChloe Jenkins: That's great news! We have our big social media product launch coming up fast, so I'm anxious to get our application submitted to the USPTO as quickly as possible.\nStephanie: We are ready to roll. The automated welcome packet has been dispatched. It contains a secure onboarding link where you will interact with our intake AI to upload your brand logos and define your exact product classifications.\nChloe Jenkins: Perfect. Is there anything I need to compile ahead of time for the chatbot conversation?\nStephanie: Just have your specific product descriptions and clear images of your packaging ready. The chatbot will guide you through the process, and then our team will conduct the comprehensive clearance search to ensure a smooth path to registration.",
    },
    {
      company: "Foundry Core Real Estate",
      contact: "Tariq Sterling",
      stage: "ONBOARDING" as const,
      lead: "Stephanie",
      source: "Other (Broker Intro)",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "Standard Commercial Lease Agreement",
      productPrice: null,
      roundStage: "Late Seed",
      employees: 8,
      hq: "Miami, FL",
      founder: "Tariq Sterling",
      founderYear: 2023,
      dealBriefSummary:
        "Prop-tech and real estate syndication platform creating a standard commercial lease template for their commercial tenants.",
      keyRisks:
        "Local landlord-tenant statutory compliance updates; default remedy enforcement rules.",
      suggestedQuestions: "Verify the specific municipal zoning variances impacting the lease liabilities.",
      transcriptExcerpt:
        "Stephanie: Tariq, congratulations on moving to the onboarding phase. I see you've initiated your onboarding setup page. Let's make sure you have everything needed to complete the workflow.\nTariq Sterling: Thanks, Stephanie. I'm currently on step two of the onboarding home page, chatting with your conversational legal assistant to outline our default enforcement terms. The interface is surprisingly smooth compared to legacy questionnaires.\nStephanie: That's wonderful to hear. That conversational layer feeds directly into step four, which will generate a side-by-side split screen showing your draft lease document with an editable sidebar for quick fine-tuning.\nTariq Sterling: I see that window pop up now. It accurately pulled the tenant notice periods we discussed. I'll finish confirming these data points so your team can run the final compliance check.",
    },
    {
      company: "Helix Synthesis",
      contact: "Amara Okafor",
      stage: "ONBOARDED" as const,
      lead: "Kyle",
      source: "Web",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "Custom Mutual NDA Template",
      productPrice: "$320",
      roundStage: "Seed Stage",
      employees: 5,
      hq: "Seattle, WA",
      founder: "Amara Okafor",
      founderYear: 2025,
      dealBriefSummary:
        "Bioinformatics startup needing a mutual NDA template for sensitive deep-tech partnership explorations.",
      keyRisks: "Overly broad definitions of confidential information causing enforcement vulnerabilities.",
      suggestedQuestions: "Ensure clean exclusions for information developed independently without access to shared documents.",
      transcriptExcerpt:
        "Kyle: Amara, your account status is officially set to onboarded. Your customer vault is fully configured and integrated with your historic documentation.\nAmara Okafor: Excellent. Your platform made it incredibly easy to complete the spreadsheet mappings for our technical founder details during the onboarding phase.\nKyle: Fantastic. The information gathered has successfully populated your custom mutual NDA template. It's now living inside your customer vault as a canonical document ready for distribution.\nAmara Okafor: Perfect. Now that we are fully onboarded, can I instantly generate variations of this agreement whenever we bring on a new technical advisor?\nKyle: Yes, exactly. Because your context layer is completely built out, you can prompt our system to spin up custom executions instantly, keeping your internal workflows nimble.",
    },
    {
      company: "Aeon Robotics",
      contact: "Julian Vance",
      stage: "UNQUALIFIED" as const,
      lead: "Stephanie",
      source: "Web",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "PENDING" as const,
      offerSent: "NA" as const,
      productMatch: "N/A (Outside Scope)",
      productPrice: null,
      roundStage: "Series B",
      employees: 80,
      hq: "Chicago, IL",
      founder: "Julian Vance",
      founderYear: 2020,
      dealBriefSummary:
        "High-complexity cross-border manufacturing patent dispute requiring intense courtroom litigation resources.",
      keyRisks:
        "High operational complexity mismatch; firm business model is built exclusively around fixed-fee transactional corporate matters.",
      suggestedQuestions: "Diplomatically refer the prospect to a specialized litigation defense boutique.",
      transcriptExcerpt:
        "Stephanie: Julian, I appreciate you walking me through the patent conflict details during our initial intake scan.\nJulian Vance: Thanks, Stephanie. We need a team that can step in immediately, challenge the jurisdiction of the plaintiff's filing, and handle depositions across three international offices. We need a transparent pricing model for this fight.\nStephanie: I completely understand your need for cost certainty. However, as our structural guidelines indicate, Westaway focuses strictly on predictable, flat-fee corporate transactional products, such as corporate restructuring, employment matters, and general counsel support. High-stakes cross-border patent litigation is outside our core practice scope.\nJulian Vance: That's a disappointment, but I respect the clarity of your business model. Do you have any recommendations for teams who specialize here?\nStephanie: Yes, absolutely. I am going to drop a link into your email containing two trusted boutique IP litigation firms that handle these specific multi-jurisdictional defense cases.",
    },
    {
      company: "Ironclad Foundry",
      contact: "Fiona Gallagher",
      stage: "LOST" as const,
      lead: "Kyle",
      source: "AngelList",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "Series Seed Equity Financing Package",
      productPrice: "$24,000",
      roundStage: "Seed Stage",
      employees: 4,
      hq: "Pittsburgh, PA",
      founder: "Fiona Gallagher",
      founderYear: 2024,
      dealBriefSummary:
        "Industrial IoT startup exploring a traditional priced equity seed round using modified NVCA templates.",
      keyRisks: "Investor terms pushing for heavy liquidation preferences that complicate future funding rounds.",
      suggestedQuestions: "Evaluate alternative convertible note or SAFE financing models if pricing negotiations stall.",
      transcriptExcerpt:
        "Kyle: Fiona, following up on our comprehensive proposal regarding your upcoming priced seed equity financing package. I wanted to see if your lead investors had any initial feedback on our structured flat-fee layout.\nFiona Gallagher: Hi Kyle, thanks for checking back. The proposal was incredibly thorough, and the price transparency was compelling. However, our lead institutional investor insisted that we use their preferred legacy firm out of New York for this specific round to accelerate their internal legal review.\nKyle: That is completely understandable. Lead institutional venture funds often have deeply ingrained relationships with their historic counsel for priced equity rounds.\nFiona Gallagher: We definitely want to keep working with Westaway for our ongoing operational needs once this round closes, though. Your automated infrastructure is a much better fit for our everyday workflows.\nKyle: We would be delighted to support you down the road. I'll note this deal as archived for now, and we will be right here to step in with our General Counsel package once your funding is fully cleared. Good luck with the closing process!",
    },
    {
      company: "Nimbus Robotics, Inc.",
      contact: "Priya Nair, VP Engineering",
      stage: "ONBOARDING" as const,
      lead: "Stephanie",
      source: "Web",
      engagementType: "PER_PROJECT" as const,
      offerDrafted: "DONE" as const,
      offerSent: "SENT" as const,
      productMatch: "Employment Agreement",
      productPrice: "$1,200",
      roundStage: null,
      employees: null,
      hq: null,
      founder: null,
      founderYear: null,
      dealBriefSummary:
        "Employment Agreement engagement for a new senior engineering hire, currently moving through the AI-guided client onboarding flow.",
      keyRisks: "Equity grant requires Board approval before execution.",
      suggestedQuestions: null,
      transcriptExcerpt: null,
    },
  ];

  const created: Record<string, string> = {};
  for (const deal of deals) {
    const row = await prisma.deal.create({ data: deal });
    created[deal.company] = row.id;
  }

  await prisma.onboardingCase.create({
    data: {
      dealId: created["Nimbus Robotics, Inc."],
      companyName: "Nimbus Robotics, Inc.",
      employeeName: "Jordan A. Rivera",
      matterType: "Employment Agreement",
      currentStep: "UPLOAD",
      uploadedDocs: JSON.stringify([
        { name: "Certificate of Incorporation", uploaded: true },
        { name: "EIN (IRS) confirmation letter", uploaded: false },
        { name: "Bylaws or Operating Agreement", uploaded: false },
        { name: "Board authorization to hire", uploaded: false, optional: true },
        { name: "Current cap table", uploaded: false },
        { name: "Company handbook / HR policies", uploaded: false, optional: true },
      ]),
      pendingItems: JSON.stringify([
        { name: "Certificate of Incorporation", status: "Completed" },
        { name: "EIN (IRS) confirmation letter", status: "Pending" },
        { name: "Bylaws or Operating Agreement", status: "Pending" },
        { name: "Board authorization to hire", status: "Pending" },
        { name: "Current cap table", status: "Pending" },
        { name: "Company handbook / HR policies", status: "Pending" },
        { name: "Employment Agreement", status: "In Progress" },
        { name: "Offer Letter", status: "Pending" },
        { name: "CIIAA", status: "Pending" },
        { name: "At-Will Acknowledgment", status: "Pending" },
        { name: "Stock Option Grant", status: "Pending" },
        { name: "Form I-9", status: "Pending" },
        { name: "Form W-4 + State Withholding", status: "Pending" },
        { name: "Compensation Summary Sheet", status: "Pending" },
        { name: "Employee census / roster entry", status: "Pending" },
        { name: "Cap table update", status: "Pending" },
      ]),
    },
  });

  await prisma.legalMatter.createMany({
    data: [
      {
        companyName: "Nimbus Robotics, Inc.",
        matterName: "Employment Agreement",
        status: "Onboarding",
        date: null,
      },
      {
        companyName: "Nimbus Robotics, Inc.",
        matterName: "Independent Contractor Agreement",
        status: "Completed",
        date: new Date("2026-03-12"),
      },
    ],
  });

  console.log(`Seeded ${deals.length} deals, 1 onboarding case, 2 legal matters.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
