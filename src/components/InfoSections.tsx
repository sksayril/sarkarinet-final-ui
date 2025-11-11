import React from 'react';

const InfoSections: React.FC = () => {
  // Function to convert text content to properly formatted paragraphs with clickable links
  const formatContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Process paragraph to create React elements with links
      const processText = (text: string): (string | JSX.Element)[] => {
        const parts: (string | JSX.Element)[] = [];
        const tokens: Array<{ type: 'text' | 'sarkari-jobs' | 'url'; value: string; index: number }> = [];
        
        // Find all "Sarkari Jobs" matches
        const sarkariJobsRegex = /\bSarkari Jobs\b/gi;
        let match;
        while ((match = sarkariJobsRegex.exec(text)) !== null) {
          tokens.push({ type: 'sarkari-jobs', value: match[0], index: match.index });
        }
        
        // Find all URL matches
        const urlRegex = /(\b(?:https?:\/\/)?[a-zA-Z0-9-]+\.com\b)/g;
        while ((match = urlRegex.exec(text)) !== null) {
          tokens.push({ type: 'url', value: match[0], index: match.index });
        }
        
        // Sort tokens by index
        tokens.sort((a, b) => a.index - b.index);
        
        // Build parts array
        let lastIndex = 0;
        tokens.forEach((token) => {
          // Add text before token
          if (token.index > lastIndex) {
            parts.push(text.substring(lastIndex, token.index));
          }
          
          // Add token as link
          if (token.type === 'sarkari-jobs') {
            parts.push(
              <a
                key={`sarkari-jobs-${index}-${token.index}`}
                href="https://sarkarijob.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                style={{ textDecoration: 'underline' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://sarkarijob.com', '_blank', 'noopener,noreferrer');
                }}
              >
                {token.value}
              </a>
            );
          } else if (token.type === 'url') {
            const url = token.value.startsWith('http') ? token.value : `https://${token.value}`;
            parts.push(
              <a
                key={`url-${index}-${token.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                {token.value}
              </a>
            );
          }
          
          lastIndex = token.index + token.value.length;
        });
        
        // Add remaining text
        if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
        }
        
        return parts.length > 0 ? parts : [text];
      };
      
      const processedParts = processText(paragraph);
      
      return (
        <p key={index} className="text-base text-gray-800 leading-relaxed text-justify mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
          {processedParts}
        </p>
      );
    });
  };
  const sections = [
    {
      title: 'Saarkariresult.com : Resources To Help Students to Get Government Jobs (Sarkari Jobs/Sarkari Naukari) 😎',
      color: 'bg-red-700',
      content: `The future remains uncertain; however, a government job through Sarkari Jobs can provide the stability and security you seek. Click to explore trusted resources and expert assistance from Sarkari Result.

In August 2021 alone, more than 1.5 million individuals across rural and urban India lost their jobs. The COVID-19 pandemic has had a profound impact on the job market, prompting both small enterprises and multinational corporations to reassess their staffing needs.

Are you currently unemployed due to economic disruption? Are you employed in a multinational firm facing restructuring? Are you a recent graduate searching for your first opportunity? Are you contemplating whether a government position is the right path for you?

You have arrived at the right destination. Sarkari Result offers valuable insights into the advantages of Indian government employment and is committed to guiding you towards a secure, long-term career that aligns with your aspirations.

So We are Always Ready to Deliver the Latest Government Job Vacancies, Results, Admit Cards, and More — Superfast, All in One Place! Only On Sarkari Result.`
    },
    {
      title: '🔎 Why To Choose Government Jobs With Sarkari Result?',
      color: 'bg-red-700',
      content: `In India, a Sarkari Naukri—or government job—is widely regarded as one of the most prestigious and secure career options. 🏛️ It offers long-term job security 🔐, handsome salaries 💰, pension benefits 🧾, and a professional work environment 👔 that fosters respect, stability, and growth 📈.

Beyond financial rewards 💵, a government job provides a sense of purpose 🎯 and public service 🤝. Working in a Sarkari Naukri means contributing meaningfully to the development and welfare of the nation 🇮🇳.

📉 Rising Unemployment and the Growing Demand for Sarkari Results
According to the Centre for Monitoring Indian Economy (CMIE) 📊, India’s unemployment rate increased from 6.5% in November 2020 to 7.75% in October 2021. In today’s competitive and uncertain job market 😟, the demand for Sarkari Naukri notifications has surged 📢. Aspirants now actively rely on platforms like SarkariResult 💻 for real-time updates ⏱️ on the latest job vacancies 📝, exam dates 📆, admit cards 🎫, and results 📄.

💼 High-Paying Government Jobs in India
Some of the most lucrative and sought-after government jobs in India include positions in the:

1. 🏆 Indian Administrative Service (IAS)

2. 🌐 Indian Foreign Service (IFS)

3. 🚓 Indian Police Service (IPS)

These roles not only offer attractive pay scales 💸 and job perks 🎁 but also prestige 🏅 and influence 🧠. They are, however, highly competitive ⚔️, requiring a deep understanding of the application process, eligibility criteria, and exam patterns 📚.`
    },
    {
      title: '⭐ Why to Choose Only SarkariResult?',
      color: 'bg-red-700',
      content: `When it comes to preparing for UPSC, SSC, Railway, Banking, or State Government Exams, SarkariResult stands out as the most trusted and feature-rich platform for millions of aspirants across India. 🇮🇳

What makes SarkariResult different from others?
✅ Real-Time AI Voice Chatbot Support 🤖
Need instant help or exam guidance? Our AI-powered voice chatbot is available 24/7 to answer your doubts, guide your preparation, and offer personalized support — just like a real mentor.

✅ Challenging Quizzes to Sharpen Your Skills 🧠
Master your exams with our tough and intelligently designed quizzes, created to simulate real exam difficulty. These quizzes are tailored for UPSC, SSC, Banking, and more — helping you identify your weak areas and improve faster.

✅ Exclusive Productivity Tools – All in One Place 🛠️
From image resizers for document uploads to PDF converters, and more — SarkariResult gives you access to essential tools you need during the application process, all under one roof.

✅ Superfast, Reliable, and Accurate Updates ⚡
Get instant alerts for new government job notifications, exam dates, admit cards, results, and cut-off marks — without delay or confusion.`
    },
    {
      title: '🏛️ What Kind of Government Jobs Can I Get in India?',
      color: 'bg-red-700',
      content: `India offers a wide variety of Sarkari Naukri for every qualification — from 10th pass to graduates and postgraduates. Here's a quick look at major categories:

🔹 Civil Services (UPSC) – IAS, IPS, IFS – top-level jobs with prestige, power & pay.
🔹 SSC Exams – CGL, CHSL, MTS, Steno – for 12th pass & graduates.
🔹 Railway Jobs (RRB) – Station Master, Technician, Loco Pilot & Group D roles.
🔹 Banking Jobs (IBPS, SBI, RBI) – PO, Clerk, SO, RBI Grade B – ideal for commerce & general grads.
🔹 Defence & Police – Army, Navy, Air Force, CRPF, BSF, State Police.
🔹 Teaching Jobs – TET, CTET, UGC-NET for school and college-level teaching.
🔹 State Govt Jobs – via State PSCs – Revenue Officer, Sub Inspector, Forest Officer, etc.
🔹 PSU Jobs – BHEL, ONGC, NTPC – Engineers & Management Trainees via GATE.
🔹 Other Jobs – Indian Post (GDS, Postman), Court Jobs, Metro, FCI, LIC, ESIC & more.

🎯 No matter your background or goal, there's a Sarkari Job for you — and SarkariResult helps you find it, prepare for it, and get it.`
    },
    {
      title: '🎯 How to Get a Government Job in This Competitive Era?',
      color: 'bg-red-700',
      content: `Getting a government job (Sarkari Naukri) in today’s competitive world may seem tough — but with the right strategy, tools, and dedication, it's absolutely possible.

Here’s a step-by-step roadmap to help you succeed:

🔹 1. Choose Your Target Exam/Field
Decide whether you want to go for UPSC, SSC, Banking, Railways, Teaching, Police, or State-level jobs. Focus helps you prepare better.

🔹 2. Understand the Exam Pattern & Syllabus
Go through the official syllabus, previous year papers, and exam structure. Knowing what to study is half the battle won.

🔹 3. Follow a Daily Study Plan
Create a realistic timetable with dedicated hours for each subject, revision, and practice. Stay consistent — even 4 focused hours a day can do wonders.

🔹 4. Take Mock Tests & Solve Quizzes
Practice with online mock tests, quizzes, and previous papers to improve speed, accuracy, and confidence.

🔹 5. Stay Updated with Notifications
Use platforms like saarkariresult.com/latest-jobs to get real-time alerts on job openings, exam dates, admit cards & results — don’t miss any opportunity.

🔹 6. Use Smart Tools & Resources
Use handy tools like image resizers, PDF converters, signature croppers, and AI-based help from SarkariResult to speed up the application process.

🔹 7. Stay Motivated & Avoid Distractions
It’s a tough race — but remember, lakhs crack these exams every year. Stay focused, be patient, and don’t compare your journey with others.

✅ With smart preparation, consistent effort, and the right guidance, a government job is within your reach — and SarkariResult is here to help you at every step.`
    },
    {
      title: '📝 Sarkari Result Online Application Process ?',
      color: 'bg-red-700',
      content: `Applying for a Sarkari Naukri through SaarkariResult.com is easy and hassle-free. Follow this simple process to apply online for any government job:

🔹 Step 1: Visit the Official Notification
Carefully read the job notification on SaarkariResult.com. Check eligibility, important dates, vacancy details, and application instructions.

🔹 Step 2: Click on the “Apply Online” Link
Click on the Apply Online button provided with the job post. It will redirect you to the official website of the recruiting body (like UPSC, SSC, IBPS, etc.).

🔹 Step 3: Register Yourself
If you’re a new user, complete your registration with basic details like name, email, mobile number, etc. You’ll receive login credentials.

🔹 Step 4: Fill the Application Form
Log in using your credentials and fill in all required details — personal info, educational background, preferences, etc.

🔹 Step 5: Upload Required Documents
Upload scanned copies of:

Photograph 📷

Signature ✍️

Certificates (if required)
Use image resizer and PDF tools available on SarkariResult to meet size guidelines.

🔹 Step 6: Pay the Application Fee
Pay online via UPI, Net Banking, Credit/Debit Card, etc. Save the receipt for future reference.

🔹 Step 7: Final Submit & Print
Review your form, click Final Submit, and take a printout or save the PDF copy of your application.

✅ That’s it! You’re done. SarkariResult also updates you with real-time alerts on admit cards, exam dates, results, and cut-offs – so you stay ahead.`
    },
    {
      title: 'Eligibility Criteria for Sarkari Exams',
      color: 'bg-red-700',
      content: `For those eyeing Sarkari jobs, through Sarkari Exam, meeting eligibility criteria is pivotal. Academic qualifications, age limits, and specific requirements vary across roles and categories. A comprehensive understanding of the prerequisites ensures candidates can align themselves with the desired positions.

Educational Qualifications: One of the primary aspects of eligibility involves academic qualifications. Different positions demand varying levels of educational attainment. While some roles require a basic educational background, others necessitate advanced degrees or specialized certifications. For instance, positions in administrative services often mandate a graduate degree, while technical roles might require engineering or other specialized qualifications.
Age Limits: Age limitations constitute another crucial facet of eligibility criteria. Government jobs often define specific age ranges within which candidates are eligible to apply. These age restrictions are designed to ensure that candidates possess the requisite vigor and vitality to fulfill the responsibilities of the position. 
Experience and Skill Requirements: Some Sarkari positions may stipulate prior work experience in related fields. Experience requirements could be based on the complexity of the job and the responsibilities it entails.
Nationality and Citizenship: Many government jobs necessitate candidates to be citizens of India. In certain cases, non-citizens may also be eligible, but specific criteria and conditions apply.
Documentation and Verification: Eligible candidates must provide accurate and authentic documentation to support their claims of meeting the criteria. Verification processes are typically conducted to ensure that candidates possess the qualifications and attributes they assert.
Sarkari Job
In India, Sarkari Job are offered by various government institutions at the central and state levels. These jobs are very popular due to their stability, financial security, and attractive perks and benefits. Sarkari jobs are typically advertised through official notifications issued by government institutions, and candidates are required to go through a selection process that may include written exams, interviews, and other assessments.Sarkari jobsSarkari job selection

Sarkari jobs cover a wide range of fields and sectors, including but not limited to, banking, railways, defense, police, teaching, healthcare, engineering, administration, and more. These jobs provide opportunities for candidates with different educational qualifications, ranging from 10th and 12th pass to graduate, postgraduate, and even professional degrees.

One of the key features of Sarkari jobs is that they often come with additional benefits such as job security, pension, health insurance, housing facilities, leave entitlements and retirement benefits. Additionally, these jobs are known for providing opportunities for career growth and advancement through promotions, transfers, and other avenues. However, it’s important to note that the selection process for these jobs can be highly competitive, with numerous candidates applying for limited vacancies. Candidates need to carefully follow the official notifications, meet the eligibility criteria, and prepare well for the selection process to increase their chances of getting a Sarkari job.
`
    },
    {
      title: 'Sarkari Job For 12th Pass ',
      color: 'bg-red-700',
      content: `Candidates who have completed their 12th standard or intermediate education, and now they are interested in govt jobs, can apply for jobs in various fields such as defense, railways, postal services, banking, etc. These jobs provide candidates with job security, attractive salary packages, and other benefits such as pensions, medical facilities, and allowances.

To apply for these Sarkari jobs, candidates need to keep an eye on the official websites of the respective organizations, employment news, and other job portals. They need to fulfill the eligibility criteria set by the organization and then appear for the selection process, which may include a written test, interview, physical fitness test, or other criteria. Overall, Sarkari jobs for 12th pass candidates offer a great opportunity for them to secure their future with a stable and well-paying job in the government sector.
`
    },
    {
      title: 'Sarkari Job For 10th Pass',
      color: 'bg-red-700',
      content: `In India, there are many government job opportunities available for candidates who have passed their 10th standard or secondary education. These Sarkari jobs offer a stable and secure career option with a good salary package, along with other job benefits and perks. Candidates can apply for state police constable, Constable GD in paramilitary, MTS, Peon, etc. Sarkari Job opportunities for 10th pass candidates offer a great career option with job security, attractive salary packages, and other job benefits. Candidates can apply for these jobs by keeping an eye on the official websites of the respective organizations, employment news, and the job portal.Sarkari jobs`
    },
    {
      title: 'How Can Sarkari Result Assist Me in My Job Application Journey?',
      color: 'bg-red-700',
      content: `Embarking on the journey to secure an Indian government job has transitioned to the online sphere, where document scanning and online submissions have become the norm. However, the digitalization of the application process doesn’t necessarily translate to a stress-free experience.

Navigating through the government job application process can indeed be a daunting task, given the myriad of deadlines and exam prerequisites. Instead of shifting through multiple websites, Sarkari Results consolidates all government job listings, offering one-page summaries that encapsulate all vital information in a digestible format. Alleviating some stress from the inherently complex and taxing process, having information readily available can be a game-changer.
`
    },
     
    {
      title: 'Why Choose saarkariresult.com for Sarkari Result?',
      color: 'bg-red-700',
      content: `Sarkari Alert is a very reputed portal providing all the information related to Government Jobs. Here we provide the latest updates on Sarkari job results, admit cards of Sarkariexams, and new jobs. you will find the latest notification regarding Sarkari Jobs Vacancies in a second. We offer up-to-date information regarding Sarkari Job Notifications and the Latest Online Forms. You should visit and explore our page to access all the essential information you need.

At Sarkari Alert, we boast a dedicated team of seven individuals: saarkariresult.com`
    },
     
  ];

  return (
    <div className="w-full min-w-[1200px] px-4 py-6">
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-white border-4 border-red-600 rounded-lg overflow-hidden shadow-lg">
            <div className={`${section.color} text-white p-4 text-center border-b-4 border-red-800`}>
              <h3 className="text-2xl font-bold tracking-wide">{section.title}</h3>
            </div>
            <div className="p-6">
              {formatContent(section.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSections;